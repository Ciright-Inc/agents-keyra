# agents.keyra.ie — Public marketplace

Next.js + Prisma marketplace for Keyra digital workers.

## Local

```bash
cp .env.example .env
npm install
npm run deploy:db
npm run dev   # http://localhost:3041
```

## Railway

1. Add a **PostgreSQL** service in the same project.
2. On the **agents-keyra** web service, set:

   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   NODE_ENV=production
   ```

3. Redeploy from `main`.

At container start, `scripts/railway-start.sh` runs `prisma db push` + seed (3 retries).

### Verify deploy

- `GET /api/health` — app up
- `GET /api/health?db=1` — Postgres connected and agent count

If the homepage shows “Database not ready”, open Railway logs and search for `[railway-start] deploy:db`.

### Common failures

| Symptom | Fix |
| --- | --- |
| `DATABASE_URL is not set` | Link Postgres variable on the **web** service (not only Postgres service). |
| `relation does not exist` | `deploy:db` failed — check logs; redeploy after fixing URL. |
| SSL / connection timeout | URL should include `sslmode=require` (auto-added in production). |

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Dev server `:3041` |
| `npm run deploy:db` | Push schema + seed |
| `npm run build` | Production build |
