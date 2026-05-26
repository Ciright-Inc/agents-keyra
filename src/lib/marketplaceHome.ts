import { prisma } from "@/lib/prisma";
import type { Bundle, MarketplaceAgent } from "@prisma/client";

export type MarketplaceHomeData = {
  ok: true;
  featured: MarketplaceAgent[];
  bundles: (Bundle & { items: { id: string }[] })[];
  industries: { agent_industry: string; _count: { agent_industry: number } }[];
  agentCount: number;
  sovereignCount: number;
};

export type MarketplaceHomeError = {
  ok: false;
  error: string;
};

export async function loadMarketplaceHomeData(): Promise<
  MarketplaceHomeData | MarketplaceHomeError
> {
  if (!process.env.DATABASE_URL?.trim()) {
    return {
      ok: false,
      error: "DATABASE_URL is not set on this service. Link the Railway Postgres plugin.",
    };
  }

  try {
    const [featured, bundles, industries, agentCount, sovereignCount] = await Promise.all([
      prisma.marketplaceAgent.findMany({
        where: { deployment_status: "Published" },
        orderBy: { agent_name: "asc" },
        take: 6,
      }),
      prisma.bundle.findMany({
        where: { highlight: true },
        include: { items: { select: { id: true } } },
        take: 3,
      }),
      prisma.marketplaceAgent.groupBy({
        by: ["agent_industry"],
        _count: { agent_industry: true },
      }),
      prisma.marketplaceAgent.count(),
      prisma.marketplaceAgent.count({ where: { security_classification: "Sovereign" } }),
    ]);

    return { ok: true, featured, bundles, industries, agentCount, sovereignCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database unavailable";
    console.error("[marketplace-home]", message);
    return {
      ok: false,
      error: message.includes("does not exist")
        ? "Database tables are missing. Redeploy after linking Postgres, or check Railway logs for deploy:db."
        : message,
    };
  }
}
