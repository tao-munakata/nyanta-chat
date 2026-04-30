#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree has uncommitted changes. Commit or stash them first." >&2
  exit 1
fi

PACKAGE_NAME="nyanko-chat-demo-$(date +%Y%m%d-%H%M)"
OUTPUT_DIR="$ROOT_DIR/dist"
OUTPUT_FILE="$OUTPUT_DIR/${PACKAGE_NAME}.tar.gz"

mkdir -p "$OUTPUT_DIR"

git archive --format=tar --prefix="nyanko-chat/" HEAD | gzip -9 > "$OUTPUT_FILE"

echo "$OUTPUT_FILE"
