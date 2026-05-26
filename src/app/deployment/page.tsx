import Link from "next/link";
import { Chip } from "@/components/Chip";

export default function DeploymentOverviewPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-6 py-16">
      <div className="h-eyebrow mb-2">Deployment</div>
      <h1 className="h-display">How a Keyra agent reaches your tenant world</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Every agent is a clean operational design at the catalog layer. It
        becomes a deployed digital worker only after passing identity lineage,
        security, legal, and tenant approval gates.
      </p>

      <ol className="mt-10 space-y-4">
        {[
          ["Browse the marketplace", "Customer selects agents that fit their operational scope and regulatory context."],
          ["Build a deployment plan", "Add agents to a plan. Provide organization, country, and tenant domain."],
          ["Keyra review", "Keyra reviews the plan, scopes integrations, and confirms knowledge packs."],
          ["Security + legal approval", "Security and legal approvals are recorded and must complete before activation."],
          ["Tenant agent instance generated", "A tenant_agent_instance_id is created per deployed agent."],
          ["Customer agent world activates", "Customer-specific tenant world receives subscribed agents and integration checklist."],
          ["Operate and audit", "Every action is audited. Subscription is fully revocable."],
        ].map(([title, body], idx) => (
          <li key={title} className="card p-5 flex items-start gap-5">
            <div className="w-9 h-9 rounded-full border border-[color:var(--border)] flex items-center justify-center font-medium">{idx + 1}</div>
            <div>
              <div className="h-card">{title}</div>
              <div className="text-[13.5px] text-muted leading-relaxed mt-1 max-w-[64ch]">{body}</div>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-12 card p-6">
        <h2 className="h-section mb-4">Agent ID lineage</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-[12.5px]">
          {[
            ["Ciright Parent Agent ID", "agents.ciright.com — origin"],
            ["Keyra Catalog Agent ID", "ciright.agents.keyra.ie — design"],
            ["Subscription Agent ID", "agents.keyra.ie — commercial"],
            ["Tenant Agent Instance ID", "your tenant world — operational"],
          ].map(([title, sub], i) => (
            <div key={title} className="card-flat p-4">
              <div className="h-eyebrow mb-2">Stage {i + 1}</div>
              <div className="font-medium text-[13px]">{title}</div>
              <div className="text-muted mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="h-card mb-3">What customers receive</h2>
          <ul className="text-[13.5px] space-y-1.5 text-muted">
            <li>· Subscribed agent shells</li>
            <li>· Permission templates</li>
            <li>· Deployment workflow</li>
            <li>· Integration checklist</li>
            <li>· Audit model</li>
            <li>· Customer-specific knowledge pack area</li>
          </ul>
        </div>
        <div className="card p-6">
          <h2 className="h-card mb-3">What customers never receive</h2>
          <ul className="text-[13.5px] space-y-1.5 text-muted">
            <li>· Other customer data</li>
            <li>· Other tenant audit logs</li>
            <li>· Keyra private data, unless explicitly approved</li>
          </ul>
        </div>
      </section>

      <div className="mt-12 flex items-center gap-2">
        <Link href="/marketplace" className="btn btn-primary btn-lg">Browse the marketplace</Link>
        <Link href="/consultation" className="btn btn-lg">Talk to a Keyra engineer</Link>
        <Chip tone="sovereign" className="ml-3">Sovereign-grade</Chip>
      </div>
    </div>
  );
}
