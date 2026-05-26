"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="keyra-topnav">
      <div className="keyra-topnav__inner">
        <Link href="/" className="keyra-topnav__brand" aria-label="Keyra home">
          <Image
            src="/favicon.png"
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
          {trailing.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`keyra-topnav__cta${l.primary ? " keyra-topnav__cta--primary" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
