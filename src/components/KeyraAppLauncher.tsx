"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type LauncherApp = {
  id: string;
  label: string;
  description: string;
  href: string;
};

function faviconForHref(href: string): string | null {
  try {
    const u = new URL(href);
    return `${u.origin}/favicon.png`;
  } catch {
    return null;
  }
}

function NineDotTriggerIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="5" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="19" cy="19" r="1.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function KeyraAppLauncher() {
  const [open, setOpen] = useState(false);
  const [apps, setApps] = useState<LauncherApp[]>([]);
  const wrapRef = useRef<HTMLDivElement>(null);

  const tiles = useMemo(() => apps, [apps]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    fetch(`/api/deployments/apps/launcher?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { apps?: LauncherApp[] } | null) => {
        if (Array.isArray(data?.apps)) setApps(data.apps);
      })
      .catch(() => {
        // keep last known tiles
      });
  }, [open]);

  return (
    <div className="relative shrink-0" ref={wrapRef}>
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label="Keyra apps"
        className="keyra-app-launcher-trigger"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
      >
        <NineDotTriggerIcon />
      </button>
      {open ? (
        <div role="menu" aria-label="Keyra apps" className="keyra-app-launcher-popover">
          <p className="keyra-app-launcher-title">Keyra apps</p>
          <ul className="keyra-app-launcher-grid">
            {tiles.map((item) => (
              <li key={item.id} className="min-w-0">
                <a
                  role="menuitem"
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${item.label} — ${item.description}`}
                  className="keyra-app-launcher-tile"
                  onClick={() => setOpen(false)}
                >
                  <span className="keyra-app-launcher-tile-icon" aria-hidden>
                    <LauncherTileIcon label={item.label} href={item.href} />
                  </span>
                  <span className="keyra-app-launcher-tile-label">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function LauncherTileIcon({ label, href }: { label: string; href: string }) {
  const [imgOk, setImgOk] = useState(true);
  const icon = useMemo(() => faviconForHref(href), [href]);
  const letters = label.slice(0, 2).toUpperCase();

  if (icon && imgOk) {
    return (
      <img
        src={icon}
        alt=""
        width={18}
        height={18}
        referrerPolicy="no-referrer"
        onError={() => setImgOk(false)}
        style={{ width: 18, height: 18, borderRadius: 4 }}
      />
    );
  }

  return <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.02em" }}>{letters}</span>;
}

