import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Chip } from "@/components/Chip";
import { arr } from "@/lib/agent";

export const dynamic = "force-dynamic";

const REGIONS: Record<string, string[]> = {
  Americas: ["US", "CA", "MX", "BR"],
  Europe: ["IE", "GB", "DE", "FR", "ES"],
  MENA: ["AE", "SA", "QA"],
  APAC: ["IN", "SG", "JP", "AU"],
  Africa: ["ZA", "NG", "KE"],
};

const COUNTRY_NAMES: Record<string, string> = {
  US: "United States", CA: "Canada", MX: "Mexico", BR: "Brazil",
  IE: "Ireland", GB: "United Kingdom", DE: "Germany", FR: "France", ES: "Spain",
  AE: "United Arab Emirates", SA: "Saudi Arabia", QA: "Qatar",
  IN: "India", SG: "Singapore", JP: "Japan", AU: "Australia",
  ZA: "South Africa", NG: "Nigeria", KE: "Kenya",
};

/**
 * Convert a 2-letter ISO country code to its flag emoji using regional
 * indicator symbols. Returns "" for non-ISO-2 inputs (e.g. "ALL").
 */
function isoToFlag(iso: string | null | undefined): string {
  if (!iso || iso.length !== 2) return "";
  const upper = iso.toUpperCase();
  const a = upper.charCodeAt(0);
  const b = upper.charCodeAt(1);
  if (a < 65 || a > 90 || b < 65 || b > 90) return "";
  return String.fromCodePoint(0x1f1e6 + a - 65, 0x1f1e6 + b - 65);
}

export default async function CountriesPage() {
  const agents = await prisma.marketplaceAgent.findMany();

  const universal = agents.filter((a) => arr(a.country_applicability).includes("ALL")).length;

  return (
    <div className="max-w-[1320px] mx-auto px-6 py-12">
      <div className="h-eyebrow mb-2">Countries</div>
      <h1 className="h-display">Global with sovereign-grade controls</h1>
      <p className="text-[15px] text-muted mt-3 max-w-[68ch]">
        Country applicability scopes which jurisdictions an agent may be
        deployed into. Sovereign agents require ministry-level approval and
        country-resident infrastructure.
      </p>

      <div className="card p-6 mt-8 flex items-center justify-between">
        <div>
          <div className="h-eyebrow mb-1">Globally applicable</div>
          <div className="text-[28px] font-semibold tabular-nums">{universal}</div>
          <div className="text-[12.5px] text-muted">Agents available in every supported country.</div>
        </div>
        <Chip tone="sovereign">ALL</Chip>
      </div>

      <div className="mt-10 space-y-8">
        {Object.entries(REGIONS).map(([region, isoCodes]) => (
          <section key={region}>
            <div className="h-eyebrow mb-3">{region}</div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2.5">
              {isoCodes.map((iso) => {
                const flag = isoToFlag(iso);
                return (
                  <Link
                    key={iso}
                    href={`/marketplace?country=${iso}`}
                    className="card country-card"
                  >
                    <span
                      className="country-card__flag"
                      role={flag ? "img" : undefined}
                      aria-label={flag ? `Flag of ${COUNTRY_NAMES[iso] ?? iso}` : undefined}
                      aria-hidden={flag ? undefined : true}
                    >
                      {flag || iso}
                    </span>
                    <div className="country-card__meta">
                      <div className="country-card__name">{COUNTRY_NAMES[iso] ?? iso}</div>
                      <div className="country-card__iso mono">{iso}</div>
                    </div>
                    <span className="country-card__cta" aria-hidden>
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
