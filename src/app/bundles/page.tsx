import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Chip } from "@/components/Chip";

export const dynamic = "force-dynamic";

export default async function BundlesPage() {
  const bundles = await prisma.bundle.findMany({
    orderBy: [{ highlight: "desc" }, { name: "asc" }],
    include: { items: { include: { agent: true } } },
  });

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Bundles</div>
      <h1 className="h-display">Curated agent bundles</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Bundles are ready-made deployment plans for common operating realities.
        Subscribe a bundle to receive the full set of agents under one
        commercial and governance umbrella.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        {bundles.map((b) => (
          <Link key={b.id} href={`/bundles/${b.slug}`} className="card p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="h-card">{b.name}</div>
                <div className="text-[12px] text-muted">{b.industry}</div>
              </div>
              <div className="flex gap-1.5">
                {b.highlight ? <Chip tone="inverted">Featured</Chip> : null}
                <Chip tone="muted">{b.items.length} agents</Chip>
              </div>
            </div>
            <p className="text-[13.5px] text-muted leading-relaxed mt-3">{b.description}</p>
            {b.positioning ? (
              <p className="text-[13px] mt-3 italic">{b.positioning}</p>
            ) : null}
            <ul className="text-[12.5px] mt-4 grid grid-cols-2 gap-y-1">
              {b.items.slice(0, 6).map((it) => (
                <li key={it.id} className="flex items-center gap-1.5">
                  <span className="chip-dot" style={{ background: "#0e0e10" }} />
                  {it.agent.agent_name}
                </li>
              ))}
            </ul>
            <div className="mt-4 text-[12.5px]">View bundle →</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
