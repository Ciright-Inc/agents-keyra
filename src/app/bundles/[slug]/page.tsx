import Link from "next/link";
import { notFound } from "next/navigation";
import { DatabaseUnavailable } from "@/components/DatabaseUnavailable";
import { AgentCard } from "@/components/AgentCard";
import { Chip } from "@/components/Chip";
import { prisma } from "@/lib/prisma";
import { safeDbQuery } from "@/lib/safePrisma";

export const dynamic = "force-dynamic";

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await safeDbQuery(() =>
    prisma.bundle.findUnique({
      where: { slug },
      include: { items: { include: { agent: true } } },
    }),
  );

  if (!result.ok) {
    return <DatabaseUnavailable message={result.error} />;
  }
  if (!result.data) notFound();

  const bundle = result.data;

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="flex items-center gap-2 mb-6 text-[12.5px] text-muted">
        <Link href="/bundles" className="hover:text-[color:var(--text)]">Bundles</Link>
        <span>/</span>
        <span className="text-[color:var(--text)]">{bundle.name}</span>
      </div>

      <div className="h-eyebrow mb-2">{bundle.industry}</div>
      <h1 className="h-display">{bundle.name}</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">{bundle.description}</p>
      {bundle.positioning ? (
        <p className="text-[15px] mt-3 max-w-[68ch] italic">{bundle.positioning}</p>
      ) : null}

      <div className="flex items-center gap-2 mt-6">
        <Link href="/consultation" className="btn btn-primary">Subscribe bundle</Link>
        <Chip tone="muted">{bundle.items.length} agents</Chip>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {bundle.items.map((it) => (
          <AgentCard key={it.id} a={it.agent} />
        ))}
      </div>
    </div>
  );
}
