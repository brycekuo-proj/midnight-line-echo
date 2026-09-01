#!/usr/bin/env python3
"""Resumable queue runner for ECHO image generation.

Responsibilities:
- reconcile already-generated candidates into image_manifest.json
- select eligible assets from manifest order
- enforce declared dependencies
- resolve exact/shared prompt files
- invoke generate_openai_image.py one asset at a time
- persist status/error/version after every attempt
- persist pipeline_checkpoint.json so interrupted runs can resume safely

This runner never performs visual QA, promotion, git commit, or push.
"""

from __future__ import annotations

import argparse
from datetime import datetime
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
PIPELINE_DIR = REPO_ROOT / "asset_pipeline"
MANIFEST_PATH = PIPELINE_DIR / "image_manifest.json"
CHECKPOINT_PATH = PIPELINE_DIR / "pipeline_checkpoint.json"
DESKTOP_QUEUE_PATH = PIPELINE_DIR / "desktop_generation_queue.json"
PROMPT_DIR = PIPELINE_DIR / "prompts"
GENERATED_DIR = PIPELINE_DIR / "source" / "generated"
GENERATOR = PIPELINE_DIR / "generate_openai_image.py"
TELEGRAM_SENDER = PIPELINE_DIR / "send_telegram_update.py"
TELEGRAM_CONFIG_PATH = PIPELINE_DIR / "local_telegram_config.json"

GENERATABLE_STATUSES = {"planned", "queued", "retry_pending", "blocked_dependency", "blocked_prompt"}
DEPENDENCY_READY = {"approved", "approved_synced", "integrated"}
CANDIDATE_RE = re.compile(r"^(?P<asset>.+)_v(?P<version>\d+)\.(?:png|jpg|jpeg|webp)$", re.I)


def now_iso() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def fail(message: str, code: int = 1) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(code)


def load_json(path: Path) -> dict[str, Any]:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        fail(f"cannot read {path.relative_to(REPO_ROOT)}: {exc}")
    raise AssertionError


