/**
 * Normalize Postgres URLs for Railway / cloud hosts (SSL, schema).
 */
export function normalizeDatabaseUrl(raw: string | undefined): string | undefined {
  const url = raw?.trim();
  if (!url) return undefined;

  let out = url;
  if (!out.includes("schema=")) {
    out += out.includes("?") ? "&schema=public" : "?schema=public";
  }

  const needsSsl =
    process.env.NODE_ENV === "production" &&
    !out.includes("sslmode=") &&
    (out.includes("railway") ||
      out.includes("rlwy.net") ||
      process.env.RAILWAY_ENVIRONMENT === "production" ||
      process.env.RAILWAY_ENVIRONMENT === "true");

  if (needsSsl) {
    out += out.includes("?") ? "&sslmode=require" : "?sslmode=require";
  }

  return out;
}

export function resolveDatabaseUrl(): string | undefined {
  return (
    normalizeDatabaseUrl(process.env.DIRECT_DATABASE_URL) ??
    normalizeDatabaseUrl(process.env.DATABASE_URL)
  );
}
