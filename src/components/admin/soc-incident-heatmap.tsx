import { useMemo } from "react";
import { cn } from "@/lib/utils";
import type { SocIncident, SocIncidentSeverity } from "@/api/supabase/socIncidents.api";

const SEVERITY_ORDER: SocIncidentSeverity[] = ["critical", "high", "medium", "low", "info"];
const SEVERITY_TONE: Record<SocIncidentSeverity, string> = {
  critical: "bg-clinical-alert/80",
  high: "bg-error/70",
  medium: "bg-health-warning/70",
  low: "bg-primary-container",
  info: "bg-muted",
};

interface Props {
  incidents: SocIncident[];
}

export function SocIncidentHeatmap({ incidents }: Props) {
  const { grid, sources, maxCount } = useMemo(() => {
    const map = new Map<string, Map<SocIncidentSeverity, number>>();
    let max = 0;
    for (const inc of incidents) {
      if (inc.status !== "open" && inc.status !== "acknowledged") continue;
      const row = map.get(inc.source) ?? new Map<SocIncidentSeverity, number>();
      const sev = inc.severity as SocIncidentSeverity;
      const next = (row.get(sev) ?? 0) + 1;
      row.set(sev, next);
      if (next > max) max = next;
      map.set(inc.source, row);
    }
    const sortedSources = Array.from(map.keys()).sort();
    return { grid: map, sources: sortedSources, maxCount: max };
  }, [incidents]);

  if (sources.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border/60 p-6 text-center text-sm text-muted-foreground">
        No active incidents to visualise.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border/60 bg-card/60 p-3">
      <table className="min-w-full text-xs">
        <thead>
          <tr>
            <th className="px-2 py-2 text-left font-medium text-muted-foreground">Source ↓ / Severity →</th>
            {SEVERITY_ORDER.map((s) => (
              <th key={s} className="px-2 py-2 text-center font-medium capitalize text-muted-foreground">{s}</th>
            ))}
            <th className="px-2 py-2 text-right font-medium text-muted-foreground">Total</th>
          </tr>
        </thead>
        <tbody>
          {sources.map((source) => {
            const row = grid.get(source)!;
            const rowTotal = Array.from(row.values()).reduce((a, b) => a + b, 0);
            return (
              <tr key={source}>
                <td className="px-2 py-1 font-medium capitalize text-foreground">{source.replace(/-/g, " ")}</td>
                {SEVERITY_ORDER.map((s) => {
                  const count = row.get(s) ?? 0;
                  const intensity = maxCount > 0 ? count / maxCount : 0;
                  return (
                    <td key={s} className="p-0.5">
                      <div
                        className={cn(
                          "flex h-9 items-center justify-center rounded text-xs font-mono text-foreground",
                          count === 0 ? "bg-muted/30 text-muted-foreground" : SEVERITY_TONE[s],
                        )}
                        style={count > 0 ? { opacity: 0.4 + intensity * 0.6 } : undefined}
                        title={`${count} ${s} ${source} incident${count === 1 ? "" : "s"}`}
                      >
                        {count || "·"}
                      </div>
                    </td>
                  );
                })}
                <td className="px-2 py-1 text-right font-mono text-foreground">{rowTotal}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
