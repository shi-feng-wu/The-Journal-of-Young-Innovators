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

# Copy standalone server bundle
cp -R .next/standalone/* "$OUT_DIR/"

# Next requires static assets and public folder to be alongside server.js
mkdir -p "$OUT_DIR/.next"
cp -R .next/static "$OUT_DIR/.next/static"
cp -R public "$OUT_DIR/public"

echo "==> Creating tarball: $TARBALL"
rm -f "$TARBALL"
tar -czf "$TARBALL" -C "$OUT_DIR" .

echo "==> Done: $ROOT_DIR/$TARBALL"
