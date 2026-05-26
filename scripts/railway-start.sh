#!/usr/bin/env sh
# Railway start: push schema + seed, then boot Next.js.

set -u

if [ -z "${DATABASE_URL:-}" ]; then
  echo "[railway-start] ERROR: DATABASE_URL is not set."
  echo "[railway-start] In Railway: add Postgres plugin → Variables → DATABASE_URL=\${{Postgres.DATABASE_URL}}"
  echo "[railway-start] App will start but marketplace pages will show a database error until this is fixed."
else
  echo "[railway-start] DATABASE_URL is set — running prisma db push + seed"
  attempt=1
  max=3
  while [ "$attempt" -le "$max" ]; do
    echo "[railway-start] deploy:db attempt $attempt/$max"
    if npm run deploy:db; then
      echo "[railway-start] deploy:db OK"
      break
    fi
    echo "[railway-start] deploy:db failed (attempt $attempt)"
    attempt=$((attempt + 1))
    sleep 2
  done
  if [ "$attempt" -gt "$max" ]; then
    echo "[railway-start] WARN: deploy:db failed after $max attempts — check Postgres SSL and plugin link"
  fi
fi

echo "[railway-start] launching next start"
exec npm run start
