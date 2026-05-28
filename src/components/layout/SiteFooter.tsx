import { loadPublicSiteFooterConfig } from "@/lib/siteFooter/loadPublicSiteFooterConfig";
import { SiteFooterView } from "./SiteFooterView";

export async function SiteFooter() {
  const config = await loadPublicSiteFooterConfig();
  return <SiteFooterView config={config} />;
}

