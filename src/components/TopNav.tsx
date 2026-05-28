"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyraAppLauncher } from "@/components/KeyraAppLauncher";

const links = [
  { href: "/", label: "Home" },
  { href: "/marketplace", label: "Agent Marketplace" },
  { href: "/industries", label: "Industries" },
  { href: "/countries", label: "Countries" },
  { href: "/bundles", label: "Agent Bundles" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/deployment", label: "Deployment" },
  { href: "/security", label: "Security & Trust" },
  { href: "/pricing", label: "Pricing" },
];

const trailing = [
  { href: "/consultation", label: "Request Consultation", primary: false },
  { href: "/portal", label: "Customer Portal", primary: true },
];

export function TopNav() {
  const pathname = usePathname() || "/";
  const [loggingOut, setLoggingOut] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [sessionUser, setSessionUser] = useState<{ phoneE164: string } | null | undefined>(undefined);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/keyra/session/me", { method: "GET", cache: "no-store" });
      if (!res.ok) {
        setSessionUser(null);
        return;
      }
      const json = (await res.json()) as { user: { phoneE164: string } | null };
      setSessionUser(json.user ?? null);
    } catch {
      setSessionUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await fetch("/api/keyra/session/logout", { method: "POST" });
    } finally {
      setSessionUser(null);
      window.location.href = "/";
    }
  }, [loggingOut]);

  const login = useCallback(() => {
    if (loggingIn) return;
    setLoggingIn(true);
    window.location.href = "/login?next=/portal";
  }, [loggingIn]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    const onFocus = () => void refreshSession();
    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onFocus);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, [refreshSession]);

  const authAction = useMemo(() => {
    if (sessionUser === undefined) return "loading" as const;
    return sessionUser ? ("logout" as const) : ("login" as const);
  }, [sessionUser]);

  return (
    <header className="keyra-topnav">
      <div className="keyra-topnav__inner">
        <Link href="/" className="keyra-topnav__brand" aria-label="Keyra home">
          <Image
            src="/favicon.svg"
            alt=""
            width={22}
            height={22}
            className="keyra-topnav__brand-mark"
            priority
            unoptimized
          />
          <span>agents.keyra.ie</span>
        </Link>

        <nav className="keyra-topnav__nav" aria-label="Primary">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`keyra-topnav__link${active ? " is-active" : ""}`}
                aria-current={active ? "page" : undefined}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="keyra-topnav__actions">
          <KeyraAppLauncher />
          {trailing.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`keyra-topnav__cta${l.primary ? " keyra-topnav__cta--primary" : ""}`}
            >
              {l.label}
            </Link>
          ))}
          {authAction === "loading" ? null : authAction === "login" ? (
            <button
              type="button"
              onClick={login}
              disabled={loggingIn || loggingOut}
              className="keyra-topnav__cta"
              aria-label="Login"
            >
              {loggingIn ? "Redirecting…" : "Login"}
            </button>
          ) : (
            <button
              type="button"
              onClick={logout}
              disabled={loggingOut || loggingIn}
              className="keyra-topnav__cta"
              aria-label="Logout"
            >
              {loggingOut ? "Logging out…" : "Logout"}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
