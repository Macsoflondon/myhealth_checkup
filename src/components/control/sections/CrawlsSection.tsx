import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { Loader2, Play, RefreshCw, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { edgeInvoke } from "@/lib/edgeInvoke";

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

const PROVIDERS: { id: string; label: string }[] = [
  { id: "lola-health", label: "Lola Health" },
  { id: "medichecks", label: "Medichecks" },
  { id: "goodbody-clinic", label: "Goodbody Clinic" },
  { id: "thriva", label: "Thriva" },
  { id: "randox", label: "Randox" },
  { id: "london-medical-laboratory", label: "London Medical Laboratory" },
  { id: "clinilabs", label: "Clinilabs" },
  { id: "medical-diagnosis", label: "Medical Diagnosis" },
  { id: "london-health-company", label: "London Health Company" },
];

interface ProviderTestStat {
  provider_id: string;
  count: number;
  lastUpdated: string | null;
}

export default function CrawlsSection() {
  const [rows, setRows] = useState<ScrapeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningAll, setRunningAll] = useState(false);
  const [runningProvider, setRunningProvider] = useState<string | null>(null);
  const [runningJob, setRunningJob] = useState<string | null>(null);
  const [stats, setStats] = useState<Record<string, ProviderTestStat>>({});

  const load = useCallback(async () => {
    const [{ data: runs }, { data: tests }] = await Promise.all([
      supabase
        .from("scrape_run_log")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(50),
      supabase
        .from("provider_tests")
        .select("provider_id, updated_at")
        .eq("is_active", true)
        .limit(5000),
    ]);
    setRows((runs ?? []) as never);
    const grouped: Record<string, ProviderTestStat> = {};
    for (const t of (tests ?? []) as { provider_id: string; updated_at: string }[]) {
      const s = grouped[t.provider_id] ?? { provider_id: t.provider_id, count: 0, lastUpdated: null };
      s.count += 1;
      if (!s.lastUpdated || t.updated_at > s.lastUpdated) s.lastUpdated = t.updated_at;
      grouped[t.provider_id] = s;
    }
    setStats(grouped);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
    const channel = supabase
      .channel("control-crawls")
      .on("postgres_changes", { event: "*", schema: "public", table: "scrape_run_log" }, () => void load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const summary = useMemo(() => {
    return rows.reduce(
      (acc, r) => {
        acc.total += 1;
        if (r.status === "failed" || r.status === "error") acc.failed += 1;
        else if (["success", "ok", "completed"].includes(r.status)) acc.ok += 1;
        acc.verificationFailures += r.verification_failures ?? 0;
        return acc;
      },
      { total: 0, ok: 0, failed: 0, verificationFailures: 0 },
    );
  }, [rows]);

  const trigger = async (label: string, fn: () => Promise<unknown>) => {
    try {
      const result = (await fn()) as { message?: string };
      toast.success(`${label} dispatched`, { description: result?.message });
      await load();
    } catch (err) {
      toast.error(`${label} failed`, { description: err instanceof Error ? err.message : String(err) });
    }
  };

  return (
    <SectionShell
      title="Crawl & Scrape Centre"
      description="Trigger scrapers, watch live runs, and verify catalogue freshness."
      status="live"
      actions={
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setRunningJob("verify");
              void trigger("URL verification", () => edgeInvoke("scrape-and-verify")).finally(() =>
                setRunningJob(null),
              );
            }}
            disabled={runningJob === "verify"}
            variant="outline"
            size="sm"
          >
            {runningJob === "verify" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
            Verify URLs
          </Button>
          <Button
            onClick={() => {
              setRunningJob("promote");
              void trigger("Promotion", () => edgeInvoke("promote-provider-tests")).finally(() =>
                setRunningJob(null),
              );
            }}
            disabled={runningJob === "promote"}
            variant="outline"
            size="sm"
          >
            {runningJob === "promote" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Re-promote
          </Button>
          <Button
            onClick={() => {
              setRunningAll(true);
              void trigger("All scrapers", () => edgeInvoke("run-all-scrapers")).finally(() => setRunningAll(false));
            }}
            disabled={runningAll}
            size="sm"
          >
            {runningAll ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}
            Run all scrapers
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Runs (last 50)" value={summary.total} />
        <StatCard label="Successful" value={summary.ok} tone="good" />
        <StatCard label="Failed" value={summary.failed} tone={summary.failed > 0 ? "bad" : "good"} />
        <StatCard label="URL verify fails" value={summary.verificationFailures} tone={summary.verificationFailures > 0 ? "warn" : "good"} />
      </div>

      {/* Per-provider grid */}
      <div className="rounded-xl border bg-card overflow-hidden mb-6">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-sm font-semibold">Per-provider scrapers</h3>
          <span className="text-xs text-muted-foreground">{PROVIDERS.length} sources</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left px-3 py-2">Provider</th>
              <th className="text-right px-3 py-2">Active tests</th>
              <th className="text-left px-3 py-2">Last data update</th>
              <th className="text-right px-3 py-2">Run</th>
            </tr>
          </thead>
          <tbody>
            {PROVIDERS.map((p) => {
              const s = stats[p.id];
              const isRunning = runningProvider === p.id;
              return (
                <tr key={p.id} className="border-t">
                  <td className="px-3 py-2 font-medium">{p.label}</td>
                  <td className="px-3 py-2 text-right tabular-nums">{s?.count ?? 0}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">
                    {s?.lastUpdated ? new Date(s.lastUpdated).toLocaleString() : "—"}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isRunning || runningAll}
                      onClick={() => {
                        setRunningProvider(p.id);
                        void trigger(p.label, () => edgeInvoke("run-all-scrapers", { providerId: p.id })).finally(() =>
                          setRunningProvider(null),
                        );
                      }}
                    >
                      {isRunning ? <Loader2 className="w-3 h-3 mr-1 animate-spin" /> : <Play className="w-3 h-3 mr-1" />}
                      Run
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Run history */}
      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading runs…
        </div>
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 border-b">
            <h3 className="text-sm font-semibold">Recent runs</h3>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
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
                  <td colSpan={8} className="px-3 py-8 text-center text-muted-foreground text-sm">
                    No scrape runs recorded yet — hit "Run all scrapers" to kick one off.
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
