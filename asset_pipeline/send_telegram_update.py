#!/usr/bin/env python3
"""Send ECHO image-pipeline status updates to Telegram.

Token lookup order:
1. TG_BOT_TOKEN environment variable
2. macOS Keychain generic password service `telegram-bot-token`

The token is never written to the repository or stdout.
"""

from __future__ import annotations

import argparse
import json
import mimetypes
import os
from pathlib import Path
import secrets
import subprocess
import sys
from urllib import error, parse, request

DEFAULT_CHAT_ID = "1571185855"
DEFAULT_KEYCHAIN_SERVICE = "telegram-bot-token"
API_BASE = "https://api.telegram.org"


def fail(message: str, code: int = 1) -> None:
    print(f"TG_SEND=FAIL")
    print(f"ERROR={message}", file=sys.stderr)
    raise SystemExit(code)


def load_token(service: str) -> str:
    token = os.getenv("TG_BOT_TOKEN", "").strip()
    if token:
        return token
    proc = subprocess.run(
        ["security", "find-generic-password", "-s", service, "-w"],
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.DEVNULL,
    )
    if proc.returncode == 0 and proc.stdout.strip():
        return proc.stdout.strip()
    fail(
        "Telegram bot token not found. Set TG_BOT_TOKEN locally or add a macOS "
        f"Keychain generic password with service '{service}'."
    )
    raise AssertionError


def api_post_form(token: str, method: str, fields: dict[str, str], timeout: int = 30) -> dict:
    data = parse.urlencode(fields).encode("utf-8")
    req = request.Request(
        f"{API_BASE}/bot{token}/{method}",
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=timeout) as resp:  # nosec - Telegram Bot API endpoint
            payload = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as exc:
        body = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Telegram HTTP {exc.code}: {body[:500]}") from exc
    except Exception as exc:
        raise RuntimeError(f"Telegram request failed: {exc}") from exc
    if not payload.get("ok"):
        raise RuntimeError(f"Telegram API error: {payload}")
    return payload


def api_post_photo(token: str, chat_id: str, photo: Path, caption: str, timeout: int = 60) -> dict:
    boundary = f"----ECHO{secrets.token_hex(16)}"
    mime = mimetypes.guess_type(photo.name)[0] or "application/octet-stream"
    parts: list[bytes] = []

    def add_field(name: str, value: str) -> None:
        parts.append(f"--{boundary}\r\n".encode())
        parts.append(f'Content-Disposition: form-data; name="{name}"\r\n\r\n'.encode())
        parts.append(value.encode("utf-8"))
        parts.append(b"\r\n")

    add_field("chat_id", chat_id)
    add_field("caption", caption[:1024])
    parts.append(f"--{boundary}\r\n".encode())
    parts.append(
        f'Content-Disposition: form-data; name="photo"; filename="{photo.name}"\r\n'.encode("utf-8")
    )
    parts.append(f"Content-Type: {mime}\r\n\r\n".encode())
    parts.append(photo.read_bytes())
    parts.append(b"\r\n")
    parts.append(f"--{boundary}--\r\n".encode())
    body = b"".join(parts)

    req = request.Request(
        f"{API_BASE}/bot{token}/sendPhoto",
        data=body,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"},
        method="POST",
    )
    try:
        with request.urlopen(req, timeout=timeout) as resp:  # nosec - Telegram Bot API endpoint
            payload = json.loads(resp.read().decode("utf-8"))
    except error.HTTPError as exc:
        body_text = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Telegram HTTP {exc.code}: {body_text[:500]}") from exc
    except Exception as exc:
        raise RuntimeError(f"Telegram request failed: {exc}") from exc
    if not payload.get("ok"):
        raise RuntimeError(f"Telegram API error: {payload}")
    return payload


def main() -> None:
    ap = argparse.ArgumentParser(description="Send ECHO image-pipeline update to Telegram")
    ap.add_argument("--chat-id", default=DEFAULT_CHAT_ID)
    ap.add_argument("--photo", help="Image file to send")
    ap.add_argument("--caption", default="")
    ap.add_argument("--message", default="")
    ap.add_argument("--keychain-service", default=DEFAULT_KEYCHAIN_SERVICE)
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    photo = Path(args.photo).expanduser().resolve() if args.photo else None
    if photo and not photo.is_file():
        fail(f"photo does not exist: {photo}")
    if not photo and not args.message.strip() and not args.caption.strip():
        fail("nothing to send")

    if args.dry_run:
        print(f"TG_CHAT_ID={args.chat_id}")
        print(f"TG_PHOTO={photo if photo else '-'}")
        print("TG_SEND=DRY_RUN")
        return

    token = load_token(args.keychain_service)
    caption = (args.caption or args.message).strip()

    if photo:
        try:
            payload = api_post_photo(token, args.chat_id, photo, caption)
            message_id = payload.get("result", {}).get("message_id")
            print(f"TG_MESSAGE_ID={message_id}")
            print("TG_SEND=PASS")
            return
        except Exception as photo_exc:
            fallback = args.message.strip() or caption or f"ECHO image generated: {photo.name}"
            try:
                payload = api_post_form(token, "sendMessage", {"chat_id": args.chat_id, "text": fallback[:4096]})
                message_id = payload.get("result", {}).get("message_id")
                print(f"TG_MESSAGE_ID={message_id}")
                print("TG_SEND=PASS_FALLBACK_TEXT")
                print(f"TG_PHOTO_ERROR={photo_exc}", file=sys.stderr)
                return
            except Exception as text_exc:
                fail(f"photo send failed ({photo_exc}); fallback text failed ({text_exc})")

    try:
        payload = api_post_form(
            token,
            "sendMessage",
            {"chat_id": args.chat_id, "text": (args.message or args.caption).strip()[:4096]},
        )
        message_id = payload.get("result", {}).get("message_id")
        print(f"TG_MESSAGE_ID={message_id}")
        print("TG_SEND=PASS")
    except Exception as exc:
        fail(str(exc))


if __name__ == "__main__":
    main()
