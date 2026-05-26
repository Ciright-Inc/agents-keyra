import { prisma } from "@/lib/prisma";
import type { Bundle, MarketplaceAgent } from "@prisma/client";
import { safeDbQuery, type DbResult } from "@/lib/safePrisma";

export type MarketplaceHomeData = {
  featured: MarketplaceAgent[];
  bundles: (Bundle & { items: { id: string }[] })[];
  industries: { agent_industry: string; _count: { agent_industry: number } }[];
  agentCount: number;
  sovereignCount: number;
};

export async function loadMarketplaceHomeData(): Promise<DbResult<MarketplaceHomeData>> {
  return safeDbQuery(async () => {
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
    return { featured, bundles, industries, agentCount, sovereignCount };
  });
}
