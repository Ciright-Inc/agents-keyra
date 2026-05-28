import {
  buildKeyraSessionContinueUrl,
  buildMarketplaceGetStartedAccessUrl,
} from "@/lib/marketplaceAppUrls";
import { resolveMarketplaceRedirectOrigin } from "@/lib/marketplaceRedirectOrigin";
import {
  resolveKeyraSessionUserFromAuth,
  safeSessionContinueNext,
} from "@/lib/keyraSessionEstablish";
import { redirectWithKeyraSession } from "@/lib/keyraSessionResponse";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const nextPath = safeSessionContinueNext(url.searchParams.get("next"));
  const origin = resolveMarketplaceRedirectOrigin(req);

  const fromAuth = await resolveKeyraSessionUserFromAuth(req);
  if (fromAuth) {
    const res = redirectWithKeyraSession(fromAuth, nextPath, origin);
    if (res) return res;
  }

  // Not signed in — send straight to Keyra Get Started (return via this bridge).
  return NextResponse.redirect(
    buildMarketplaceGetStartedAccessUrl(buildKeyraSessionContinueUrl(nextPath)),
  );
}

