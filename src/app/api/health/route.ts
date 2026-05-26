import { checkDbHealth } from "@/lib/dbHealth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const base = {
    status: "ok" as const,
    service: "agents-keyra",
    time: new Date().toISOString(),
  };

  if (url.searchParams.get("db") === "1") {
    const db = await checkDbHealth();
    return NextResponse.json({
      ...base,
      database: db,
      ready: db.connected && (db.agentCount ?? 0) > 0,
    });
  }

  return NextResponse.json(base);
}
