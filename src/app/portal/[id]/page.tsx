import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Chip } from "@/components/Chip";

export const dynamic = "force-dynamic";

export default async function CustomerPortalPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      subscriptions: { include: { agent: true } },
      deployment_plans: { orderBy: { created_at: "desc" } },
    },
  });
  if (!customer) notFound();

  const active = customer.subscriptions.filter((s) => s.subscription_status === "Active");
  const pending = customer.subscriptions.filter((s) => s.subscription_status !== "Active");
  const meteredCount = customer.subscriptions.filter((s) => s.usage_metering_enabled).length;
  const packCount = customer.subscriptions.filter((s) => s.knowledge_pack_attached).length;

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6 text-[12.5px] text-muted">
        <Link href="/portal" className="hover:text-[color:var(--text)]">Customer portal</Link>
        <span>/</span>
        <span className="text-[color:var(--text)]">{customer.organization_name}</span>
      </div>

      <header className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start mb-8">
        <div className="md:col-span-2">
          <div className="h-eyebrow mb-2">Customer</div>
          <h1 className="h-display">{customer.organization_name}</h1>
          <p className="text-[14px] text-muted mt-3">
            Operating world: <span className="mono">{customer.tenant_domain}</span>
          </p>
          <div className="flex flex-wrap gap-1.5 mt-4">
            <Chip>{customer.industry}</Chip>
            <Chip tone="muted"><span className="mono">{customer.country}</span></Chip>
            <Chip tone={customer.status === "Active" ? "positive" : "warning"}>{customer.status}</Chip>
          </div>
        </div>
        <div className="card p-6">
          <div className="h-eyebrow mb-2">Quick stats</div>
          <div className="grid grid-cols-2 gap-3 text-[13px]">
            <Stat k="Active agents" v={active.length} />
            <Stat k="Pending" v={pending.length} />
            <Stat k="Metered" v={meteredCount} />
            <Stat k="With packs" v={packCount} />
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 space-y-6">
          <Block title="Subscribed agents">
            <div className="space-y-2">
              {customer.subscriptions.length === 0 ? (
                <div className="text-[13px] text-muted">No subscriptions yet.</div>
              ) : (
                customer.subscriptions.map((s) => (
                  <div key={s.subscription_id} className="border border-[color:var(--border)] rounded-md p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link href={`/marketplace/${s.agent.agent_slug}`} className="font-medium hover:underline">
                          {s.agent.agent_name}
                        </Link>
                        <div className="text-[11.5px] text-muted">
                          {s.agent.agent_industry} · {s.agent.agent_function} · {s.agent.agent_type}
                        </div>
                        <div className="text-[11px] text-muted mono mt-1">
                          Instance: {s.tenant_agent_instance_id}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Chip tone={s.subscription_status === "Active" ? "positive" : "warning"}>{s.subscription_status}</Chip>
                        <Chip tone="muted">{s.deployment_status}</Chip>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3 text-[11.5px]">
                      <Mini k="Security" v={s.security_approval_status} ok={s.security_approval_status === "Approved"} />
                      <Mini k="Legal" v={s.legal_approval_status} ok={s.legal_approval_status === "Approved"} />
                      <Mini k="Billing" v={s.billing_model} />
                      <Mini k="Pack" v={s.knowledge_pack_attached ? "Attached" : "—"} ok={s.knowledge_pack_attached} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </Block>

          <Block title="Deployment plans">
            {customer.deployment_plans.length === 0 ? (
              <div className="text-[13px] text-muted">No deployment plans recorded.</div>
            ) : (
              <ul className="space-y-2 text-[13px]">
                {customer.deployment_plans.map((p) => (
                  <li key={p.id} className="flex items-center justify-between border border-[color:var(--border)] rounded-md p-3">
                    <div>
                      <Link href={`/deployment/${p.id}`} className="hover:underline">Plan {p.id.slice(0, 8)}</Link>
                      <div className="text-[11px] text-muted mono">
                        {new Date(p.created_at).toISOString().slice(0, 16).replace("T", " ")}
                      </div>
                    </div>
                    <Chip tone={p.status === "Approved" ? "positive" : "warning"}>{p.status}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </Block>
        </section>

        <section className="space-y-6">
          <Block title="Pending approvals">
            {pending.length === 0 ? (
              <div className="text-[13px] text-muted">All clear.</div>
            ) : (
              <ul className="text-[13px] space-y-1.5">
                {pending.map((p) => (
                  <li key={p.subscription_id} className="flex items-center justify-between">
                    <span>{p.agent.agent_name}</span>
                    <Chip tone="warning">{p.deployment_status}</Chip>
                  </li>
                ))}
              </ul>
            )}
          </Block>

          <Block title="Required integrations">
            <div className="text-[12.5px] text-muted">
              Each agent ships with required integration scope. Connect once;
              tenant-scoped connections are reused across agents.
            </div>
            <ul className="mt-3 text-[12.5px] space-y-1">
              {Array.from(new Set(customer.subscriptions.flatMap((s) => JSON.parse(s.agent.required_integrations || "[]")))).map((i) => (
                <li key={String(i)} className="flex items-center gap-1.5">
                  <span className="chip-dot" style={{ background: "#0e0e10" }} />
                  {String(i)}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Knowledge packs">
            <div className="text-[12.5px] text-muted">
              Customer-specific packs live inside the tenant world. Keyra never
              stores tenant-private knowledge unless explicitly approved.
            </div>
          </Block>

          <Block title="Audit reports">
            <ul className="text-[12.5px] space-y-1.5">
              <li>Daily operational audit</li>
              <li>Sovereign packet (if applicable)</li>
              <li>Regulator export (PDF)</li>
            </ul>
          </Block>

          <Block title="Expansion recommendations">
            <div className="text-[12.5px] text-muted">
              Based on your bundle, consider adding adjacent agents.
            </div>
            <Link href={`/marketplace?industry=${encodeURIComponent(customer.industry)}`} className="btn mt-3 w-full justify-center">
              Browse {customer.industry} agents →
            </Link>
          </Block>
        </section>
      </div>
    </div>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-6">
      <h3 className="h-card mb-3">{title}</h3>
      {children}
    </div>
  );
}
function Stat({ k, v }: { k: string; v: number }) {
  return (
    <div>
      <div className="h-eyebrow">{k}</div>
      <div className="text-[20px] font-semibold tabular-nums mt-0.5">{v}</div>
    </div>
  );
}
function Mini({ k, v, ok }: { k: string; v: string; ok?: boolean }) {
  return (
    <div>
      <div className="h-eyebrow">{k}</div>
      <div className="mt-0.5">
        <Chip tone={ok ? "positive" : "muted"}>{v}</Chip>
      </div>
    </div>
  );
}
