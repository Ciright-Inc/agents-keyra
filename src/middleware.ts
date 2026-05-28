import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isStaticAsset(pathname: string): boolean {
  if (pathname.startsWith("/_next")) return true;
  if (pathname === "/favicon.ico" || pathname === "/favicon.svg" || pathname === "/favicon.png") return true;
  if (pathname.startsWith("/robots.txt") || pathname.startsWith("/sitemap")) return true;
  return false;
}

function isProtectedPath(pathname: string): boolean {
  return (
    pathname === "/portal" ||
    pathname.startsWith("/portal/") ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  );
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (isStaticAsset(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (!isProtectedPath(pathname)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const hasKeyraSession = Boolean(request.cookies.get("keyra_session")?.value);
  if (hasKeyraSession) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const nextPath = `${pathname}${search || ""}`;
  const url = request.nextUrl.clone();
  url.pathname = "/api/keyra/session/continue";
  url.search = `?next=${encodeURIComponent(nextPath)}`;
  return NextResponse.redirect(url, { headers: requestHeaders });
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

