#!/usr/bin/env python3
"""Safely update QA/status metadata for one ECHO image asset."""

from __future__ import annotations

import argparse
from datetime import datetime
import json
import os
from pathlib import Path
import tempfile
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
MANIFEST_PATH = REPO_ROOT / "asset_pipeline" / "image_manifest.json"
VALID_STATUSES = {
    "planned", "queued", "generating", "generated", "qa_pending", "approved",
    "qa_failed", "retry_pending", "approved_synced", "blocked_dependency",
    "blocked_prompt", "integrated",
}


def now_iso() -> str:
    return datetime.now().astimezone().isoformat(timespec="seconds")


def load_manifest() -> dict[str, Any]:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def save_manifest(data: dict[str, Any]) -> None:
    payload = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
    fd, tmp = tempfile.mkstemp(prefix="image_manifest.", suffix=".tmp", dir=str(MANIFEST_PATH.parent))
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            f.write(payload)
        os.replace(tmp, MANIFEST_PATH)
    finally:
        if os.path.exists(tmp):
            os.unlink(tmp)


def main() -> None:
    ap = argparse.ArgumentParser(description="Update one asset's pipeline status")
    ap.add_argument("--asset-id", required=True)
    ap.add_argument("--status", required=True, choices=sorted(VALID_STATUSES))
    ap.add_argument("--qa-report", help="QA report path relative to repo root")
    ap.add_argument("--note", help="Optional short QA/status note")
    args = ap.parse_args()

    manifest = load_manifest()
    asset = next((a for a in manifest.get("assets", []) if a.get("id") == args.asset_id), None)
    if asset is None:
        raise SystemExit(f"ERROR: unknown asset id: {args.asset_id}")

    if args.qa_report:
        report = (REPO_ROOT / args.qa_report).resolve()
        try:
            report.relative_to(REPO_ROOT)
        except ValueError:
            raise SystemExit("ERROR: QA report escapes repo root")
        if not report.is_file():
            raise SystemExit(f"ERROR: QA report not found: {args.qa_report}")
        asset["qa_report"] = str(report.relative_to(REPO_ROOT))

    asset["status"] = args.status
    asset["status_updated_at"] = now_iso()
    if args.note:
        asset["status_note"] = args.note
    if args.status == "approved":
        asset["approved_at"] = now_iso()
        asset["last_error"] = None
    elif args.status == "qa_failed":
        asset["qa_failed_at"] = now_iso()
    elif args.status == "retry_pending":
        asset["retry_requested_at"] = now_iso()

    save_manifest(manifest)
    print(f"ASSET={args.asset_id}")
    print(f"STATUS={args.status}")
    if args.qa_report:
        print(f"QA_REPORT={asset['qa_report']}")


if __name__ == "__main__":
    main()
