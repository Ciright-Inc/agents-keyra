import "./globals.css";
import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import { SiteFooter } from "@/components/layout/SiteFooter";

const KEYRA_FAVICON_PNG = "/favicon.png";
const KEYRA_FAVICON_SVG = "/favicon.svg";

export const metadata: Metadata = {
  title: "Keyra — Operational civilization infrastructure for the autonomous era",
  description:
    "Trusted, governed, subscription-based digital workers for telcos, banks, governments, universities, healthcare systems, and enterprises.",
  icons: {
    icon: [KEYRA_FAVICON_PNG, KEYRA_FAVICON_SVG],
    shortcut: KEYRA_FAVICON_PNG,
    apple: KEYRA_FAVICON_PNG,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="keyra-main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
