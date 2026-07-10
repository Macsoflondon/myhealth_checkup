export type Severity = "low" | "medium" | "high" | "critical";

export const severityRank: Record<Severity, number> = { low: 0, medium: 1, high: 2, critical: 3 };

export function classifySeverity(row: {
  status: string;
  stage: string;
  skill: string;
  message?: string | null;
}): Severity {
  const status = (row.status || "").toLowerCase();
  const stage = (row.stage || "").toUpperCase();
  const msg = (row.message || "").toLowerCase();

  if (status === "fail" || status === "error") {
    if (
      stage === "COMMIT" ||
      stage === "APPLY" ||
      msg.includes("permission") ||
      msg.includes("denied") ||
      msg.includes("unauthori") ||
      msg.includes("security")
    ) {
      return "critical";
    }
    return "high";
  }
  if (status === "warn" || status === "warning" || status === "skipped" || status === "blocked") return "medium";
  if (status === "ok" || status === "success" || status === "info") return "low";
  return "medium";
}

export const severityStyles: Record<Severity, string> = {
  low: "bg-muted text-muted-foreground border-transparent",
  medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  high: "bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/40",
  critical: "bg-destructive/15 text-destructive border-destructive/40",
};
