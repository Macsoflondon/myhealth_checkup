/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { Loader2 } from "lucide-react";

interface OverviewData {
  providers: number;
  tests: number;
  mappings: number;
  recentScrapes: number;
  failedScrapes: number;
  openAlerts: number;
  lastScrapeAt: string | null;
}

export default function OverviewSection() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
        const db = supabase as any;
        const providersRes = await db.from("provider_tests").select("provider_name", { count: "exact", head: true });
        const testsRes = await db.from("tests_master").select("id", { count: "exact", head: true });
        const mapRes = await db.from("provider_test_mapping").select("id", { count: "exact", head: true });
        const scrapesRes = await db.from("scrape_run_log").select("id", { count: "exact", head: true }).gte("started_at", since);
        const failedRes = await db.from("scrape_run_log").select("id", { count: "exact", head: true }).gte("started_at", since).eq("status", "failed");
        const alertsRes = await db.from("scraper_alerts").select("id", { count: "exact", head: true }).eq("acknowledged", false);
        const lastScrapeRes = await db.from("scrape_run_log").select("started_at").order("started_at", { ascending: false }).limit(1).maybeSingle();
        if (cancelled) return;
        setData({
          providers: providersRes.count ?? 0,
          tests: testsRes.count ?? 0,
          mappings: mapRes.count ?? 0,
          recentScrapes: scrapesRes.count ?? 0,
          failedScrapes: failedRes.count ?? 0,
          openAlerts: alertsRes.count ?? 0,
          lastScrapeAt: lastScrapeRes.data?.started_at ?? null,
        });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const healthScore = (() => {
    if (!data) return null;
    let score = 100;
    if (data.failedScrapes > 0) score -= Math.min(30, data.failedScrapes * 5);
    if (data.openAlerts > 0) score -= Math.min(30, data.openAlerts * 4);
    if (data.recentScrapes === 0) score -= 10;
    return Math.max(0, score);
  })();

  const healthState = healthScore == null ? "idle" : healthScore >= 85 ? "good" : healthScore >= 60 ? "warn" : "bad";

  return (
    <SectionShell
      title="Executive Overview"
      description="Snapshot of platform health across data, scrapers, and alerts."
      status="live"
    >
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading metrics…
        </div>
      ) : (
        <>
          <div className="rounded-2xl border bg-card p-6 flex items-center justify-between mb-6">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Platform Health Score</div>
              <div className="mt-1 flex items-center gap-3">
                <HealthDot state={healthState as any} />
                <span className="text-4xl font-semibold tabular-nums">{healthScore}<span className="text-xl text-muted-foreground">/100</span></span>
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div>Last scrape</div>
              <div className="mt-1 text-foreground tabular-nums">
                {data?.lastScrapeAt ? new Date(data.lastScrapeAt).toLocaleString() : "—"}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard label="Providers" value={data?.providers ?? 0} />
            <StatCard label="Tests (master)" value={data?.tests ?? 0} />
            <StatCard label="Provider mappings" value={data?.mappings ?? 0} />
            <StatCard label="Scrapes (24h)" value={data?.recentScrapes ?? 0} />
            <StatCard label="Failed scrapes (24h)" value={data?.failedScrapes ?? 0} tone={data && data.failedScrapes > 0 ? "bad" : "good"} />
            <StatCard label="Open alerts" value={data?.openAlerts ?? 0} tone={data && data.openAlerts > 0 ? "warn" : "good"} />
          </div>
        </>
      )}
    </SectionShell>
  );
}
