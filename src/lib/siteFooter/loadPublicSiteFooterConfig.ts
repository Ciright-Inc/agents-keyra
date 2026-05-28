import { getDefaultSiteFooterConfig } from "./defaults";
import type { SiteFooterConfig } from "./types";

function isSiteFooterConfig(value: unknown): value is SiteFooterConfig {
  if (!value || typeof value !== "object") return false;
  const payload = value as SiteFooterConfig;
  return (
    Boolean(payload.settings) &&
    Array.isArray(payload.onThisSiteLinks) &&
    Array.isArray(payload.keyraAppLinks) &&
    Array.isArray(payload.socialLinks)
  );
}

/**
 * Footer config fetched via same-origin proxy (`/api/public/site-footer`), merged with
 * agents-keyra on-site defaults.
 */
export async function loadPublicSiteFooterConfig(): Promise<SiteFooterConfig> {
  const local = getDefaultSiteFooterConfig();
  try {
    // Server components cannot reliably fetch relative URLs; resolve same-origin from headers.
    const url =
      typeof window === "undefined"
        ? await (async () => {
            const { headers } = await import("next/headers");
            const h = await headers();
            const host = (h.get("x-forwarded-host") ?? h.get("host") ?? "").split(",")[0]?.trim();
            const proto =
              h.get("x-forwarded-proto")?.split(",")[0]?.trim() === "https" ? "https" : "http";
            const origin = host ? `${proto}://${host}` : "http://localhost:3041";
            return `${origin}/api/public/site-footer?t=${Date.now()}`;
          })()
        : `/api/public/site-footer?t=${Date.now()}`;

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return local;

    const remote: unknown = await res.json();
    if (!isSiteFooterConfig(remote)) return local;

    return {
      settings: {
        ...remote.settings,
        description: local.settings.description,
        onThisSiteLabel: local.settings.onThisSiteLabel,
        keyraAppsLabel: remote.settings.keyraAppsLabel || local.settings.keyraAppsLabel,
        logoSrc: remote.settings.logoSrc || local.settings.logoSrc,
      },
      onThisSiteLinks:
        local.onThisSiteLinks.length > 0 ? local.onThisSiteLinks : remote.onThisSiteLinks,
      keyraAppLinks: remote.keyraAppLinks.length > 0 ? remote.keyraAppLinks : local.keyraAppLinks,
      socialLinks: remote.socialLinks.length > 0 ? remote.socialLinks : local.socialLinks,
    };
  } catch {
    return local;
  }
}

