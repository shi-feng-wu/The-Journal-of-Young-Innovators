#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BRANCH="${BRANCH:-main}"
PM2_APP_NAME="${PM2_APP_NAME:-jyi}"
STOP_PM2_BEFORE_BUILD="${STOP_PM2_BEFORE_BUILD:-0}"
KILL_PM2_DAEMON="${KILL_PM2_DAEMON:-0}"

export NODE_ENV=production
export NEXT_TELEMETRY_DISABLED=1
# If you keep hitting OOM/SIGKILL, try increasing swap and/or setting:
#   NODE_OPTIONS=--max-old-space-size=2048
export NODE_OPTIONS="${NODE_OPTIONS:---max-old-space-size=1536}"

echo "==> Updating git repo ($BRANCH)"
if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: Not a git repo: $ROOT_DIR"
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "ERROR: Working tree has uncommitted changes. Commit/stash them, or run with FORCE=1."
  if [[ "${FORCE:-0}" != "1" ]]; then
    exit 2
  fi
  echo "WARN: FORCE=1 set; continuing with dirty working tree."
fi

git fetch --prune origin
git checkout "$BRANCH"
git pull --ff-only origin "$BRANCH"

echo "==> Installing deps"
if ! command -v pnpm >/dev/null 2>&1; then
  corepack enable || true
  corepack prepare pnpm@10 --activate || true
fi

pnpm install --frozen-lockfile

if [[ "$STOP_PM2_BEFORE_BUILD" == "1" ]]; then
  echo "==> Stopping PM2 app to free RAM ($PM2_APP_NAME)"
  pm2 stop "$PM2_APP_NAME" >/dev/null 2>&1 || true

  if [[ "$KILL_PM2_DAEMON" == "1" ]]; then
    echo "==> Killing PM2 daemon to free more RAM"
    pm2 kill >/dev/null 2>&1 || true
  fi

  echo "==> Memory snapshot (after stop)"
  free -h || true
fi

echo "==> Building"
pnpm build

echo "==> Reloading PM2 ($PM2_APP_NAME)"
if pm2 describe "$PM2_APP_NAME" >/dev/null 2>&1; then
  if [[ "$STOP_PM2_BEFORE_BUILD" == "1" ]]; then
    pm2 restart "$PM2_APP_NAME" --update-env
  else
    pm2 reload "$PM2_APP_NAME" --update-env
  fi
else
  echo "ERROR: PM2 process '$PM2_APP_NAME' not found. Start it once (e.g. pm2 start 'pnpm start' --name $PM2_APP_NAME), then rerun deploy."
  exit 3
fi

echo "==> Done"
