export function arr(json: string | null | undefined): string[] {
  if (!json) return [];
  try {
    const v = JSON.parse(json);
    return Array.isArray(v) ? v.map(String) : [];
  } catch {
    return [];
  }
}

export function securityChipClass(sec: string): string {
  switch (sec) {
    case "Sovereign":   return "chip chip-sovereign";
    case "Restricted":  return "chip chip-warning";
    case "Public":      return "chip chip-positive";
    default:            return "chip chip-muted";
  }
}

export function subscriptionTypeChipClass(t: string): string {
  switch (t) {
    case "Sovereign": return "chip chip-sovereign";
    case "Regulated": return "chip chip-warning";
    case "Bespoke":   return "chip chip-inverted";
    default:          return "chip chip-muted";
  }
}
