import {
  KEYRA_SESSION_COOKIE,
  KEYRA_SESSION_MAX_AGE,
  serializeSession,
  type KeyraSessionUser,
} from "@/lib/keyraSessionCookie";
import { NextResponse } from "next/server";

type AuthProfileHint = {
  displayName?: string | null;
  fullName?: string | null;
  username?: string | null;
  email?: string | null;
};

function displayNameFromAuthHint(auth?: AuthProfileHint): string | undefined {
  const displayName = String(auth?.displayName ?? "").trim();
  if (displayName) return displayName;
  const fullName = String(auth?.fullName ?? "").trim();
  if (fullName) return fullName;
  const username = String(auth?.username ?? "").trim();
  if (username) return username;
  return undefined;
}

export async function buildKeyraSessionUser(
  phoneE164: string,
  authHint?: AuthProfileHint,
): Promise<KeyraSessionUser> {
  const fromAuth = displayNameFromAuthHint(authHint);
  const fromAuthEmail = authHint?.email ? String(authHint.email).trim() : undefined;
  return {
    phoneE164,
    displayName: fromAuth,
    email: fromAuthEmail,
  };
}

function attachKeyraSessionCookie(res: NextResponse, token: string): void {
  res.cookies.set({
    name: KEYRA_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: KEYRA_SESSION_MAX_AGE,
  });
}

export function redirectWithKeyraSession(
  user: KeyraSessionUser,
  nextPath: string,
  origin: string,
): NextResponse | null {
  const token = serializeSession(user);
  if (!token) return null;
  const safeNext = nextPath.startsWith("/") ? nextPath : "/";
  const res = NextResponse.redirect(new URL(safeNext, origin));
  attachKeyraSessionCookie(res, token);
  return res;
}

export function clearKeyraSessionCookie(res: NextResponse): void {
  res.cookies.set({
    name: KEYRA_SESSION_COOKIE,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

