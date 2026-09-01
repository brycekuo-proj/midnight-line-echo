#!/usr/bin/env python3
"""Batch-promote QA-approved ECHO image candidates using the existing importer."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import subprocess
import sys
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / "asset_pipeline" / "image_manifest.json"
IMPORTER = REPO_ROOT / "asset_pipeline" / "import_generated_image.py"


def load_manifest() -> dict[str, Any]:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def main() -> None:
    ap = argparse.ArgumentParser(description="Promote approved ECHO assets")
    ap.add_argument("--asset-id", action="append", dest="asset_ids", help="Restrict to specified asset ID(s)")
    ap.add_argument("--limit", type=int, default=5)
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--commit", action="store_true")
    ap.add_argument("--push", action="store_true", help="Push each approved asset to origin/main; implies --commit")
    ap.add_argument("--force", action="store_true", help="Allow replacing an existing unapproved target")
    args = ap.parse_args()
    if args.limit < 1:
        raise SystemExit("ERROR: --limit must be >= 1")

    manifest = load_manifest()
    selected = set(args.asset_ids or [])
    known = {str(a.get("id")) for a in manifest.get("assets", [])}
    unknown = selected.difference(known)
    if unknown:
        raise SystemExit("ERROR: unknown --asset-id: " + ", ".join(sorted(unknown)))

    candidates: list[dict[str, Any]] = []
    for asset in manifest.get("assets", []):
        asset_id = str(asset.get("id", ""))
        if selected and asset_id not in selected:
            continue
        if str(asset.get("status")) != "approved":
            continue
        source = asset.get("source_temp") or asset.get("source_path")
        if not source:
            print(f"SKIP_NO_SOURCE={asset_id}")
            continue
        candidates.append(asset)
        if len(candidates) >= args.limit:
            break

    if not candidates:
        print("PROMOTION_QUEUE_EMPTY")
        return

    for asset in candidates:
        asset_id = str(asset["id"])
        source = str(asset.get("source_temp") or asset.get("source_path"))
        print(f"PROMOTE={asset_id}\tsource={source}\toutput={asset.get('output')}")
        if args.dry_run:
            continue

        cmd = [sys.executable, str(IMPORTER), "--asset-id", asset_id, "--source", source, "--approve"]
        if args.force:
            cmd.append("--force")
        if args.push:
            cmd.append("--push")
        elif args.commit:
            cmd.append("--commit")

        proc = subprocess.run(cmd, cwd=str(REPO_ROOT), text=True)
        if proc.returncode != 0:
            raise SystemExit(proc.returncode)

    print("STATUS=dry_run" if args.dry_run else "STATUS=promotion_complete")


if __name__ == "__main__":
    main()
