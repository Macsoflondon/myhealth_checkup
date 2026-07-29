import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { getProviderMeta } from "@/constants/providerMeta";
import { Loader2 } from "lucide-react";

interface ProviderRow {
  providerId: string;
  provider_name: string;
  tests: number;
  lastScrapeStatus: string | null;
  lastScrapeAt: string | null;
}

export default function ProvidersSection() {
  const [rows, setRows] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      // provider_tests keys on provider_id (there is no provider_name column);
      // scrape outcomes live in scraping_jobs.
      const [{ data: tests }, { data: jobs }] = await Promise.all([
        supabase.from("provider_tests").select("provider_id").eq("is_active", true).limit(10000),
        supabase.from("scraping_jobs").select("provider_id, status, last_scraped"),
      ]);

      const counts = new Map<string, number>();
      for (const t of (tests ?? []) as { provider_id: string | null }[]) {
        const k = t.provider_id ?? "(unknown)";
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }

      const jobByProvider = new Map<string, { status: string | null; last_scraped: string | null }>();
      for (const j of (jobs ?? []) as { provider_id: string; status: string | null; last_scraped: string | null }[]) {
        const existing = jobByProvider.get(j.provider_id);
        if (!existing || (j.last_scraped ?? "") > (existing.last_scraped ?? "")) {
          jobByProvider.set(j.provider_id, { status: j.status, last_scraped: j.last_scraped });
        }
      }

      const merged: ProviderRow[] = Array.from(counts.entries()).map(([providerId, tests]) => {
        const job = jobByProvider.get(providerId);
        return {
          providerId,
          provider_name: getProviderMeta(providerId).displayName,
          tests,
          lastScrapeStatus: job?.status ?? null,
          lastScrapeAt: job?.last_scraped ?? null,
        };
      });
      merged.sort((a, b) => b.tests - a.tests);
      if (cancelled) return;
      setRows(merged);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);


  return (
    <SectionShell title="Provider Monitoring" description="Per-provider catalog size and most recent scrape outcome." status="live">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Providers tracked" value={rows.length} />
        <StatCard label="Total tests indexed" value={rows.reduce((s, r) => s + r.tests, 0)} />
        <StatCard label="Failing scrapers" value={rows.filter((r) => r.lastScrapeStatus === "failed").length} tone="warn" />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading providers…
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-3 py-2">Provider</th>
                <th className="text-right px-3 py-2">Tests</th>
                <th className="text-left px-3 py-2">Last scrape</th>
                <th className="text-left px-3 py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.provider_name} className="border-t">
                  <td className="px-3 py-2 font-medium">{r.provider_name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{r.tests}</td>
                  <td className="px-3 py-2">
                    <span className="inline-flex items-center gap-2">
                      <HealthDot state={r.lastScrapeStatus === "failed" ? "bad" : r.lastScrapeStatus ? "good" : "idle"} />
                      {r.lastScrapeStatus ?? "—"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                    {r.lastScrapeAt ? new Date(r.lastScrapeAt).toLocaleString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionShell>
  );
}
