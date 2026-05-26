import Link from "next/link";
import { Chip } from "./Chip";
import { arr, securityChipClass, subscriptionTypeChipClass } from "@/lib/agent";

export type AgentCardData = {
  agent_slug: string;
  agent_name: string;
  agent_industry: string;
  agent_function: string;
  agent_type: string;
  agent_description: string;
  required_integrations: string;
  human_approval_required: boolean;
  security_classification: string;
  subscription_type: string;
  deployment_status: string;
  country_applicability: string;
};

export function AgentCard({ a, compact = false }: { a: AgentCardData; compact?: boolean }) {
  const integrations = arr(a.required_integrations);
  const countries = arr(a.country_applicability);

  return (
    <Link
      href={`/marketplace/${a.agent_slug}`}
      className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="h-card">{a.agent_name}</div>
          <div className="text-[11.5px] text-muted mt-0.5">
            {a.agent_industry} · {a.agent_function}
          </div>
        </div>
        <span className={subscriptionTypeChipClass(a.subscription_type)}>{a.subscription_type}</span>
      </div>

      {!compact ? (
        <p className="text-[13px] text-muted leading-relaxed line-clamp-3">
          {a.agent_description}
        </p>
      ) : null}

      <div className="flex flex-wrap gap-1.5">
        <Chip tone="muted">{a.agent_type}</Chip>
        <span className={securityChipClass(a.security_classification)}>
          {a.security_classification}
        </span>
        {a.human_approval_required ? <Chip tone="warning">Human approval</Chip> : null}
        <Chip>{a.deployment_status}</Chip>
      </div>

      <div className="mt-auto pt-3 border-t border-[color:var(--border)] flex items-center justify-between text-[11.5px]">
        <div className="text-muted">
          {integrations.length > 0 ? (
            <>Integrates with <span className="text-[color:var(--text)]">{integrations.slice(0, 2).join(", ")}</span>{integrations.length > 2 ? "…" : ""}</>
          ) : (
            <span className="text-muted">No integration required</span>
          )}
        </div>
        <div className="text-muted">
          {countries.includes("ALL") ? "Global" : `${countries.length} countries`}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted">View agent →</span>
        <span className="btn btn-primary text-[12px] py-1.5 px-3">Request deployment</span>
      </div>
    </Link>
  );
}
