#!/bin/zsh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VENV="$ROOT/.venv-imagegen"
PYTHON="${PYTHON:-python3}"

if [ ! -d "$VENV" ]; then
  "$PYTHON" -m venv "$VENV"
fi

"$VENV/bin/python" -m pip install --upgrade pip
"$VENV/bin/python" -m pip install -r "$ROOT/asset_pipeline/requirements-imagegen.txt"
"$VENV/bin/python" -m py_compile "$ROOT/asset_pipeline/generate_openai_image.py"

echo "IMAGEGEN_ENV=PASS"
echo "PYTHON=$VENV/bin/python"
echo "NEXT=$VENV/bin/python asset_pipeline/generate_openai_image.py --asset-id ch22_room_diff_A"
