#!/usr/bin/env python3
"""Promote a generated ECHO image into the production repo.

The pipeline is local-first and preserves both:
1. the original generated source bytes under asset_pipeline/source/
2. the canonical web/game asset under the manifest output path

It validates dimensions, computes SHA-256, updates image_manifest.json,
and can commit/push to GitHub main. When --push is used, the asset-content
commit is pushed first; a second metadata commit records that immutable asset
commit SHA and the approved_synced status.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / "asset_pipeline" / "image_manifest.json"
SOURCE_DIR = REPO_ROOT / "asset_pipeline" / "source"
ALLOWED_EXTS = {".jpg", ".jpeg", ".png", ".webp"}


def fail(message: str, code: int = 1) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(code)


def run(cmd: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        cmd,
        cwd=str(REPO_ROOT),
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=check,
    )


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def image_dimensions(path: Path) -> tuple[int, int]:
    proc = run(["sips", "-g", "pixelWidth", "-g", "pixelHeight", str(path)], check=False)
    if proc.returncode != 0:
        fail(f"sips could not inspect image: {proc.stderr.strip()}")
    width = height = None
    for line in proc.stdout.splitlines():
        line = line.strip()
        if line.startswith("pixelWidth:"):
            width = int(line.split(":", 1)[1].strip())
        elif line.startswith("pixelHeight:"):
            height = int(line.split(":", 1)[1].strip())
    if not width or not height:
        fail("could not read image dimensions")
    return width, height


def load_manifest() -> dict[str, Any]:
    try:
        return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"cannot read manifest: {exc}")
    raise AssertionError


def save_manifest_atomic(data: dict[str, Any]) -> None:
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    fd, tmp = tempfile.mkstemp(prefix="image_manifest.", suffix=".json", dir=str(MANIFEST_PATH.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(payload)
        os.replace(tmp, MANIFEST_PATH)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def find_asset(manifest: dict[str, Any], asset_id: str) -> dict[str, Any]:
    for asset in manifest.get("assets", []):
        if asset.get("id") == asset_id:
            return asset
    fail(f"unknown asset id: {asset_id}")
    raise AssertionError


def ensure_inside_repo(path: Path) -> None:
    try:
        path.resolve().relative_to(REPO_ROOT)
    except ValueError:
        fail(f"path escapes repository root: {path}")


def render_canonical(source: Path, target: Path) -> None:
    """Preserve source bytes separately, then create canonical output.

    If source/target formats match, bytes are copied exactly. If they differ,
    macOS sips performs a single canonical conversion for the game asset.
    """
    target.parent.mkdir(parents=True, exist_ok=True)
    src_ext = source.suffix.lower()
    dst_ext = target.suffix.lower()
    jpeg_exts = {".jpg", ".jpeg"}
    same_format = src_ext == dst_ext or (src_ext in jpeg_exts and dst_ext in jpeg_exts)

    if same_format:
        shutil.copyfile(source, target)
        return

    fmt_map = {".jpg": "jpeg", ".jpeg": "jpeg", ".png": "png", ".webp": "webp"}
    fmt = fmt_map.get(dst_ext)
    if not fmt:
        fail(f"unsupported canonical output format: {dst_ext}")
    proc = run(["sips", "-s", "format", fmt, str(source), "--out", str(target)], check=False)
    if proc.returncode != 0 or not target.exists():
        fail(f"canonical conversion failed: {proc.stderr.strip() or proc.stdout.strip()}")


def assert_no_unrelated_changes(allowed_paths: set[str]) -> None:
    proc = run(["git", "status", "--porcelain"])
    unrelated: list[str] = []
    for line in proc.stdout.splitlines():
        path = line[3:]
        if path == ".DS_Store":
            continue
        if path not in allowed_paths:
            unrelated.append(line)
    if unrelated:
        fail("refusing automated commit with unrelated changes:\n  " + "\n  ".join(unrelated))


def git_commit(paths: list[str], message: str) -> str:
    run(["git", "add", "--", *paths])
    proc = run(["git", "commit", "-m", message], check=False)
    if proc.returncode != 0:
        fail(f"git commit failed: {proc.stderr.strip() or proc.stdout.strip()}")
    return run(["git", "rev-parse", "HEAD"]).stdout.strip()


def git_push_main() -> None:
    proc = run(["git", "push", "origin", "main"], check=False)
    if proc.returncode != 0:
        fail(f"git push failed: {proc.stderr.strip() or proc.stdout.strip()}")


def main() -> None:
    ap = argparse.ArgumentParser(description="Import and optionally sync an ECHO generated image.")
    ap.add_argument("--asset-id", required=True)
    ap.add_argument("--source", required=True, help="Generated image file")
    ap.add_argument("--approve", action="store_true", help="Mark visual QA approved")
    ap.add_argument("--force", action="store_true", help="Replace an existing UNAPPROVED target")
    ap.add_argument("--commit", action="store_true", help="Commit source + canonical asset + manifest")
    ap.add_argument("--push", action="store_true", help="Push to origin main; implies --commit and requires --approve")
    args = ap.parse_args()

    source = Path(args.source).expanduser().resolve()
    if not source.is_file():
        fail(f"source image does not exist: {source}")
    if source.suffix.lower() not in ALLOWED_EXTS:
        fail("source must be jpg/jpeg/png/webp")
    if args.push and not args.approve:
        fail("--push requires --approve")

    manifest = load_manifest()
    asset = find_asset(manifest, args.asset_id)
    output_rel = asset.get("output")
    if not output_rel:
        fail(f"asset {args.asset_id} has no output path")

    target = (REPO_ROOT / output_rel).resolve()
    ensure_inside_repo(target)

    current_status = str(asset.get("status", "planned"))
    if target.exists() and current_status in {"approved", "approved_synced", "integrated"}:
        fail("approved MASTER exists; refusing overwrite")
    if target.exists() and not args.force:
        fail(f"target already exists: {target}; use --force only for an unapproved replacement")

    width, height = image_dimensions(source)
    source_sha = sha256_file(source)

    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    source_copy = SOURCE_DIR / f"{args.asset_id}{source.suffix.lower()}"
    if source_copy.exists() and not args.force:
        fail(f"preserved source already exists: {source_copy}")
    shutil.copyfile(source, source_copy)
    if sha256_file(source_copy) != source_sha:
        fail("source preservation byte check failed")

    render_canonical(source_copy, target)
    canonical_sha = sha256_file(target)
    canonical_width, canonical_height = image_dimensions(target)

    asset["source_path"] = str(source_copy.relative_to(REPO_ROOT))
    asset["source_sha256"] = source_sha
    asset["local_path"] = str(target)
    asset["github_path"] = output_rel
    asset["dimensions"] = {"width": canonical_width, "height": canonical_height}
    asset["sha256"] = canonical_sha
    asset["status"] = "approved" if args.approve else "qa_pending"
    save_manifest_atomic(manifest)

    print(f"ASSET={args.asset_id}")
    print(f"SOURCE_COPY={source_copy.relative_to(REPO_ROOT)}")
    print(f"TARGET={output_rel}")
    print(f"SOURCE_DIMENSIONS={width}x{height}")
    print(f"CANONICAL_DIMENSIONS={canonical_width}x{canonical_height}")
    print(f"SOURCE_SHA256={source_sha}")
    print(f"CANONICAL_SHA256={canonical_sha}")
    print(f"STATUS={asset['status']}")

    do_commit = args.commit or args.push
    if not do_commit:
        return
    if not args.approve:
        fail("automated commit requires --approve")

    manifest_rel = str(MANIFEST_PATH.relative_to(REPO_ROOT))
    source_rel = str(source_copy.relative_to(REPO_ROOT))
    allowed = {manifest_rel, source_rel, output_rel}
    assert_no_unrelated_changes(allowed)

    asset_commit = git_commit(
        [source_rel, output_rel, manifest_rel],
        f"assets: add {args.asset_id}",
    )
    print(f"ASSET_COMMIT={asset_commit}")

    if not args.push:
        return

    # First push makes asset_commit immutable on origin/main.
    git_push_main()

    # Record the immutable content commit in a separate metadata commit.
    manifest = load_manifest()
    asset = find_asset(manifest, args.asset_id)
    asset["asset_commit_sha"] = asset_commit
    asset["status"] = "approved_synced"
    save_manifest_atomic(manifest)
    metadata_commit = git_commit(
        [manifest_rel],
        f"chore: record {args.asset_id} asset sync",
    )
    git_push_main()

    local_head = run(["git", "rev-parse", "HEAD"]).stdout.strip()
    remote_head = run(["git", "rev-parse", "origin/main"]).stdout.strip()
    if local_head != remote_head:
        fail(f"post-push verification failed: local={local_head} origin/main={remote_head}")

    print(f"METADATA_COMMIT={metadata_commit}")
    print("PUSH=PASS")
    print("SYNC=approved_synced")


if __name__ == "__main__":
    main()
