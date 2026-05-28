import { KEYRA_LINKEDIN_URL, KEYRA_LOGO_SRC } from "@/lib/keyraBrandAssets";
import { getKeyraEcosystemAppLinks } from "@/lib/keyraAppUrls";
import type { SiteFooterConfig, SiteFooterLinkView, SiteFooterSocialLinkView } from "./types";

const SETTINGS_ID = "agents-keyra-default";

const DEFAULT_DESCRIPTION =
  "Trusted, governed, subscription-based digital workers for telcos, banks, governments, universities, healthcare systems, and enterprises.";

function defaultOnThisSiteLinks(): SiteFooterLinkView[] {
  const rows: Omit<SiteFooterLinkView, "id">[] = [
    { section: "ON_THIS_SITE", siteAppId: null, label: "Agent Marketplace", href: "/marketplace", description: null, isExternal: false, internalPath: "/marketplace", sortOrder: 10, isPublished: true },
    { section: "ON_THIS_SITE", siteAppId: null, label: "Industries", href: "/industries", description: null, isExternal: false, internalPath: "/industries", sortOrder: 20, isPublished: true },
    { section: "ON_THIS_SITE", siteAppId: null, label: "Bundles", href: "/bundles", description: null, isExternal: false, internalPath: "/bundles", sortOrder: 30, isPublished: true },
    { section: "ON_THIS_SITE", siteAppId: null, label: "Deployment", href: "/deployment", description: null, isExternal: false, internalPath: "/deployment", sortOrder: 40, isPublished: true },
    { section: "ON_THIS_SITE", siteAppId: null, label: "Security & Trust", href: "/security", description: null, isExternal: false, internalPath: "/security", sortOrder: 50, isPublished: true },
    { section: "ON_THIS_SITE", siteAppId: null, label: "Request Consultation", href: "/consultation", description: null, isExternal: false, internalPath: "/consultation", sortOrder: 60, isPublished: true },
  ];
  return rows.map((row, index) => ({ ...row, id: `agents-site-${index}` }));
}

function defaultKeyraAppLinks(): SiteFooterLinkView[] {
  return getKeyraEcosystemAppLinks().map((item, index) => ({
    id: `agents-app-${item.id}`,
    section: "KEYRA_APPS" as const,
    siteAppId: item.id,
    label: item.label,
    href: item.href,
    description: item.description,
    isExternal: true,
    internalPath: null,
    sortOrder: (index + 1) * 10,
    isPublished: true,
  }));
}

function defaultSocialLinks(): SiteFooterSocialLinkView[] {
  return [
    {
      id: "agents-social-linkedin",
      platform: "LINKEDIN",
      label: "Keyra on LinkedIn",
      url: KEYRA_LINKEDIN_URL,
      sortOrder: 10,
      isPublished: true,
    },
  ];
}

export function getDefaultSiteFooterConfig(): SiteFooterConfig {
  return {
    settings: {
      id: SETTINGS_ID,
      logoSrc: KEYRA_LOGO_SRC,
      description: DEFAULT_DESCRIPTION,
      onThisSiteLabel: "On this site",
      keyraAppsLabel: "Keyra apps",
    },
    onThisSiteLinks: defaultOnThisSiteLinks(),
    keyraAppLinks: defaultKeyraAppLinks(),
    socialLinks: defaultSocialLinks(),
  };
}

