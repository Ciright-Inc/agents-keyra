export type SiteFooterLinkSection = "ON_THIS_SITE" | "KEYRA_APPS";

export type SiteFooterLinkView = {
  id: string;
  section: SiteFooterLinkSection;
  siteAppId: string | null;
  label: string;
  href: string;
  description: string | null;
  isExternal: boolean;
  internalPath: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type SiteFooterSocialPlatform = "LINKEDIN" | "X" | "GITHUB" | "YOUTUBE";

export type SiteFooterSocialLinkView = {
  id: string;
  platform: SiteFooterSocialPlatform;
  label: string;
  url: string;
  sortOrder: number;
  isPublished: boolean;
};

export type SiteFooterSettingsView = {
  id: string;
  logoSrc: string;
  description: string;
  onThisSiteLabel: string;
  keyraAppsLabel: string;
};

export type SiteFooterConfig = {
  settings: SiteFooterSettingsView;
  onThisSiteLinks: SiteFooterLinkView[];
  keyraAppLinks: SiteFooterLinkView[];
  socialLinks: SiteFooterSocialLinkView[];
};

