import type { KeyraSessionUser } from "@/lib/keyraSessionCookie";
import { fetchAuthSessionSnapshot } from "@/lib/keyraProtection";
import { buildKeyraSessionUser } from "@/lib/keyraSessionResponse";

export async function resolveKeyraSessionUserFromAuth(req: Request): Promise<KeyraSessionUser | null> {
  const auth = await fetchAuthSessionSnapshot(req);
  if (!auth.authenticated || !auth.phoneE164) return null;
  return buildKeyraSessionUser(auth.phoneE164, auth);
}

export function safeSessionContinueNext(raw: string | null | undefined): string {
  const next = raw?.trim() || "/";
  return next.startsWith("/") ? next : "/";
}

