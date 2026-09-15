#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

ENV_NAME="${1:-prod}"

if [ "$ENV_NAME" = "prod" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
elif [ "$ENV_NAME" = "dev" ]; then
    COMPOSE_FILE="docker-compose.yml"
else
    echo "❌ Môi trường không hợp lệ: $ENV_NAME"
    exit 1
fi

echo "==> Môi trường: $ENV_NAME"
echo "==> Compose file: $COMPOSE_FILE"

# Nếu chạy trực tiếp ngoài Jenkins thì pull code mới
if [ -z "${JENKINS_URL:-}" ] && [ -d .git ]; then
    BRANCH="${2:-main}"

    echo "==> Pull origin/$BRANCH ..."

    git fetch origin
    git reset --hard "origin/$BRANCH"
fi

# ==========================================
# STOP CONTAINER CŨ
# ==========================================

echo "==> Dừng containers cũ ..."

docker compose \
    -f "$COMPOSE_FILE" \
    down --remove-orphans || true


# ==========================================
# XÓA IMAGE CŨ KHÔNG CÒN DÙNG
# ==========================================

echo "==> Xóa images cũ ..."

docker image prune -f || true


# ==========================================
# PULL BASE IMAGE
# ==========================================

echo "==> Pull base images ..."

docker compose \
    -f "$COMPOSE_FILE" \
    pull || true


# ==========================================
# BUILD IMAGE MỚI
# ==========================================

echo "==> Build images mới ..."

docker compose \
    -f "$COMPOSE_FILE" \
    build --pull


# ==========================================
# START CONTAINER MỚI
# ==========================================

echo "==> Start containers mới ..."

docker compose \
    -f "$COMPOSE_FILE" \
    up -d


# ==========================================
# WAIT & DB MIGRATE
# ==========================================

echo "==> Đợi containers sẵn sàng ..."
sleep 5

echo "==> Chạy DB migrate (drizzle-kit) ..."
docker run --rm \
    -v "$PWD:/app" \
    -w /app \
    --network host \
    --env-file .env \
    node:22-alpine \
    sh -c "npm ci && npx drizzle-kit migrate" 2>/dev/null \
    || echo "⚠️  DB migrate skipped (manual step or already up-to-date)"


# ==========================================
# STATUS
# ==========================================

echo "==> Containers đang chạy:"

docker compose \
    -f "$COMPOSE_FILE" \
    ps


# ==========================================
# CLEANUP
# ==========================================

echo "==> Cleanup images/build cache cũ ..."

docker image prune -f || true
docker builder prune -f || true

echo "========================================"
echo "✅ Deploy hoàn tất!"
echo "========================================"