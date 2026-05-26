import Link from "next/link";

export function DatabaseUnavailable({ message }: { message: string }) {
  return (
    <div className="max-w-[720px] mx-auto px-6 py-16">
      <p className="h-eyebrow text-[color:var(--warning)] mb-3">Marketplace data unavailable</p>
      <h1 className="h-section">Database not ready</h1>
      <p className="text-[15px] text-muted mt-4 leading-relaxed">{message}</p>
      <p className="text-[14px] text-muted mt-3">
        On Railway: set{" "}
        <code className="mono text-[13px]">DATABASE_URL=&#123;&#123; Postgres.DATABASE_URL &#125;&#125;</code>{" "}
        on the web service, then redeploy. Check{" "}
        <a href="/api/health?db=1" className="underline">
          /api/health?db=1
        </a>{" "}
        for status.
      </p>
      <div className="flex flex-wrap gap-3 mt-8">
        <Link href="/use-cases" className="btn btn-primary">
          Browse use cases
        </Link>
        <Link href="/security" className="btn">
          Security model
        </Link>
      </div>
    </div>
  );
}
