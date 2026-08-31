#!/bin/zsh
set -euo pipefail

KEY="$(osascript <<'APPLESCRIPT'
try
  set d to display dialog "ECHO Image Generation\n\nPaste your OpenAI API key. It will be stored only in macOS Keychain and will not be written to the ECHO repository." default answer "" with hidden answer buttons {"Cancel", "Save to Keychain"} default button "Save to Keychain" with icon caution
  return text returned of d
on error number -128
  return ""
end try
APPLESCRIPT
)"

if [ -z "$KEY" ]; then
  echo "OPENAI_KEYCHAIN=CANCELLED"
  exit 1
fi

security add-generic-password -U -s "openai-api-key" -a "echo-imagegen" -w "$KEY" >/dev/null
unset KEY

echo "OPENAI_KEYCHAIN=PASS"
echo "SERVICE=openai-api-key"
