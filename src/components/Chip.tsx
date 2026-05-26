import type { ReactNode } from "react";

export function Chip({
  children,
  tone = "default",
  className = "",
}: {
  children: ReactNode;
  tone?: "default" | "muted" | "positive" | "warning" | "critical" | "sovereign" | "inverted";
  className?: string;
}) {
  const toneClass =
    tone === "muted" ? "chip-muted"
    : tone === "positive" ? "chip-positive"
    : tone === "warning" ? "chip-warning"
    : tone === "critical" ? "chip-critical"
    : tone === "sovereign" ? "chip-sovereign"
    : tone === "inverted" ? "chip-inverted"
    : "";
  return <span className={`chip ${toneClass} ${className}`}>{children}</span>;
}
