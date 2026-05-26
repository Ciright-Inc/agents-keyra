import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { Chip } from "@/components/Chip";
import { prisma } from "@/lib/prisma";
import { safeDbQuery } from "@/lib/safePrisma";
import { arr, securityChipClass, subscriptionTypeChipClass } from "@/lib/agent";

export const dynamic = "force-dynamic";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await safeDbQuery(async () => {
    const agent = await prisma.marketplaceAgent.findUnique({ where: { agent_slug: slug } });
    if (!agent) return null;
    const siblings = await prisma.marketplaceAgent.findMany({
      where: {
        agent_industry: agent.agent_industry,
        NOT: { keyra_agent_id: agent.keyra_agent_id },
      },
      take: 4,
    });
    return { agent, siblings };
  });

  if (!result.ok) {
    return <DatabaseUnavailable message={result.error} />;
  }
  if (!result.data) notFound();

  const { agent, siblings } = result.data;

  const capabilities = arr(agent.agent_capabilities);
  const inputs = arr(agent.required_inputs);
  const outputs = arr(agent.expected_outputs);
  const permissions = arr(agent.required_permissions);
  const integrations = arr(agent.required_integrations);
  const countries = arr(agent.country_applicability);

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6 text-[12.5px] text-muted">
        <Link href="/marketplace" className="hover:text-[color:var(--text)]">Marketplace</Link>
        <span>/</span>
        <Link href={`/marketplace?industry=${encodeURIComponent(agent.agent_industry)}`} className="hover:text-[color:var(--text)]">
          {agent.agent_industry}
        </Link>
        <span>/</span>
        <span className="text-[color:var(--text)]">{agent.agent_name}</span>
      </div>

      <header className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start mb-10">
        <div className="lg:col-span-2">
          <div className="h-eyebrow mb-2">{agent.agent_category}</div>
          <h1 className="h-display">{agent.agent_name}</h1>
          <p className="text-[15px] text-muted mt-3 leading-relaxed max-w-[68ch]">
            {agent.agent_description}
          </p>
          <div className="flex flex-wrap gap-1.5 mt-5">
            <Chip>{agent.agent_industry}</Chip>
            <Chip tone="muted">{agent.agent_function}</Chip>
            <Chip tone="muted">{agent.agent_type}</Chip>
            <span className={securityChipClass(agent.security_classification)}>{agent.security_classification}</span>
            <span className={subscriptionTypeChipClass(agent.subscription_type)}>{agent.subscription_type}</span>
            {agent.human_approval_required ? <Chip tone="warning">Human approval required</Chip> : null}
            {agent.regulatory_classification !== "None" ? (
              <Chip tone="sovereign">{agent.regulatory_classification}</Chip>
            ) : null}
          </div>
        </div>
        <div className="card p-6">
          <div className="h-eyebrow mb-3">Subscribe to this agent</div>
          <div className="text-[13px] text-muted mb-5">
            Subscription creates a tenant agent instance inside your agent world.
            Customer data, transactions, and experience remain inside your tenant.
          </div>
          <form action={`/marketplace/${agent.agent_slug}/deploy`} method="get" className="space-y-3">
            <Link href={`/marketplace/${agent.agent_slug}/deploy`} className="btn btn-primary btn-lg w-full justify-center">
              Request deployment
            </Link>
            <Link href="/consultation" className="btn w-full justify-center">
              Request consultation
            </Link>
          </form>
          <div className="mt-5 pt-5 border-t border-[color:var(--border)] text-[12px] space-y-1.5 text-muted">
            <div className="flex justify-between"><span>Billing model</span><span className="text-[color:var(--text)] mono">{agent.billing_model}</span></div>
            <div className="flex justify-between"><span>Deployment</span><span className="text-[color:var(--text)]">{agent.deployment_status}</span></div>
            <div className="flex justify-between"><span>Version</span><span className="text-[color:var(--text)] mono">{agent.version}</span></div>
          </div>
        </div>
      </header>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card title="Capabilities">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 text-[13.5px]">
              {capabilities.map((c) => (
                <li key={c} className="flex items-center gap-2">
                  <span className="chip-dot" style={{ background: "#0e0e10" }} />
                  {c}
                </li>
              ))}
            </ul>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ListCard title="Required inputs" items={inputs} />
            <ListCard title="Expected outputs" items={outputs} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ListCard title="Required integrations" items={integrations} />
            <ListCard title="Permission model" items={permissions} mono />
          </div>

          <Card title="Country applicability">
            <div className="flex flex-wrap gap-1.5">
              {countries.map((c) => (
                <Chip key={c} tone="muted"><span className="mono">{c}</span></Chip>
              ))}
            </div>
          </Card>

          <Card title="Trust and isolation">
            <ul className="text-[13.5px] space-y-2 text-muted">
              <li>· Tenant isolation enforced at deploy time.</li>
              <li>· Agent ID lineage from Ciright parent to tenant instance.</li>
              <li>· Role-based access; permission boundaries by design.</li>
              {agent.human_approval_required ? <li>· Human-in-the-loop required for any material change.</li> : null}
              <li>· Audit log on every action.</li>
              <li>· Knowledge pack controls; customer-specific packs attachable.</li>
              <li>· Revocable subscription, sovereign-grade controls available.</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Lineage">
            <div className="text-[12.5px] text-muted leading-relaxed">
              Every agent has end-to-end identity traceability.
            </div>
            <ol className="mt-3 space-y-1.5 text-[12.5px]">
              <Lineage label="Ciright Parent Agent ID" value={agent.ciright_parent_agent_id ?? "Linked at provisioning"} />
              <Lineage label="Keyra Catalog ID" value={agent.keyra_agent_id} />
              <Lineage label="Subscription Agent ID" value="(generated at subscription)" />
              <Lineage label="Tenant Agent Instance ID" value="(generated at deploy)" />
            </ol>
          </Card>

          <Card title="Approval and security">
            <ul className="text-[12.5px] space-y-1.5">
              <li>· Security approval required prior to activation.</li>
              <li>· Legal approval required prior to activation.</li>
              <li>· {agent.knowledge_pack_required ? "Knowledge pack required for deployment." : "Knowledge pack is optional."}</li>
            </ul>
          </Card>
        </div>
      </section>

      {siblings.length > 0 ? (
        <section className="mt-16">
          <div className="flex items-end justify-between mb-5">
            <div>
              <div className="h-eyebrow mb-2">Related in {agent.agent_industry}</div>
              <h2 className="h-section">Often deployed together</h2>
            </div>
            <Link href={`/marketplace?industry=${encodeURIComponent(agent.agent_industry)}`} className="btn">
              See all in {agent.agent_industry} →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {siblings.map((s) => (
              <Link key={s.keyra_agent_id} href={`/marketplace/${s.agent_slug}`} className="card p-4 hover:shadow-md transition-shadow">
                <div className="font-medium text-[14px]">{s.agent_name}</div>
                <div className="text-[11.5px] text-muted mt-1">{s.agent_function}</div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="h-card mb-3">{title}</h3>
      {children}
    </div>
  );
}

function ListCard({ title, items, mono = false }: { title: string; items: string[]; mono?: boolean }) {
  return (
    <Card title={title}>
      {items.length === 0 ? (
        <div className="text-[12.5px] text-muted">None.</div>
      ) : (
        <ul className={`space-y-1.5 text-[13.5px] ${mono ? "mono" : ""}`}>
          {items.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-muted">·</span>
              <span>{i}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

function Lineage({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--text)] mt-1.5 shrink-0" />
      <div>
        <div className="text-[10.5px] uppercase tracking-[0.12em] text-muted">{label}</div>
        <div className="mono text-[12.5px] break-all">{value}</div>
      </div>
    </li>
  );
}
