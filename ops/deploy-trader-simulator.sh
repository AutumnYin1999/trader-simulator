#!/usr/bin/env bash
set -Eeuo pipefail

REPO_URL="https://github.com/AutumnYin1999/trader-simulator.git"
BRANCH="main"
APP_DIR="/opt/trader-simulator"
WEB_DIR="/var/www/html"
LOCK_FILE="/tmp/trader-simulator-deploy.lock"

log() {
  printf '[%s] %s\n' "$(date '+%Y-%m-%d %H:%M:%S')" "$*"
}

case "$WEB_DIR" in
  /var/www/html|/var/www/html/) ;;
  *)
    log "Refusing to deploy to unexpected WEB_DIR: $WEB_DIR"
    exit 1
    ;;
esac

exec 9>"$LOCK_FILE"
if ! flock -n 9; then
  log "Another deploy is already running; skip."
  exit 0
fi

log "Checking $REPO_URL ($BRANCH)"

if [ ! -d "$APP_DIR/.git" ]; then
  log "Cloning repository into $APP_DIR"
  rm -rf "$APP_DIR"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  local_sha="$(git rev-parse HEAD)"
  remote_sha="$(git rev-parse "origin/$BRANCH")"

  if [ "$local_sha" = "$remote_sha" ] && [ "${FORCE_DEPLOY:-0}" != "1" ]; then
    log "Already up to date at $local_sha"
    exit 0
  fi

  log "Updating $local_sha -> $remote_sha"
  git reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"
log "Installing dependencies"
npm ci --no-audit --no-fund

log "Building production bundle"
npm run build

log "Publishing dist to $WEB_DIR"
mkdir -p "$WEB_DIR"
find "$WEB_DIR" -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +
cp -a dist/. "$WEB_DIR"/

if command -v nginx >/dev/null 2>&1; then
  nginx -t
  systemctl reload nginx
fi

log "Deploy complete: $(git rev-parse --short HEAD)"
