export function resolveMarketplaceRedirectOrigin(req: Request): string {
  const host =
    (req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? "").split(",")[0]?.trim() ||
    "localhost:3041";
  const proto =
    req.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https" ? "https" : "http";
  return `${proto}://${host}`;
}

