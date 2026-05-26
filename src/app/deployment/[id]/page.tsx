import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { Chip } from "@/components/Chip";
import { prisma } from "@/lib/prisma";
import { safeDbQuery } from "@/lib/safePrisma";

export const dynamic = "force-dynamic";

export default async function DeploymentPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await safeDbQuery(() =>
    prisma.deploymentPlan.findUnique({
      where: { id },
      include: { items: true, customer: true },
    }),
  );

  if (!result.ok) {
    return <DatabaseUnavailable message={result.error} />;
  }
  if (!result.data) notFound();

  const plan = result.data;

  const stages = [
    { label: "Plan submitted", done: true },
    { label: "Keyra review", done: ["Reviewing", "Approved", "Rejected"].includes(plan.status) },
    { label: "Security + legal approval", done: plan.status === "Approved" },
    { label: "Tenant agent instances provisioned", done: plan.status === "Approved" },
  ];

  return (
    <div className="max-w-[920px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Deployment plan</div>
      <h1 className="h-display">Request received</h1>
      <p className="text-[14px] text-muted mt-3 max-w-[68ch]">
        Thank you. Your deployment plan has been recorded. A Keyra deployment
        engineer will be in touch to confirm scope, sign approvals, and
        provision your tenant agent instances.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card p-6">
          <h2 className="h-card mb-4">Plan status</h2>
          <ol className="space-y-3">
            {stages.map((s, idx) => (
              <li key={s.label} className="flex items-start gap-3">
                <span
                  className="w-6 h-6 rounded-full border border-[color:var(--border)] flex items-center justify-center text-[11px]"
                  style={{
                    background: s.done ? "var(--text)" : "#fff",
                    color: s.done ? "#fff" : "var(--text-muted)",
                  }}
                >
                  {idx + 1}
                </span>
                <div className="text-[13.5px]">
                  <div className={s.done ? "font-medium" : "text-muted"}>{s.label}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-5 pt-5 border-t border-[color:var(--border)] text-[12.5px] text-muted">
            Current status: <Chip tone="warning">{plan.status}</Chip>
          </div>
        </div>

        <div className="card p-6">
          <h2 className="h-card mb-3">Your organization</h2>
          <div className="text-[13px] space-y-1.5">
            <Row k="Organization" v={plan.customer.organization_name} />
            <Row k="Industry" v={plan.industry} />
            <Row k="Country" v={<span className="mono">{plan.country}</span>} />
            <Row k="Tenant domain" v={<span className="mono">{plan.customer.tenant_domain}</span>} />
            <Row k="Contact" v={plan.customer.contact_email} />
          </div>
        </div>
      </div>

      <div className="card p-6 mt-6">
        <h2 className="h-card mb-3">Selected agents</h2>
        <ul className="text-[13.5px] space-y-2">
          {plan.items.map((i) => (
            <li key={i.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{i.agent_name}</div>
                <div className="text-[11.5px] text-muted">{i.agent_industry}</div>
              </div>
              <Chip tone="muted">Awaiting provisioning</Chip>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-2 mt-6">
        <Link href="/portal" className="btn btn-primary">Open Customer Portal</Link>
        <Link href="/marketplace" className="btn">Back to marketplace</Link>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted">{k}</span>
      <span className="text-right">{v}</span>
    </div>
  );
}
