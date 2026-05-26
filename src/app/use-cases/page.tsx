import Link from "next/link";
import { Chip } from "@/components/Chip";

const CASES = [
  {
    industry: "Telecom",
    title: "A telco subscribes to 50 Keyra agents",
    body: [
      "They rename the agents under their own domain.",
      "The SIM Monitoring Agent watches activations, SIM swaps, port-outs, eSIM provisioning, and usage anomalies.",
      "The agent design comes from Ciright. The telco data remains inside the telco tenant world.",
    ],
    tone: "warning" as const,
    bundle: "Telecom Bundle",
    slug: "telecom-bundle",
  },
  {
    industry: "Government",
    title: "A country subscribes to population agents",
    body: [
      "The Population Monitoring Agent aggregates daily birth and death reporting from hospitals.",
      "The National Statistics Agent provides dashboards for ministries.",
      "No other country sees the data. Sovereign deployment with country-resident infrastructure.",
    ],
    tone: "sovereign" as const,
    bundle: "Government Population Bundle",
    slug: "government-population-bundle",
  },
  {
    industry: "University / Education",
    title: "A university subscribes to Student Application Agents",
    body: [
      "The Provost sees real-time application volume, applicant status, activation funnel, admissions trends, and enrollment projections.",
      "Transcript and visa flows are routed for human approval.",
    ],
    tone: "muted" as const,
    bundle: "University Admissions Bundle",
    slug: "university-admissions-bundle",
  },
  {
    industry: "Banking",
    title: "A bank subscribes to KYC, AML, fraud, and device trust agents",
    body: [
      "Agents monitor risk and prepare review packets.",
      "Issues are escalated to human compliance teams with full audit packets.",
      "Regulatory reporting agent prepares filings on a schedule.",
    ],
    tone: "warning" as const,
    bundle: "Banking Trust Bundle",
    slug: "banking-trust-bundle",
  },
];

export default function UseCasesPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Use cases</div>
      <h1 className="h-display">How Keyra is deployed in the real world</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Four illustrative deployment scenarios — each shows where the agent
        design comes from, what the customer receives, and what stays inside
        the tenant world.
      </p>

      <div className="grid grid-cols-1 gap-6 mt-10">
        {CASES.map((c) => (
          <div key={c.title} className="card p-7">
            <div className="flex items-center gap-3 mb-3">
              <Chip tone={c.tone}>{c.industry}</Chip>
            </div>
            <h2 className="h-section">{c.title}</h2>
            <ul className="mt-3 text-[14px] text-muted leading-relaxed space-y-2">
              {c.body.map((b) => (
                <li key={b} className="flex gap-2">
                  <span>·</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <Link href={`/bundles/${c.slug}`} className="btn">
                See the {c.bundle} →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
