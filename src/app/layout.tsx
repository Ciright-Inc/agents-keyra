import "./globals.css";
import type { Metadata } from "next";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";

const KEYRA_FAVICON_SRC = "/favicon.svg";

export const metadata: Metadata = {
  title: "Keyra — Operational civilization infrastructure for the autonomous era",
  description:
    "Trusted, governed, subscription-based digital workers for telcos, banks, governments, universities, healthcare systems, and enterprises.",
  icons: {
    icon: KEYRA_FAVICON_SRC,
    shortcut: KEYRA_FAVICON_SRC,
    apple: KEYRA_FAVICON_SRC,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <TopNav />
        <main className="keyra-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
