#!/bin/sh
set -e

echo "[Docker Entrypoint] Preparing Kitchen & Flooring Depot container..."

# 1. Ensure required persistent directories exist
mkdir -p /app/data/enquiries /app/data/drafts /app/data/backups
mkdir -p /app/content
mkdir -p /app/public/media/uploads

# 2. Seed initial published content into /app/content if missing (NEVER overwrite existing files on redeploy)
if [ -d "/app/content-init" ]; then
  node /app/scripts/sync-initial-content.mjs /app/content-init /app/content
fi

# 3. Seed initial data templates if missing
if [ ! -f "/app/data/redirects.json" ]; then
  echo "[]" > /app/data/redirects.json
fi
if [ ! -f "/app/data/audit.json" ]; then
  echo "[]" > /app/data/audit.json
fi

# 4. Optional initial admin bootstrap via environment variables if provided
if [ -n "$ADMIN_INITIAL_EMAIL" ] && [ -n "$ADMIN_INITIAL_PASSWORD" ]; then
  echo "[Docker Entrypoint] Initial admin bootstrap credentials detected; applying..."
  BOOTSTRAP_ADMIN_EMAIL="$ADMIN_INITIAL_EMAIL" \
  BOOTSTRAP_ADMIN_PASSWORD="$ADMIN_INITIAL_PASSWORD" \
  BOOTSTRAP_ADMIN_NAME="${ADMIN_INITIAL_NAME:-CMS Administrator}" \
  node /app/scripts/bootstrap-admin.mjs || true
fi

# 5. Ensure UID 1001 (nextjs) owns and has full write permissions to persistent paths
chown -R nextjs:nodejs /app/data /app/content /app/public/media/uploads
chmod -R 775 /app/data /app/content /app/public/media/uploads

echo "[Docker Entrypoint] Persistent storage ready with UID 1001 write access."
echo "[Docker Entrypoint] Starting application server..."

# 6. Execute server as nextjs (UID 1001) using gosu or su
if command -v gosu >/dev/null 2>&1; then
  exec gosu nextjs "$@"
else
  exec su -s /bin/sh nextjs -c 'exec "$@"' -- "$@"
fi
