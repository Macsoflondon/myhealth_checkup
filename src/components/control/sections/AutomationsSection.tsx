/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { Loader2 } from "lucide-react";

interface CronRow {
  id: string;
  job_name: string | null;
  status: string | null;
  started_at: string | null;
  finished_at: string | null;
  error_message: string | null;
  duration_ms: number | null;
}

export default function AutomationsSection() {
  const [rows, setRows] = useState<CronRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("cron_run_log")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(40)
      .then(({ data }) => {
        setRows((data ?? []) as any);
        setLoading(false);
      });
  }, []);

  // Aggregate latest status per job_name
  const byJob = new Map<string, CronRow>();
  for (const r of rows) {
    const key = r.job_name ?? "(unnamed)";
    if (!byJob.has(key)) byJob.set(key, r);
  }
  const jobs = Array.from(byJob.entries());
  const failedJobs = jobs.filter(([, r]) => r.status === "failed").length;

  return (
    <SectionShell title="Automation Centre" description="Cron jobs, schedulers, and background workers." status="live">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Distinct jobs" value={jobs.length} />
        <StatCard label="Recent runs" value={rows.length} />
        <StatCard label="Failed (latest run)" value={failedJobs} tone={failedJobs > 0 ? "bad" : "good"} />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading jobs…
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Job</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Last run</th>
                <th className="text-right px-3 py-2">Duration</th>
                <th className="text-left px-3 py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(([name, r]) => (
                <tr key={name} className="border-t">
                  <td className="px-3 py-2 font-medium">{name}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-2">
                      <HealthDot state={r.status === "failed" ? "bad" : r.status ? "good" : "idle"} />
                      {r.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                    {r.started_at ? new Date(r.started_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums text-xs">
                    {r.duration_ms != null ? `${r.duration_ms} ms` : "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-rose-600 max-w-[280px] truncate" title={r.error_message ?? undefined}>
                    {r.error_message ?? ""}
                  </td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-muted-foreground text-sm">
                    No cron runs recorded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
