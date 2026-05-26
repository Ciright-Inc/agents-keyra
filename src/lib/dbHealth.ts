import { prisma } from "@/lib/prisma";
import { resolveDatabaseUrl } from "@/lib/databaseUrl";

export type DbHealth = {
  configured: boolean;
  connected: boolean;
  agentCount?: number;
  error?: string;
};

export async function checkDbHealth(): Promise<DbHealth> {
  const url = resolveDatabaseUrl();
  if (!url) {
    return {
      configured: false,
      connected: false,
      error: "DATABASE_URL not set",
    };
  }

  try {
    const agentCount = await prisma.marketplaceAgent.count();
    return { configured: true, connected: true, agentCount };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Database error";
    return { configured: true, connected: false, error: message };
  }
}
