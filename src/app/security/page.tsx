import Link from "next/link";
import { Chip } from "@/components/Chip";

const RULES = [
  {
    title: "Tenant isolation",
    body: "Every deployment runs inside a customer-specific tenant world. No agent ever crosses tenant boundaries.",
  },
  {
    title: "Agent ID traceability",
    body: "From Ciright parent → Keyra catalog → subscription → tenant instance, every agent is fully traceable.",
  },
  {
    title: "Role-based access",
    body: "All operations are gated by roles. Operators, reviewers, sovereign admins, and tenant admins have distinct capability scopes.",
  },
  {
    title: "Human approval",
    body: "Material actions require human-in-the-loop approval. Approval is recorded for every decision.",
  },
  {
    title: "Audit logs",
    body: "Append-only audit log on every action. Sovereign deployments include ministry-level audit packaging.",
  },
  {
    title: "Permission boundaries",
    body: "Permission templates are bound at deployment time. Agents cannot self-elevate.",
  },
  {
    title: "API access controls",
    body: "Outbound API calls are scoped to required integrations. No external network access by default.",
  },
  {
    title: "Knowledge pack controls",
    body: "Knowledge packs are explicit, versioned, and revocable. Customer-private knowledge stays in the tenant world.",
  },
  {
    title: "Legal approval",
    body: "Each subscription carries a legal approval status that must be set to Approved before activation.",
  },
  {
    title: "Security approval",
    body: "Each subscription carries a security approval status that must be set to Approved before activation.",
  },
  {
    title: "Revocation",
    body: "Subscriptions are fully revocable. Revocation cascades to all tenant agent instance IDs.",
  },
];

export default function SecurityPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Security &amp; trust</div>
      <h1 className="h-display">Eleven controls. Every deployment.</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Keyra agents operate inside regulated environments. The trust model
        below is enforced on every customer tenant, every subscription, and
        every agent instance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10">
        {RULES.map((r, idx) => (
          <div key={r.title} className="card p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-7 h-7 rounded-full border border-[color:var(--border)] flex items-center justify-center text-[12px] mono">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="h-card">{r.title}</div>
            </div>
            <p className="text-[13.5px] text-muted leading-relaxed">{r.body}</p>
          </div>
        ))}
      </div>

      <div className="card p-7 mt-10">
        <h2 className="h-section mb-3">Sovereign deployments</h2>
        <p className="text-[14px] text-muted leading-relaxed">
          For ministry-level and country-resident deployments, Keyra operates
          under a dedicated sovereign control envelope: in-country
          infrastructure, sovereign-admin role, regulator-visible audit, and
          contract-grade billing.
        </p>
        <div className="flex items-center gap-2 mt-5">
          <Link href="/consultation" className="btn btn-primary">Talk to Keyra Sovereign</Link>
          <Chip tone="sovereign">Sovereign-grade</Chip>
        </div>
      </div>
    </div>
  );
}