def save_json_atomic(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    fd, tmp = tempfile.mkstemp(prefix=f"{path.stem}.", suffix=".tmp", dir=str(path.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(payload)
        os.replace(tmp, path)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def default_checkpoint() -> dict[str, Any]:
    return {
        "schema_version": 1,
        "last_run_started_at": None,
        "last_run_finished_at": None,
        "last_asset_id": None,
        "last_result": None,
        "batch": {"requested": 0, "attempted": 0, "generated": 0, "failed": 0, "blocked": 0},
    }


def load_checkpoint() -> dict[str, Any]:
    if not CHECKPOINT_PATH.exists():
        return default_checkpoint()
    data = load_json(CHECKPOINT_PATH)
    base = default_checkpoint()
    base.update(data)
    if not isinstance(base.get("batch"), dict):
        base["batch"] = default_checkpoint()["batch"]
    return base


def parse_iso(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        return datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None


def load_telegram_config() -> dict[str, Any] | None:
    if not TELEGRAM_CONFIG_PATH.is_file():
        return None
    try:
        data = load_json(TELEGRAM_CONFIG_PATH)
    except SystemExit:
        return None
    if not data.get("enabled", False):
        return None
    return data


def telegram_caption(asset: dict[str, Any]) -> str:
    return "\n".join(
        [
            "[ECHO] image generated",
            f"asset: {asset.get('id', '-')}",
            f"version: v{asset.get('version', '-')}",
            f"status: {asset.get('status', '-')}",
            f"output: {asset.get('source_temp', '-')}",
            f"time: {asset.get('last_generated_at', '-')}",
        ]
    )


def notify_pending_telegram(manifest: dict[str, Any]) -> tuple[int, int, bool]:
    """Send newly generated candidates to Telegram once.

    Returns (sent, failed, manifest_changed). Pre-integration candidates older than
    config.enabled_at are ignored so enabling reporting never floods historical files.
    """
    config = load_telegram_config()
    if not config:
        return 0, 0, False
    enabled_at = parse_iso(str(config.get("enabled_at", "")))
    chat_id = str(config.get("chat_id", "1571185855"))
    sent = failed = 0
    changed = False
    for asset in manifest.get("assets", []):
        if str(asset.get("status")) != "generated":
            continue
        if asset.get("telegram_reported") is True:
            continue
        generated_at = parse_iso(str(asset.get("last_generated_at", "")))
        if enabled_at and generated_at and generated_at < enabled_at:
            continue
        source_temp = asset.get("source_temp")
        if not source_temp:
            continue
        photo = (REPO_ROOT / str(source_temp)).resolve()
        if not photo.is_file():
            continue
        cmd = [
            sys.executable,
            str(TELEGRAM_SENDER),
            "--chat-id", chat_id,
            "--photo", str(photo),
            "--caption", telegram_caption(asset),
            "--message", f"[ECHO] generated {asset.get('id')} v{asset.get('version')}",
        ]
        proc = subprocess.run(cmd, cwd=str(REPO_ROOT), text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        asset["telegram_last_attempt_at"] = now_iso()
        changed = True
        send_lines = {line.strip() for line in proc.stdout.splitlines()}
        photo_delivered = proc.returncode == 0 and "TG_SEND=PASS" in send_lines
        if photo_delivered:
            asset["telegram_reported"] = True
            asset["telegram_reported_at"] = now_iso()
            asset["telegram_last_error"] = None
            sent += 1
            print(f"TG_REPORTED={asset.get('id')}:v{asset.get('version')}")
        else:
            asset["telegram_reported"] = False
            asset["telegram_last_error"] = (proc.stderr.strip() or proc.stdout.strip() or f"exit {proc.returncode}")[-2000:]
            failed += 1
            print(f"TG_REPORT_FAILED={asset.get('id')}", file=sys.stderr)
    return sent, failed, changed


def asset_map(manifest: dict[str, Any]) -> dict[str, dict[str, Any]]:
    return {str(a.get("id")): a for a in manifest.get("assets", []) if a.get("id")}


def candidate_versions(asset_id: str) -> list[tuple[int, Path]]:
    found: list[tuple[int, Path]] = []
    if not GENERATED_DIR.exists():
        return found
    for path in GENERATED_DIR.iterdir():
        if not path.is_file():
            continue
        m = CANDIDATE_RE.match(path.name)
        if not m or m.group("asset") != asset_id:
            continue
        found.append((int(m.group("version")), path))
    return sorted(found)


def reconcile_existing(manifest: dict[str, Any]) -> int:
    """Record latest local candidate for assets still marked pre-generation."""
    changed = 0
    for asset in manifest.get("assets", []):
        asset_id = str(asset.get("id", ""))
        if not asset_id:
            continue
        candidates = candidate_versions(asset_id)
        if not candidates:
            continue
        current = str(asset.get("status", "planned"))
        # Never downgrade QA/approved/integrated states.
        if current in {"qa_pending", "approved", "approved_synced", "integrated"}:
            continue
        version, path = candidates[-1]
        source_temp = str(path.relative_to(REPO_ROOT))
        generated_at = datetime.fromtimestamp(path.stat().st_mtime).astimezone().isoformat(timespec="seconds")
        desired = {
            "status": "generated",
            "source_temp": source_temp,
            "version": version,
            "last_generated_at": generated_at,
            "last_error": None,
        }
        is_changed = any(asset.get(k) != v for k, v in desired.items())
        if "attempts" not in asset:
            asset["attempts"] = len(candidates)
            is_changed = True
        if not is_changed:
            continue
        asset.update(desired)
        changed += 1
    return changed


def resolve_prompt(asset: dict[str, Any]) -> Path | None:
    explicit = asset.get("prompt_file")
    if explicit:
        p = (REPO_ROOT / str(explicit)).resolve()
        if p.is_file():
            return p
        return None

    asset_id = str(asset["id"])
    exact = PROMPT_DIR / f"{asset_id}.md"
    if exact.is_file():
        return exact

    # Shared UI prompt convention: mg_xxx_ui.md serves mg_xxx_* assets.
    matches: list[Path] = []
    for p in PROMPT_DIR.glob("*_ui.md"):
        prefix = p.stem[:-3] if p.stem.endswith("_ui") else p.stem
        if asset_id.startswith(prefix + "_"):
            matches.append(p)
    if matches:
        return sorted(matches, key=lambda p: len(p.stem), reverse=True)[0]
    return None


def dependency_input(asset: dict[str, Any], assets: dict[str, dict[str, Any]]) -> tuple[bool, str | None]:
    deps = [str(x) for x in asset.get("depends_on", [])]
    if not deps:
        return True, None
    for dep_id in deps:
        dep = assets.get(dep_id)
        if not dep or str(dep.get("status")) not in DEPENDENCY_READY:
            return False, None
    # Edit assets use the first dependency's approved canonical output.
    if str(asset.get("generation_mode")) == "edit":
        dep = assets[deps[0]]
        output = dep.get("output")
        if not output:
            return False, None
        p = (REPO_ROOT / str(output)).resolve()
        if not p.is_file():
            return False, None
        return True, str(p)
    return True, None


def next_version(asset_id: str) -> int:
    versions = candidate_versions(asset_id)
    return (versions[-1][0] + 1) if versions else 1


def run_generator(asset: dict[str, Any], prompt: Path, edit_input: str | None, version: int) -> subprocess.CompletedProcess[str]:
    mode_raw = str(asset.get("generation_mode", "generate"))
    mode = "edit" if mode_raw == "edit" else "generate"
    cmd = [
        sys.executable,
        str(GENERATOR),
        "--asset-id", str(asset["id"]),
        "--prompt", str(prompt),
        "--mode", mode,
        "--suffix", f"v{version}",
    ]
    if edit_input:
        cmd.extend(["--input", edit_input])
    return subprocess.run(cmd, cwd=str(REPO_ROOT), text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def print_plan(manifest: dict[str, Any], limit: int, selected: set[str] | None = None) -> None:
    assets = asset_map(manifest)
    selected = selected or set()
    shown = 0
    for asset in manifest.get("assets", []):
        if shown >= limit:
            break
        asset_id = str(asset.get("id", ""))
        if selected and asset_id not in selected:
            continue
        status = str(asset.get("status", "planned"))
        if status not in GENERATABLE_STATUSES:
            continue
        ready, edit_input = dependency_input(asset, assets)
        prompt = resolve_prompt(asset)
        if not ready:
            reason = "blocked_dependency"
        elif not prompt:
            reason = "blocked_prompt"
        else:
            reason = "ready"
        print(f"{asset_id}\t{reason}\tprompt={prompt.relative_to(REPO_ROOT) if prompt else '-'}\tedit_input={edit_input or '-'}")
        shown += 1
    if shown == 0:
        print("QUEUE_EMPTY")


def main() -> None:
    ap = argparse.ArgumentParser(description="Run a resumable ECHO image-generation batch")
    ap.add_argument("--batch-size", type=int, default=5, help="Maximum assets prepared/generated this run")
    ap.add_argument("--backend", choices=["desktop", "api"], default="desktop", help="desktop prepares resumable ChatGPT Desktop jobs; api explicitly uses generate_openai_image.py")
    ap.add_argument("--dry-run", action="store_true", help="Show next queue entries without generating or preparing jobs")
    ap.add_argument("--reconcile-only", action="store_true", help="Record existing candidates, then exit")
    ap.add_argument("--asset-id", action="append", dest="asset_ids", help="Restrict run to one or more asset IDs")
    args = ap.parse_args()
    if args.batch_size < 1:
        fail("--batch-size must be >= 1")

    manifest = load_json(MANIFEST_PATH)
    reconciled = reconcile_existing(manifest)
    if reconciled:
        save_json_atomic(MANIFEST_PATH, manifest)
    print(f"RECONCILED={reconciled}")

    tg_sent = tg_failed = 0
    if not args.dry_run:
        tg_sent, tg_failed, tg_changed = notify_pending_telegram(manifest)
        if tg_changed:
            save_json_atomic(MANIFEST_PATH, manifest)
        print(f"TG_SENT={tg_sent}")
        print(f"TG_FAILED={tg_failed}")

    if args.reconcile_only:
        print("STATUS=reconcile_complete")
        return

    selected = set(args.asset_ids or [])
    assets = asset_map(manifest)
    unknown = selected.difference(assets)
    if unknown:
        fail("unknown --asset-id: " + ", ".join(sorted(unknown)))

    if args.dry_run:
        print_plan(manifest, args.batch_size, selected)
        print(f"BACKEND={args.backend}")
        print("STATUS=dry_run")
        return

    if args.backend == "desktop":
        checkpoint = load_checkpoint()
        checkpoint["last_run_started_at"] = now_iso()
        checkpoint["last_run_finished_at"] = None
        checkpoint["batch"] = {"requested": args.batch_size, "attempted": 0, "generated": 0, "failed": 0, "blocked": 0}
        jobs: list[dict[str, Any]] = []
        for asset in manifest.get("assets", []):
            if len(jobs) >= args.batch_size:
                break
            asset_id = str(asset.get("id", ""))
            if selected and asset_id not in selected:
                continue
            status = str(asset.get("status", "planned"))
            if status not in GENERATABLE_STATUSES:
                continue
            ready, edit_input = dependency_input(asset, assets)
            if not ready:
                asset["status"] = "blocked_dependency"
                checkpoint["batch"]["blocked"] += 1
                continue
            prompt = resolve_prompt(asset)
            if not prompt:
                asset["status"] = "blocked_prompt"
                asset["last_error"] = "prompt file not found"
                checkpoint["batch"]["blocked"] += 1
                continue
            version = next_version(asset_id)
            output = GENERATED_DIR / f"{asset_id}_v{version}.png"
            mode_raw = str(asset.get("generation_mode", "generate"))
            mode = "edit" if mode_raw == "edit" else "generate"
            job = {
                "asset_id": asset_id,
                "version": version,
                "mode": mode,
                "prompt_file": str(prompt.relative_to(REPO_ROOT)),
                "edit_input": edit_input,
                "save_output_as": str(output.relative_to(REPO_ROOT)),
                "canonical_output": asset.get("output"),
                "status": "queued",
            }
            jobs.append(job)
            asset["status"] = "queued"
            asset["prompt_file"] = job["prompt_file"]
            asset["queued_version"] = version
            asset["queued_at"] = now_iso()
            asset["last_error"] = None

        save_json_atomic(MANIFEST_PATH, manifest)
        queue_payload = {
            "schema_version": 1,
            "backend": "chatgpt_desktop_builtin_image_generation",
            "created_at": now_iso(),
            "instructions": [
                "Process jobs in order.",
                "Read each prompt_file before generation.",
                "Use built-in ChatGPT image generation; do not use an external API key.",
                "For edit jobs, use edit_input as the locked source image.",
                "Save the original generated PNG bytes exactly to save_output_as.",
                "After each saved output, rerun run_generation_queue.py --reconcile-only to checkpoint progress.",
            ],
            "jobs": jobs,
        }
        save_json_atomic(DESKTOP_QUEUE_PATH, queue_payload)
        checkpoint["last_asset_id"] = jobs[-1]["asset_id"] if jobs else None
        checkpoint["last_result"] = "desktop_queue_prepared" if jobs else "queue_empty"
        checkpoint["batch"]["attempted"] = 0
        checkpoint["last_run_finished_at"] = now_iso()
        save_json_atomic(CHECKPOINT_PATH, checkpoint)
        print(f"DESKTOP_QUEUE={DESKTOP_QUEUE_PATH.relative_to(REPO_ROOT)}")
        print(f"QUEUED={len(jobs)}")
        print(f"BLOCKED={checkpoint['batch']['blocked']}")
        for job in jobs:
            print(f"JOB={job['asset_id']}:v{job['version']}:{job['prompt_file']}")
        print("STATUS=desktop_queue_prepared")
        return

    checkpoint = load_checkpoint()
    checkpoint["last_run_started_at"] = now_iso()
    checkpoint["last_run_finished_at"] = None
    checkpoint["batch"] = {"requested": args.batch_size, "attempted": 0, "generated": 0, "failed": 0, "blocked": 0}
    save_json_atomic(CHECKPOINT_PATH, checkpoint)

    attempts = 0
    for asset in manifest.get("assets", []):
        if attempts >= args.batch_size:
            break
        asset_id = str(asset.get("id", ""))
        if selected and asset_id not in selected:
            continue
        status = str(asset.get("status", "planned"))
        if status not in GENERATABLE_STATUSES:
            continue

        ready, edit_input = dependency_input(asset, assets)
        if not ready:
            if status != "blocked_dependency":
                asset["status"] = "blocked_dependency"
                save_json_atomic(MANIFEST_PATH, manifest)
            checkpoint["batch"]["blocked"] += 1
            continue

        prompt = resolve_prompt(asset)
        if not prompt:
            if status != "blocked_prompt":
                asset["status"] = "blocked_prompt"
                asset["last_error"] = "prompt file not found"
                save_json_atomic(MANIFEST_PATH, manifest)
            checkpoint["batch"]["blocked"] += 1
            continue

        version = next_version(asset_id)
        asset["status"] = "generating"
        asset["attempts"] = int(asset.get("attempts", 0)) + 1
        asset["last_attempt_at"] = now_iso()
        asset["last_error"] = None
        asset["prompt_file"] = str(prompt.relative_to(REPO_ROOT))
        save_json_atomic(MANIFEST_PATH, manifest)

        attempts += 1
        checkpoint["batch"]["attempted"] = attempts
        checkpoint["last_asset_id"] = asset_id
        checkpoint["last_result"] = "generating"
        save_json_atomic(CHECKPOINT_PATH, checkpoint)

        proc = run_generator(asset, prompt, edit_input, version)
        if proc.returncode != 0:
            message = (proc.stderr.strip() or proc.stdout.strip() or f"generator exited {proc.returncode}")[-4000:]
            asset["status"] = "retry_pending"
            asset["last_error"] = message
            checkpoint["batch"]["failed"] += 1
            checkpoint["last_result"] = "failed"
            print(f"FAILED={asset_id}")
            print(message, file=sys.stderr)
        else:
            expected = GENERATED_DIR / f"{asset_id}_v{version}.png"
            if not expected.is_file():
                asset["status"] = "retry_pending"
                asset["last_error"] = f"generator reported success but output missing: {expected.relative_to(REPO_ROOT)}"
                checkpoint["batch"]["failed"] += 1
                checkpoint["last_result"] = "failed_missing_output"
                print(f"FAILED_MISSING_OUTPUT={asset_id}")
            else:
                asset["status"] = "generated"
                asset["source_temp"] = str(expected.relative_to(REPO_ROOT))
                asset["version"] = version
                asset["last_generated_at"] = now_iso()
                asset["last_error"] = None
                checkpoint["batch"]["generated"] += 1
                checkpoint["last_result"] = "generated"
                print(f"GENERATED={asset_id}:{expected.relative_to(REPO_ROOT)}")
        save_json_atomic(MANIFEST_PATH, manifest)
        if asset.get("status") == "generated":
            _tg_sent, _tg_failed, tg_changed = notify_pending_telegram(manifest)
            if tg_changed:
                save_json_atomic(MANIFEST_PATH, manifest)
        save_json_atomic(CHECKPOINT_PATH, checkpoint)

    checkpoint["last_run_finished_at"] = now_iso()
    save_json_atomic(CHECKPOINT_PATH, checkpoint)
    print("BATCH=" + json.dumps(checkpoint["batch"], ensure_ascii=False, separators=(",", ":")))
    print("STATUS=batch_complete")


if __name__ == "__main__":
    main()
