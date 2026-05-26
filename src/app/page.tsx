import Link from "next/link";
import { AgentCard } from "@/components/AgentCard";
import { Chip } from "@/components/Chip";
import { loadMarketplaceHomeData } from "@/lib/marketplaceHome";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await loadMarketplaceHomeData();

  if (!data.ok) {
    return (
      <section className="max-w-[720px] mx-auto px-6 pt-24 pb-24">
        <Chip tone="warning" className="mb-4">
          Marketplace data unavailable
        </Chip>
        <h1 className="h-section">Database not ready</h1>
        <p className="mt-4 text-[15px] leading-relaxed text-muted">{data.error}</p>
        <p className="mt-3 text-[14px] text-muted">
          On Railway: attach a Postgres plugin, set{" "}
          <code className="mono text-[13px]">DATABASE_URL=&#123;&#123; Postgres.DATABASE_URL &#125;&#125;</code>, then
          redeploy. Check <code className="mono text-[13px]">/api/health?db=1</code> for status.
        </p>
        <div className="flex gap-3 mt-8">
          <Link href="/use-cases" className="btn btn-primary">
            Browse use cases
          </Link>
          <Link href="/security" className="btn">
            Security model
          </Link>
        </div>
      </section>
    );
  }

  const { featured, bundles, industries, agentCount, sovereignCount } = data;

  return (
    <>
      {/* Hero */}
      <section className="hero-canvas">
        <div className="absolute inset-0 grid-pattern pointer-events-none" />
        <div className="max-w-[1320px] mx-auto px-6 pt-24 pb-24 relative">
          <div className="max-w-[920px]">
            <Chip tone="sovereign" className="mb-6">
              <span className="chip-dot" /> Sovereign · Enterprise · Regulated · Global
            </Chip>
            <h1 className="h-hero">
              Operational civilization infrastructure
              <br />
              <span className="text-muted">for the autonomous era.</span>
            </h1>
            <p className="mt-7 text-[18px] leading-relaxed text-muted max-w-[68ch]">
              Keyra provides trusted, governed, subscription-based digital
              workers for telcos, banks, governments, universities, healthcare
              systems, and enterprises.
            </p>
            <div className="flex items-center gap-3 mt-9">
              <Link href="/marketplace" className="btn btn-primary btn-lg">Explore Agents</Link>
              <Link href="/consultation" className="btn btn-lg">Request Deployment Consultation</Link>
            </div>

            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-[820px]">
              <Pill k="Agents" v={agentCount} />
              <Pill k="Sovereign-grade" v={sovereignCount} />
              <Pill k="Industries" v={industries.length} />
              <Pill k="Bundles" v={bundles.length} />
            </div>
          </div>
        </div>
      </section>

      {/* Positioning paragraph */}
      <section className="max-w-[1320px] mx-auto px-6 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-1">
            <div className="h-eyebrow mb-3">Positioning</div>
            <h2 className="h-section">
              Not chatbots. <br />
              Governed digital workers.
            </h2>
          </div>
          <div className="md:col-span-2 space-y-4 text-[15px] leading-relaxed text-muted">
            <p>
              These are not chatbots. These are governed digital workers
              designed to perform trusted operational work inside regulated
              environments.
            </p>
            <p>
              Agents are deployed as clean operational designs. Customer data,
              experience, and transaction history remain inside the customer
              tenant world.
            </p>
            <p>
              Every deployment enforces tenant isolation, agent ID traceability,
              role-based access, human approval gates, audit logs, permission
              boundaries, API access controls, knowledge pack controls, legal
              approval, security approval, and revocation capability.
            </p>
          </div>
        </div>
      </section>

      {/* Featured agents */}
      <section className="max-w-[1320px] mx-auto px-6 pt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="h-eyebrow mb-2">Featured agents</div>
            <h2 className="h-section">A few from the marketplace</h2>
          </div>
          <Link href="/marketplace" className="btn">Browse all →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((a) => (
            <AgentCard key={a.keyra_agent_id} a={a} />
          ))}
        </div>
      </section>

      {/* Bundles */}
      <section className="max-w-[1320px] mx-auto px-6 pt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="h-eyebrow mb-2">Bundles</div>
            <h2 className="h-section">Curated bundles for each industry</h2>
          </div>
          <Link href="/bundles" className="btn">All bundles →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bundles.map((b) => (
            <Link key={b.id} href={`/bundles/${b.slug}`} className="card p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-2">
                <div className="h-card">{b.name}</div>
                <Chip tone="muted">{b.items.length} agents</Chip>
              </div>
              <div className="text-[12px] text-muted mb-3">{b.industry}</div>
              <p className="text-[13.5px] leading-relaxed text-muted">{b.description}</p>
              {b.positioning ? (
                <p className="text-[12.5px] mt-3">{b.positioning}</p>
              ) : null}
              <div className="mt-5 pt-4 border-t border-[color:var(--border)] text-[12.5px]">
                View bundle →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Industries */}
      <section className="max-w-[1320px] mx-auto px-6 pt-20">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="h-eyebrow mb-2">Industries</div>
            <h2 className="h-section">Built for regulated industries</h2>
          </div>
          <Link href="/industries" className="btn">All industries →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {industries.map((i) => (
            <Link
              key={i.agent_industry}
              href={`/marketplace?industry=${encodeURIComponent(i.agent_industry)}`}
              className="card p-5 hover:bg-[color:var(--surface-2)] transition-colors"
            >
              <div className="font-medium text-[14px]">{i.agent_industry}</div>
              <div className="text-[11.5px] text-muted mt-1">
                {i._count.agent_industry} agent{i._count.agent_industry === 1 ? "" : "s"}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tenant Agent World */}
      <section className="max-w-[1320px] mx-auto px-6 pt-20">
        <div className="card p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
            <div>
              <div className="h-eyebrow mb-3">Tenant agent world</div>
              <h2 className="h-section">Your own world. No one else's data.</h2>
              <p className="text-[14px] text-muted leading-relaxed mt-3">
                Each customer receives subscribed agent shells, permission
                templates, deployment workflow, integration checklist, audit
                model, and a customer-specific knowledge pack area.
              </p>
              <p className="text-[14px] text-muted leading-relaxed mt-3">
                No other customer data is visible. No Keyra private data is
                exposed unless explicitly approved.
              </p>
              <div className="flex items-center gap-2 mt-5">
                <Link href="/deployment" className="btn">How deployment works</Link>
                <Link href="/security" className="btn">Security model</Link>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {[
                "agents.telco-name.com",
                "agents.bank-name.com",
                "agents.university.edu",
                "agents.country.gov",
                "agents.customerdomain.com",
              ].map((domain) => (
                <div key={domain} className="flex items-center justify-between card-flat p-4">
                  <span className="mono text-[13px]">{domain}</span>
                  <Chip tone="muted">Tenant world</Chip>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="max-w-[1320px] mx-auto px-6 pt-20">
        <div className="card p-10 text-center">
          <div className="h-eyebrow mb-3">Get started</div>
          <h2 className="h-display">
            Deploy trusted digital workers
            <br />
            <span className="text-muted">inside your regulated environment.</span>
          </h2>
          <div className="flex items-center justify-center gap-3 mt-7">
            <Link href="/marketplace" className="btn btn-primary btn-lg">Explore Agents</Link>
            <Link href="/consultation" className="btn btn-lg">Talk to Keyra</Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Pill({ k, v }: { k: string; v: number }) {
  return (
    <div className="card-flat px-4 py-3">
      <div className="h-eyebrow">{k}</div>
      <div className="text-[20px] font-semibold tabular-nums mt-0.5">{v}</div>
    </div>
  );
}
