import Link from "next/link";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { Chip } from "@/components/Chip";
import { prisma } from "@/lib/prisma";
import { safeDbQuery } from "@/lib/safePrisma";

export const dynamic = "force-dynamic";

const INDUSTRY_POSITIONING: Record<string, string> = {
  "Telecom":
    "Run the subscriber estate as one governed surface — SIM lifecycle, fraud, port-outs, eSIM, roaming.",
  "Banking":
    "Stand up a defensible compliance posture: KYC, AML, transaction anomaly, regulatory reporting.",
  "Government":
    "Sovereign infrastructure for civil registry, hospital reporting, statistics, and identity.",
  "Healthcare":
    "Patient-safe operational workers with audit-grade evidence and HIPAA controls.",
  "University / Education":
    "Real-time admissions intelligence and applicant lifecycle for provosts and registrars.",
  "Enterprise":
    "Revenue-operations digital workers across CRM, proposals, RFPs, and executive briefings.",
  "Legal":
    "Contract review, document preparation, and approval routing with audit logs.",
  "Security":
    "Identity, device trust, threat aggregation, and operational alerting.",
  "Insurance":
    "Risk scoring, claims preparation, and regulatory reporting at scale.",
  "Agriculture":
    "Field intelligence, regional infrastructure, and sustainability reporting.",
  "Environment":
    "Civic-grade environmental monitoring and statistical reporting.",
  "Transportation":
    "Fleet and corridor intelligence with operational alerting and approvals.",
  "Utilities":
    "Network usage intelligence, fraud detection, and customer onboarding.",
  "Smart Cities":
    "Population, infrastructure, and public service intelligence — sovereign-grade.",
};

export default async function IndustriesPage() {
  const result = await safeDbQuery(() =>
    prisma.marketplaceAgent.groupBy({
      by: ["agent_industry"],
      _count: { agent_industry: true },
    }),
  );

  if (!result.ok) {
    return <DatabaseUnavailable message={result.error} />;
  }

  const rows = result.data;

  const ordered = Object.keys(INDUSTRY_POSITIONING).map((name) => ({
    name,
    count: rows.find((r) => r.agent_industry === name)?._count.agent_industry ?? 0,
    positioning: INDUSTRY_POSITIONING[name],
  }));

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Industries</div>
      <h1 className="h-display">Built for regulated and sovereign industries</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Keyra agents are designed for environments with high audit demands,
        complex approvals, sovereign data residency, and customer trust at
        stake.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {ordered.map((i) => (
          <Link
            key={i.name}
            href={`/marketplace?industry=${encodeURIComponent(i.name)}`}
            className="card p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="h-card">{i.name}</div>
              <Chip tone={i.count > 0 ? "positive" : "muted"}>{i.count}</Chip>
            </div>
            <p className="text-[13.5px] text-muted leading-relaxed">{i.positioning}</p>
            <div className="mt-4 text-[12.5px]">Browse agents →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
