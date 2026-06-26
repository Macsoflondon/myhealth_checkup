import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { Loader2 } from "lucide-react";

interface ScrapeRow {
  id: string;
  status: string;
  started_at: string;
  completed_at: string | null;
  providers_run: number | null;
  tests_scraped: number | null;
  tests_promoted: number | null;
  mappings_upserted: number | null;
  verification_failures: number | null;
  trigger_source: string | null;
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
      if (r.status === "failed" || r.status === "error") acc.failed += 1;
      else if (r.status === "success" || r.status === "ok" || r.status === "completed") acc.ok += 1;
      acc.testsScraped += r.tests_scraped ?? 0;
      acc.verificationFailures += r.verification_failures ?? 0;
      return acc;
    },
    { total: 0, ok: 0, failed: 0, testsScraped: 0, verificationFailures: 0 }
  );

  return (
    <SectionShell title="Crawl & Scrape Centre" description="Orchestrator run history (last 50 runs)." status="live">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Runs (last 50)" value={summary.total} />
        <StatCard label="Successful" value={summary.ok} tone="good" />
        <StatCard label="Failed" value={summary.failed} tone={summary.failed > 0 ? "bad" : "good"} />
        <StatCard label="Verification failures" value={summary.verificationFailures} tone={summary.verificationFailures > 0 ? "warn" : "good"} />
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
                <th className="text-left px-3 py-2">Started</th>
                <th className="text-left px-3 py-2">Status</th>
                <th className="text-left px-3 py-2">Trigger</th>
                <th className="text-right px-3 py-2">Providers</th>
                <th className="text-right px-3 py-2">Scraped</th>
                <th className="text-right px-3 py-2">Promoted</th>
                <th className="text-right px-3 py-2">Mappings</th>
                <th className="text-right px-3 py-2">Verify fails</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-t">
                  <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                    {new Date(r.started_at).toLocaleString()}
                  </td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-2">
                      <HealthDot state={r.status === "failed" || r.status === "error" ? "bad" : "good"} />
                      {r.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs">{r.trigger_source ?? "—"}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.providers_run ?? 0}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.tests_scraped ?? 0}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.tests_promoted ?? 0}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.mappings_upserted ?? 0}</td>
                  <td className={`px-3 py-2 text-right tabular-nums ${(r.verification_failures ?? 0) > 0 ? "text-rose-600" : ""}`}>
                    {r.verification_failures ?? 0}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground text-sm">No scrape runs recorded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
