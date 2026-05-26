/**
 * Wrap Prisma calls so missing tables / connection errors show a friendly
 * page instead of a production Server Components crash.
 */

export type DbResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function formatDbError(err: unknown): string {
  const message = err instanceof Error ? err.message : "Database unavailable";
  if (message.includes("does not exist")) {
    return "Database tables are missing. Redeploy after linking Postgres — npm start runs prisma db push + seed automatically.";
  }
  if (message.includes("Can't reach database")) {
    return "Cannot reach the database. Check DATABASE_URL and that Postgres is running.";
  }
  return message;
}

export async function safeDbQuery<T>(fn: () => Promise<T>): Promise<DbResult<T>> {
  if (!process.env.DATABASE_URL?.trim()) {
    return {
      ok: false,
      error: "DATABASE_URL is not set on this service. Link the Railway Postgres plugin.",
    };
  }

  try {
    return { ok: true, data: await fn() };
  } catch (err) {
    console.error("[safeDbQuery]", formatDbError(err));
    return { ok: false, error: formatDbError(err) };
  }
}
