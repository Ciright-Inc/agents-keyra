import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { AgentCard } from "@/components/AgentCard";

export const dynamic = "force-dynamic";

type Search = {
  q?: string;
  industry?: string;
  function?: string;
  type?: string;
  country?: string;
  subscription?: string;
};

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const params = await searchParams;

  const where: Record<string, unknown> = { deployment_status: "Published" };
  if (params.q) {
    where.OR = [
      { agent_name: { contains: params.q } },
      { agent_description: { contains: params.q } },
    ];
  }
  if (params.industry) where.agent_industry = params.industry;
  if (params.function) where.agent_function = params.function;
  if (params.type) where.agent_type = params.type;
  if (params.subscription) where.subscription_type = params.subscription;
  if (params.country) where.country_applicability = { contains: `"${params.country}"` };

  const [agents, industries, functions, types] = await Promise.all([
    prisma.marketplaceAgent.findMany({ where, orderBy: [{ agent_industry: "asc" }, { agent_name: "asc" }] }),
    prisma.marketplaceAgent.groupBy({ by: ["agent_industry"], _count: { agent_industry: true } }),
    prisma.marketplaceAgent.groupBy({ by: ["agent_function"], _count: { agent_function: true } }),
    prisma.marketplaceAgent.groupBy({ by: ["agent_type"], _count: { agent_type: true } }),
  ]);

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <header className="flex items-end justify-between gap-6 mb-8">
        <div>
          <div className="h-eyebrow mb-2">Marketplace</div>
          <h1 className="h-display">Agent Marketplace</h1>
          <p className="text-[14px] text-muted mt-2 max-w-[68ch]">
            Discover, evaluate, subscribe to, and deploy governed digital workers.
            Every listing is a clean operational design — customer data stays inside the tenant world.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/bundles" className="btn">Bundles</Link>
          <Link href="/consultation" className="btn btn-primary">Talk to Keyra</Link>
        </div>
      </header>

      <form className="card p-4 mb-8" method="get">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-4">
            <label className="h-eyebrow block mb-1">Search</label>
            <input className="input" type="text" name="q" defaultValue={params.q || ""} placeholder="Name or description…" />
          </div>
          <div className="col-span-6 md:col-span-2">
            <label className="h-eyebrow block mb-1">Industry</label>
            <select className="select" name="industry" defaultValue={params.industry || ""}>
              <option value="">All</option>
              {industries.map((i) => (
                <option key={i.agent_industry} value={i.agent_industry}>{i.agent_industry}</option>
              ))}
            </select>
          </div>
          <div className="col-span-6 md:col-span-2">
            <label className="h-eyebrow block mb-1">Function</label>
            <select className="select" name="function" defaultValue={params.function || ""}>
              <option value="">All</option>
              {functions.map((f) => (
                <option key={f.agent_function} value={f.agent_function}>{f.agent_function}</option>
              ))}
            </select>
          </div>
          <div className="col-span-6 md:col-span-2">
            <label className="h-eyebrow block mb-1">Type</label>
            <select className="select" name="type" defaultValue={params.type || ""}>
              <option value="">All</option>
              {types.map((t) => (
                <option key={t.agent_type} value={t.agent_type}>{t.agent_type}</option>
              ))}
            </select>
          </div>
          <div className="col-span-6 md:col-span-2">
            <label className="h-eyebrow block mb-1">Subscription</label>
            <select className="select" name="subscription" defaultValue={params.subscription || ""}>
              <option value="">All</option>
              <option>Standard</option>
              <option>Regulated</option>
              <option>Sovereign</option>
              <option>Bespoke</option>
            </select>
          </div>
          <div className="col-span-12 flex items-center gap-2">
            <button className="btn btn-primary" type="submit">Apply</button>
            <Link href="/marketplace" className="btn">Reset</Link>
            <span className="text-[12px] text-muted ml-auto">
              {agents.length} agent{agents.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>
      </form>

      {agents.length === 0 ? (
        <div className="card p-12 text-center text-muted">No agents match the current filters.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((a) => (
            <AgentCard key={a.keyra_agent_id} a={a} />
          ))}
        </div>
      )}
    </div>
  );
}
