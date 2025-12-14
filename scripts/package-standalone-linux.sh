#!/usr/bin/env bash
set -euo pipefail

# Builds a production Next.js standalone bundle on Linux and packages it into a tarball
# suitable for deploying to a Linux server (e.g., Lightsail) WITHOUT running pnpm build there.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

# Optional: make pnpm available (works on GitHub Actions runners too)
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable || true
  corepack prepare pnpm@10 --activate || true
fi

echo "==> Approving install scripts (pnpm safeguard; harmless if already approved)"
# Add any native deps here that require postinstall builds
pnpm approve-builds sharp canvas @tailwindcss/oxide || true

echo "==> Installing deps"
pnpm install --frozen-lockfile

echo "==> Building (standalone)"
pnpm build

OUT_DIR=".deploy"
TARBALL="jyi-standalone.tgz"

echo "==> Assembling deploy directory"
rm -rf "$OUT_DIR"
mkdir -p "$OUT_DIR"

# Validate standalone output exists
if [[ ! -d ".next/standalone" ]]; then
  echo "ERROR: .next/standalone not found. Ensure next.config.ts has output: 'standalone' and rerun pnpm build."
  exit 1
fi

# Copy standalone server bundle
cp -R .next/standalone/* "$OUT_DIR/"

# Next requires static assets and public folder to be alongside server.js
mkdir -p "$OUT_DIR/.next"
cp -R .next/static "$OUT_DIR/.next/static"
cp -R public "$OUT_DIR/public"

# Next start/server expects BUILD_ID under .next
if [[ ! -f ".next/BUILD_ID" ]]; then
  echo "ERROR: .next/BUILD_ID not found after build; cannot package runnable artifact."
  exit 1
fi
cp .next/BUILD_ID "$OUT_DIR/.next/BUILD_ID"

# Some Next versions also rely on required-server-files.json
if [[ -f ".next/required-server-files.json" ]]; then
  cp .next/required-server-files.json "$OUT_DIR/.next/required-server-files.json"
fi

echo "==> Creating tarball: $TARBALL"
rm -f "$TARBALL"
tar -czf "$TARBALL" -C "$OUT_DIR" .

echo "==> Done: $ROOT_DIR/$TARBALL"
