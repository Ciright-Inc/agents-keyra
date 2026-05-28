import { NextResponse } from "next/server";
import { resolveAuthBackendUrl } from "@/lib/resolveAuthBackendUrl";
import { clearKeyraSessionCookie } from "@/lib/keyraSessionResponse";
import { resolveMarketplaceRedirectOrigin } from "@/lib/marketplaceRedirectOrigin";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const origin = resolveMarketplaceRedirectOrigin(req);

  // Best-effort: clear simsecure session on auth backend.
  try {
    const base = resolveAuthBackendUrl(req);
    await fetch(`${base}/auth/logout`, {
      method: "POST",
      headers: { cookie: req.headers.get("cookie") ?? "" },
      cache: "no-store",
    });
  } catch {
    // ignore
  }

  const res = NextResponse.redirect(new URL("/", origin));
  clearKeyraSessionCookie(res);
  return res;
}

