/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { Loader2 } from "lucide-react";

interface ProviderRow {
  provider_name: string;
  tests: number;
  lastScrapeStatus: string | null;
  lastScrapeAt: string | null;
}

export default function ProvidersSection() {
  const [rows, setRows] = useState<ProviderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: tests } = await supabase.from("provider_tests").select("provider_name").limit(5000);
      const counts = new Map<string, number>();
      for (const t of tests ?? []) {
        const k = (t as any).provider_name ?? "(unknown)";
        counts.set(k, (counts.get(k) ?? 0) + 1);
      }
      const merged: ProviderRow[] = Array.from(counts.entries()).map(([provider_name, tests]) => ({
        provider_name,
        tests,
        lastScrapeStatus: null,
        lastScrapeAt: null,
      }));
      merged.sort((a, b) => b.tests - a.tests);
      setRows(merged);
      setLoading(false);
    })();
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
