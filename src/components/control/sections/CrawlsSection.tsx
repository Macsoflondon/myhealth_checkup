import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { Loader2 } from "lucide-react";

interface ScrapeRow {
  id: string;
  provider: string | null;
  status: string | null;
  started_at: string | null;
  finished_at: string | null;
  rows_inserted: number | null;
  rows_updated: number | null;
  error_message: string | null;
}

export default function CrawlsSection() {
  const [rows, setRows] = useState<ScrapeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("scrape_run_log")
      .select("*")
      .order("started_at", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setRows((data ?? []) as any);
        setLoading(false);
      });
  }, []);

  const summary = rows.reduce(
    (acc, r) => {
      acc.total += 1;
      if (r.status === "failed") acc.failed += 1;
      if (r.status === "success" || r.status === "ok") acc.ok += 1;
      return acc;
    },
    { total: 0, ok: 0, failed: 0 }
  );

  return (
    <SectionShell title="Crawl & Scrape Centre" description="Last 50 scraper runs across all providers." status="live">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Runs (last 50)" value={summary.total} />
        <StatCard label="Successful" value={summary.ok} tone="good" />
        <StatCard label="Failed" value={summary.failed} tone={summary.failed > 0 ? "bad" : "good"} />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading runs…
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Provider</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-right px-3 py-2">Inserted</th>
                <th className="text-right px-3 py-2">Updated</th>
                <th className="text-left px-3 py-2">Started</th>
                <th className="text-left px-3 py-2">Error</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{r.provider ?? "—"}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-2">
                      <HealthDot state={r.status === "failed" ? "bad" : r.status ? "good" : "idle"} />
                      {r.status ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.rows_inserted ?? 0}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.rows_updated ?? 0}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                    {r.started_at ? new Date(r.started_at).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-xs text-rose-600 max-w-[280px] truncate" title={r.error_message ?? undefined}>
                    {r.error_message ?? ""}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-3 py-8 text-center text-muted-foreground text-sm">No scrape runs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
