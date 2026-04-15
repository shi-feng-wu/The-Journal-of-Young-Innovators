#!/bin/bash
set -e

APP_NAME="young-innovator"
DEPLOY_DIR="$(cd "$(dirname "$0")" && pwd)"

cd "$DEPLOY_DIR"

echo "==> Pulling latest changes..."
git pull

echo "==> Installing dependencies..."
pnpm install --frozen-lockfile

echo "==> Building..."
pnpm build

echo "==> Restarting PM2..."
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
  pm2 restart "$APP_NAME"
else
  pm2 start pnpm --name "$APP_NAME" -- start
fi

pm2 save

echo "==> Deploy complete!"
