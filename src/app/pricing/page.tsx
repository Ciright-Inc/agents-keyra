import Link from "next/link";
import { Chip } from "@/components/Chip";

const TIERS = [
  {
    name: "Standard",
    audience: "Enterprise teams. Lower risk profile.",
    bullets: [
      "Per-seat subscription",
      "Standard SLAs",
      "Cloud-managed tenant world",
      "Audit logs and revocation",
    ],
    tone: "muted" as const,
    cta: "Explore standard agents",
    href: "/marketplace?subscription=Standard",
  },
  {
    name: "Regulated",
    audience: "Banks, telcos, healthcare. High audit demands.",
    bullets: [
      "Per-seat or event-metered",
      "Knowledge pack required",
      "Human-in-the-loop on material actions",
      "Sector-specific compliance pack",
      "Legal and security approval workflow",
    ],
    tone: "warning" as const,
    cta: "Explore regulated agents",
    href: "/marketplace?subscription=Regulated",
  },
  {
    name: "Sovereign",
    audience: "Governments, ministries, regulators.",
    bullets: [
      "Sovereign-contract billing",
      "In-country deployment",
      "Ministry-level approval & sovereign-admin role",
      "Regulator-visible audit packaging",
      "Country-scoped data and infrastructure",
    ],
    tone: "sovereign" as const,
    cta: "Talk to Keyra Sovereign",
    href: "/consultation",
  },
  {
    name: "Bespoke",
    audience: "Custom designs and partnerships.",
    bullets: [
      "Custom agent design and packaging",
      "Bespoke integration scope",
      "Co-developed knowledge packs",
      "Negotiated commercial terms",
    ],
    tone: "default" as const,
    cta: "Engage Keyra Partnerships",
    href: "/consultation",
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Pricing &amp; subscription</div>
      <h1 className="h-display">Four ways to subscribe</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Keyra agents are sold under four subscription envelopes. The right
        envelope depends on regulatory exposure, data residency, and operating
        scale.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-10">
        {TIERS.map((t) => (
          <div key={t.name} className="card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <div className="h-card">{t.name}</div>
              <Chip tone={t.tone}>{t.name}</Chip>
            </div>
            <p className="text-[12.5px] text-muted">{t.audience}</p>
            <ul className="mt-4 text-[13px] space-y-1.5">
              {t.bullets.map((b) => (
                <li key={b} className="flex gap-2"><span className="text-muted">·</span><span>{b}</span></li>
              ))}
            </ul>
            <div className="mt-auto pt-5">
              <Link href={t.href} className="btn w-full justify-center">{t.cta} →</Link>
            </div>
          </div>
        ))}
      </div>

      <section className="card p-7 mt-10">
        <h2 className="h-section mb-3">Billing models</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-[13px]">
          {[
            ["seat", "Per active human seat operating the agent."],
            ["event", "Per material event evaluated (e.g. transaction reviewed)."],
            ["metered", "Per metered unit consumed (records, scans, calls)."],
            ["sovereign-contract", "Custom contract for sovereign engagements."],
          ].map(([key, body]) => (
            <div key={key}>
              <div className="mono text-[12.5px] text-muted">{key}</div>
              <div className="mt-1">{body}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
