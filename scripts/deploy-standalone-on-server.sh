#!/usr/bin/env bash
set -euo pipefail

# Deploy a prebuilt Next.js standalone tarball to a Linux server.
#
# This intentionally does NOT run:
# - git pull
# - pnpm install
# - pnpm build
#
# Usage:
#   ./deploy-standalone-on-server.sh /path/to/jyi-standalone.tgz

APP_DIR="$HOME/jyi"
PM2_APP_NAME="jyi"
RELEASE_TGZ="${1:-}"

if [[ -z "$RELEASE_TGZ" ]]; then
  echo "Usage: $0 /path/to/jyi-standalone.tgz"
  exit 2
fi

if [[ ! -f "$RELEASE_TGZ" ]]; then
  echo "Tarball not found: $RELEASE_TGZ"
  exit 2
fi

if ! command -v pm2 >/dev/null 2>&1; then
  sudo npm i -g pm2
fi

# Match the settings you previously used during on-server builds.
export NODE_ENV=production
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"

# Standalone server listens on PORT; default 3000
export PORT="${PORT:-3000}"
# Bind only locally by default (good behind Apache reverse proxy)
export HOSTNAME="${HOSTNAME:-127.0.0.1}"

RUNTIME_DIR="$APP_DIR/runtime"
NEW_DIR="$APP_DIR/runtime.new"
OLD_DIR="$APP_DIR/runtime.old"

mkdir -p "$APP_DIR"
rm -rf "$NEW_DIR"
mkdir -p "$NEW_DIR"
    
echo "==> Extracting artifact"
tar -xzf "$RELEASE_TGZ" -C "$NEW_DIR"

if [[ ! -f "$NEW_DIR/server.js" ]]; then
  echo "Invalid artifact: server.js not found in root of tarball"
  exit 2
fi

echo "==> Swapping runtime (atomic)"
rm -rf "$OLD_DIR"
if [[ -d "$RUNTIME_DIR" ]]; then
  mv "$RUNTIME_DIR" "$OLD_DIR"
fi
mv "$NEW_DIR" "$RUNTIME_DIR"

echo "==> Restarting PM2"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  pm2 reload "$PM2_APP_NAME" --update-env
else
  pm2 start "$RUNTIME_DIR/server.js" --name "$PM2_APP_NAME" --cwd "$RUNTIME_DIR" --interpreter node
  pm2 save
fi

echo "==> Health check"
curl -fsSI "http://${HOSTNAME}:${PORT}/" | head -n 1 || true

echo "==> Deploy complete"
