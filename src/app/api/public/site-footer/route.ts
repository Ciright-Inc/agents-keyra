import { NextResponse } from "next/server";
import { keyraMarketingPublicOrigin } from "@/lib/keyraAppUrls";
import type { SiteFooterConfig } from "@/lib/siteFooter/types";
import { getDefaultSiteFooterConfig } from "@/lib/siteFooter/defaults";

export const dynamic = "force-dynamic";

const FOOTER_SITE_APP_ID =
  process.env.KEYRA_FOOTER_SITE_APP_ID?.trim() ||
  process.env.NEXT_PUBLIC_KEYRA_FOOTER_SITE_APP_ID?.trim() ||
  "agents-keyra";

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

/** Proxies published footer from keyra.ie CMS for this site (`siteAppId=agents-keyra`). */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteAppId = searchParams.get("siteAppId")?.trim() || FOOTER_SITE_APP_ID;
  const cmsOrigin = keyraMarketingPublicOrigin();
  const upstream = new URL(`${cmsOrigin}/api/public/site-footer`);
  upstream.searchParams.set("siteAppId", siteAppId);

  const origin = request.headers.get("origin");

  try {
    const res = await fetch(upstream.toString(), {
      cache: "no-store",
      headers: origin ? { Origin: origin } : undefined,
    });

    if (!res.ok) {
      // If keyra.ie is temporarily unavailable, keep the site stable.
      return NextResponse.json(getDefaultSiteFooterConfig(), {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
          "X-Keyra-Footer-Fallback": "1",
        },
      });
    }

    const data: unknown = await res.json();
    if (!isSiteFooterConfig(data)) {
      return NextResponse.json(getDefaultSiteFooterConfig(), {
        headers: {
          "Cache-Control": "no-store, must-revalidate",
          ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
          "X-Keyra-Footer-Fallback": "1",
        },
      });
    }

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
      },
    });
  } catch (err) {
    return NextResponse.json(getDefaultSiteFooterConfig(), {
      headers: {
        "Cache-Control": "no-store, must-revalidate",
        ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
        "X-Keyra-Footer-Fallback": "1",
      },
    });
  }
}

export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return new NextResponse(null, { status: 204 });
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Max-Age": "86400",
    },
  });
}

