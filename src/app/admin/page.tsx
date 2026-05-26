import Link from "next/link";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { Chip } from "@/components/Chip";
import { prisma } from "@/lib/prisma";
import { safeDbQuery } from "@/lib/safePrisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const result = await safeDbQuery(() =>
    Promise.all([
      prisma.marketplaceAgent.count(),
      prisma.customer.count(),
      prisma.agentSubscription.count(),
      prisma.deploymentPlan.findMany({
        orderBy: { created_at: "desc" },
        take: 25,
        include: { customer: true },
      }),
      prisma.consultationRequest.findMany({
        orderBy: { created_at: "desc" },
        take: 25,
      }),
      prisma.marketplaceAgent.count({ where: { security_classification: "Sovereign" } }),
    ]),
  );

  if (!result.ok) {
    return <DatabaseUnavailable message={result.error} />;
  }

  const [agents, customers, subscriptions, deploymentPlans, consultations, sovereignCount] =
    result.data;

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Admin</div>
      <h1 className="h-display">Marketplace admin</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Internal Keyra admin view. Mirrors the marketplace state from a
        commercial / ERP perspective. Sovereign agent counts are tracked
        separately for ministry-level reviews.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-8">
        <Stat label="Agents" value={agents} />
        <Stat label="Customers" value={customers} />
        <Stat label="Subscriptions" value={subscriptions} />
        <Stat label="Sovereign agents" value={sovereignCount} tone="sovereign" />
        <Stat label="Consultations" value={consultations.length} />
      </div>

      <section className="mt-10">
        <h2 className="h-section mb-3">Recent deployment plans</h2>
        <div className="table-wrap">
          <table className="k-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Industry</th>
                <th>Country</th>
                <th>Status</th>
                <th>Submitted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {deploymentPlans.length === 0 ? (
                <tr><td colSpan={6} className="text-muted">No plans yet.</td></tr>
              ) : (
                deploymentPlans.map((p) => (
                  <tr key={p.id}>
                    <td>{p.customer.organization_name}</td>
                    <td>{p.industry}</td>
                    <td className="mono text-[12px]">{p.country}</td>
                    <td><Chip tone={p.status === "Approved" ? "positive" : "warning"}>{p.status}</Chip></td>
                    <td className="mono text-[12px] text-muted">
                      {new Date(p.created_at).toISOString().slice(0, 16).replace("T", " ")}
                    </td>
                    <td><Link href={`/deployment/${p.id}`} className="text-[12px] hover:underline">Open →</Link></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <h2 className="h-section mb-3">Consultation requests</h2>
        <div className="table-wrap">
          <table className="k-table">
            <thead>
              <tr>
                <th>Organization</th>
                <th>Industry</th>
                <th>Country</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Submitted</th>
              </tr>
            </thead>
            <tbody>
              {consultations.length === 0 ? (
                <tr><td colSpan={6} className="text-muted">No consultation requests yet.</td></tr>
              ) : (
                consultations.map((c) => (
                  <tr key={c.id}>
                    <td>{c.organization_name}</td>
                    <td>{c.industry}</td>
                    <td className="mono text-[12px]">{c.country}</td>
                    <td className="text-[12.5px]">{c.contact_name} · <span className="mono">{c.contact_email}</span></td>
                    <td><Chip tone={c.status === "Closed" ? "muted" : "warning"}>{c.status}</Chip></td>
                    <td className="mono text-[12px] text-muted">
                      {new Date(c.created_at).toISOString().slice(0, 16).replace("T", " ")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, tone = "default" }: { label: string; value: number; tone?: "default" | "sovereign" }) {
  return (
    <div className="card p-4">
      <div className="h-eyebrow">{label}</div>
      <div className={`text-[24px] font-semibold mt-1 tabular-nums ${tone === "sovereign" ? "text-[color:var(--sovereign)]" : ""}`}>
        {value}
      </div>
    </div>
  );
}
