function trimSlash(s: string): string {
  return s.replace(/\/+$/, "");
}

/** This marketplace site origin (agents.keyra.ie or local dev). */
export function marketplaceSiteOrigin(): string {
  return trimSlash(
    process.env.NEXT_PUBLIC_MARKETPLACE_SITE_URL?.trim() ||
      process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
      (process.env.NODE_ENV === "production" ? "https://agents.keyra.ie" : "http://localhost:3041"),
  );
}

export function keyraGetStartedUrl(): string {
  return trimSlash(process.env.NEXT_PUBLIC_GET_STARTED_URL?.trim() || "https://get-started.keyra.ie");
}

export function buildGetStartedAccessUrl(returnToAbsoluteUrl: string): string {
  const gs = keyraGetStartedUrl();
  let u = returnToAbsoluteUrl.trim();
  if (!u.startsWith("http://") && !u.startsWith("https://")) {
    const base = marketplaceSiteOrigin();
    const path = u.startsWith("/") ? u : `/${u}`;
    u = `${trimSlash(base)}${path}`;
  }
  return `${gs}/?return=${encodeURIComponent(u)}`;
}

export function buildKeyraSessionContinueUrl(nextPath: string): string {
  const base = marketplaceSiteOrigin();
  const path = nextPath.startsWith("/") ? nextPath : `/${nextPath}`;
  return `${trimSlash(base)}/api/keyra/session/continue?next=${encodeURIComponent(path)}`;
}

/** Marketplace "Login on Keyra" — return via session bridge on this origin. */
export function buildMarketplaceGetStartedAccessUrl(nextPath: string): string {
  return buildGetStartedAccessUrl(buildKeyraSessionContinueUrl(nextPath));
}

