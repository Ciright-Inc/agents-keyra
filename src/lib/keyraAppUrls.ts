type KeyraAppLink = {
  id: string;
  label: string;
  description: string;
  href: string;
  internalPath?: string;
};

function trimSlash(s: string): string {
  return s.replace(/\/+$/, "");
}

export function keyraMarketingOrigin(): string {
  const raw = String(process.env.NEXT_PUBLIC_KEYRA_MARKETING_ORIGIN || process.env.KEYRA_MARKETING_ORIGIN || "https://keyra.ie").trim();
  return trimSlash(raw.startsWith("http") ? raw : `https://${raw}`);
}

/** Public marketing origin for unauthenticated CMS proxies. */
export function keyraMarketingPublicOrigin(): string {
  const raw = String(
    process.env.NEXT_PUBLIC_KEYRA_MARKETING_PUBLIC_ORIGIN ||
      process.env.KEYRA_MARKETING_PUBLIC_ORIGIN ||
      keyraMarketingOrigin(),
  ).trim();
  return trimSlash(raw.startsWith("http") ? raw : `https://${raw}`);
}

export function getKeyraEcosystemAppLinks(): KeyraAppLink[] {
  return [
    {
      id: "get-started",
      label: "Get Started",
      description: "Secure login and enrollment workspace.",
      href: "https://get-started.keyra.ie",
    },
    {
      id: "simsecure",
      label: "SimSecure",
      description: "SIM/eSIM authentication flows.",
      href: "https://simsecure.keyra.ie",
    },
    {
      id: "developer",
      label: "Developer",
      description: "Developer portal and integrations.",
      href: "https://developer.keyra.ie",
    },
    {
      id: "global-deployment",
      label: "Deployment",
      description: "Global deployment readiness and rollout.",
      href: "https://global-deployment.keyra.ie",
    },
    {
      id: "ciright-catalog",
      label: "Catalog",
      description: "Ciright-origin agents deployment catalog.",
      href: "https://ciright.agents.keyra.ie",
    },
  ];
}

/** Minimal fallback list (same shape as keyra.ie launcher). */
export function getKeyraAdminAppLinks(): KeyraAppLink[] {
  return getKeyraEcosystemAppLinks();
}

