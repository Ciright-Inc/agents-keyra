import { redirect } from "next/navigation";

type Search = { next?: string };

function safeNext(raw: string | undefined): string {
  const n = raw?.trim() || "/portal";
  return n.startsWith("/") && !n.startsWith("/login") ? n : "/portal";
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const nextPath = safeNext(sp.next);
  redirect(`/api/keyra/session/continue?next=${encodeURIComponent(nextPath)}`);
}

