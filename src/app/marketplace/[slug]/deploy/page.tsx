import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Chip } from "@/components/Chip";
import { submitDeployment } from "./actions";

export const dynamic = "force-dynamic";

export default async function DeployPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = await prisma.marketplaceAgent.findUnique({ where: { agent_slug: slug } });
  if (!agent) notFound();

  return (
    <div className="max-w-[920px] mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6 text-[12.5px] text-muted">
        <Link href="/marketplace" className="hover:text-[color:var(--text)]">Marketplace</Link>
        <span>/</span>
        <Link href={`/marketplace/${agent.agent_slug}`} className="hover:text-[color:var(--text)]">{agent.agent_name}</Link>
        <span>/</span>
        <span className="text-[color:var(--text)]">Request deployment</span>
      </div>

      <div className="h-eyebrow mb-2">Request deployment</div>
      <h1 className="h-display">{agent.agent_name}</h1>
      <p className="text-[14px] text-muted mt-3 max-w-[68ch]">
        Tell us about your organization. Keyra will review, perform security
        and legal approval, and provision your tenant agent instance. Your
        operational data never leaves your tenant world.
      </p>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <form action={submitDeployment} className="lg:col-span-2 card p-6 space-y-4">
          <input type="hidden" name="agentSlug" value={agent.agent_slug} />

          <Field name="organization_name" label="Organization name" required placeholder="Northwind Telecom" />
          <div className="grid grid-cols-2 gap-3">
            <Field name="industry" label="Industry" defaultValue={agent.agent_industry} />
            <Field name="country" label="Country (ISO code)" placeholder="IE" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field name="contact_name" label="Primary contact" required />
            <Field name="contact_email" label="Contact email" required type="email" />
          </div>
          <Field name="tenant_domain" label="Tenant agent world domain" required placeholder="agents.your-org.com" mono />

          <div>
            <label className="h-eyebrow block mb-1">Notes for Keyra</label>
            <textarea name="notes" className="textarea" rows={4} placeholder="Knowledge packs, regulators involved, target go-live…" />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button className="btn btn-primary btn-lg" type="submit">Submit request</button>
            <Link href={`/marketplace/${agent.agent_slug}`} className="btn">Cancel</Link>
          </div>
          <div className="text-[11.5px] text-muted pt-2 border-t border-[color:var(--border)]">
            Submission creates a deployment plan. Keyra will review, perform
            security/legal approval, and provision a tenant agent instance.
          </div>
        </form>

        <aside className="space-y-4">
          <div className="card p-5">
            <h3 className="h-card mb-3">What gets created</h3>
            <ol className="text-[12.5px] space-y-2 list-decimal pl-4 text-muted">
              <li>Customer record (your organization).</li>
              <li>Deployment plan with this agent attached.</li>
              <li>Keyra security + legal approval.</li>
              <li>Agent subscription record.</li>
              <li>Tenant Agent Instance ID generated.</li>
              <li>Agent shell provisioned inside your tenant world.</li>
            </ol>
          </div>

          <div className="card p-5">
            <h3 className="h-card mb-3">What does <em>not</em> happen</h3>
            <ul className="text-[12.5px] space-y-2 text-muted">
              <li>· No customer data is copied to Keyra.</li>
              <li>· No Keyra private knowledge crosses tenants.</li>
              <li>· No silent activation — every gate is human-reviewed.</li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="h-card mb-3">Agent at a glance</h3>
            <div className="space-y-1.5 text-[12.5px]">
              <Row k="Industry" v={agent.agent_industry} />
              <Row k="Type" v={agent.agent_type} />
              <Row k="Security" v={<Chip tone={agent.security_classification === "Sovereign" ? "sovereign" : "muted"}>{agent.security_classification}</Chip>} />
              <Row k="Subscription" v={<Chip tone={agent.subscription_type === "Sovereign" ? "sovereign" : agent.subscription_type === "Regulated" ? "warning" : "muted"}>{agent.subscription_type}</Chip>} />
              <Row k="Billing" v={<span className="mono">{agent.billing_model}</span>} />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({
  name,
  label,
  required,
  placeholder,
  defaultValue,
  type = "text",
  mono = false,
}: {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  type?: string;
  mono?: boolean;
}) {
  return (
    <div>
      <label className="h-eyebrow block mb-1">{label}{required ? <span className="text-[color:var(--critical)]"> *</span> : null}</label>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        required={required}
        className={`input ${mono ? "mono" : ""}`}
      />
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{k}</span>
      <span>{v}</span>
    </div>
  );
}
