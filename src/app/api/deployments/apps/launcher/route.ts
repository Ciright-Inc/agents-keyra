/**
 * Proxy Keyra launcher apps for the 9-dot menu — same contract as Keyra
 * `/api/deployments/apps/launcher`.
 */

import { NextResponse } from "next/server";
import { getKeyraAdminAppLinks, keyraMarketingPublicOrigin } from "@/lib/keyraAppUrls";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const PRODUCTION_LAUNCHER_URL = "https://keyra.ie/api/deployments/apps/launcher";

function getUpstreamLauncherUrls(): string[] {
  const explicit = String(
    process.env.KEYRA_LAUNCHER_APPS_URL || process.env.NEXT_PUBLIC_KEYRA_LAUNCHER_APPS_URL || "",
  ).trim();
  if (explicit) return [explicit.replace(/\/+$/, "")];

  const urls: string[] = [];
  const cms = `${keyraMarketingPublicOrigin()}/api/deployments/apps/launcher`;
  urls.push(cms);
  if (!urls.includes(PRODUCTION_LAUNCHER_URL)) urls.push(PRODUCTION_LAUNCHER_URL);
  return urls;
}

async function fetchUpstreamLauncherApps() {
  for (const base of getUpstreamLauncherUrls()) {
    try {
      const res = await fetch(`${base}?t=${Date.now()}`, { cache: "no-store" });
      if (!res.ok) continue;
      const data = (await res.json()) as { apps?: unknown[] };
      if (Array.isArray(data?.apps) && data.apps.length > 0) {
        return data;
      }
    } catch {
      // try next upstream
    }
  }
  return { apps: getKeyraAdminAppLinks() };
}

export async function GET() {
  const body = await fetchUpstreamLauncherApps();
  return NextResponse.json(body, {
    headers: { "Cache-Control": "no-store" },
  });
}

