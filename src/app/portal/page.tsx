import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Chip } from "@/components/Chip";

export const dynamic = "force-dynamic";

export default async function PortalIndexPage() {
  const customers = await prisma.customer.findMany({
    orderBy: { created_at: "desc" },
    include: { subscriptions: true, deployment_plans: true },
  });

  return (
    <div className="max-w-[1100px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Customer portal</div>
      <h1 className="h-display">Your agent world</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Customers see their subscribed agents, deployment status, pending
        approvals, required integrations, knowledge packs, usage summary,
        billing summary, audit reports, support requests, and expansion
        recommendations.
      </p>

      <div className="mt-10 space-y-4">
        {customers.length === 0 ? (
          <div className="card p-8 text-center text-muted">
            No customers yet.{" "}
            <Link href="/marketplace" className="underline">Browse the marketplace</Link>{" "}
            to request your first deployment.
          </div>
        ) : (
          customers.map((c) => (
            <Link key={c.id} href={`/portal/${c.id}`} className="card p-6 flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="h-card">{c.organization_name}</div>
                <div className="text-[12.5px] text-muted">{c.industry} · {c.country} · <span className="mono">{c.tenant_domain}</span></div>
              </div>
              <div className="flex items-center gap-2">
                <Chip tone="muted">{c.subscriptions.length} agents</Chip>
                <Chip tone={c.status === "Active" ? "positive" : "warning"}>{c.status}</Chip>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
