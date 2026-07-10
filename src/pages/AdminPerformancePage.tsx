/**
 * Admin: Query & Runtime Performance (P2)
 * Aggregates edge_function_logs, web_vitals, cron_run_log to surface slow paths.
 */
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Window = "1h" | "24h" | "7d";

const WINDOW_SQL: Record<Window, string> = { "1h": "1 hour", "24h": "24 hours", "7d": "7 days" };

interface FnStat { function_name: string; count: number; p50: number; p95: number; p99: number; errors: number; }
interface VitalStat { metric: string; route: string; count: number; p75: number; poor: number; }
interface CronStat { job_name: string; runs: number; failures: number; p95: number; last_status: string; last_at: string; }

function percentile(sorted: number[], p: number): number {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

const AdminPerformancePage = () => {
  const [window, setWindow] = useState<Window>("24h");
  const [fnStats, setFnStats] = useState<FnStat[]>([]);
  const [vitalStats, setVitalStats] = useState<VitalStat[]>([]);
  const [cronStats, setCronStats] = useState<CronStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      const since = new Date(Date.now() - (window === "1h" ? 3600e3 : window === "24h" ? 86400e3 : 7 * 86400e3)).toISOString();

      const [{ data: fnLogs }, { data: vitals }, { data: cron }] = await Promise.all([
        supabase.from("edge_function_logs").select("function_name,duration_ms,status,http_status,created_at").gte("created_at", since).limit(10000),
        supabase.from("web_vitals").select("metric,route,value,rating,created_at").gte("created_at", since).limit(10000),
        supabase.from("cron_run_log").select("job_name,duration_ms,status,started_at").gte("started_at", since).limit(5000),
      ]);
      if (cancelled) return;

      // fn aggregation
      const fnMap = new Map<string, number[]>();
      const fnErr = new Map<string, number>();
      for (const r of fnLogs ?? []) {
        const arr = fnMap.get(r.function_name) ?? [];
        if (r.duration_ms != null) arr.push(r.duration_ms);
        fnMap.set(r.function_name, arr);
        if (r.status === "error" || (r.http_status && r.http_status >= 500)) {
          fnErr.set(r.function_name, (fnErr.get(r.function_name) ?? 0) + 1);
        }
      }
      const fnAgg: FnStat[] = [...fnMap.entries()].map(([name, arr]) => {
        const s = [...arr].sort((a, b) => a - b);
        return { function_name: name, count: s.length, p50: percentile(s, 50), p95: percentile(s, 95), p99: percentile(s, 99), errors: fnErr.get(name) ?? 0 };
      }).sort((a, b) => b.p95 - a.p95);

      // vitals aggregation by metric+route
      const vMap = new Map<string, { values: number[]; poor: number }>();
      for (const v of vitals ?? []) {
        const key = `${v.metric}||${v.route}`;
        const rec = vMap.get(key) ?? { values: [], poor: 0 };
        rec.values.push(v.value);
        if (v.rating === "poor") rec.poor++;
        vMap.set(key, rec);
      }
      const vAgg: VitalStat[] = [...vMap.entries()].map(([k, r]) => {
        const [metric, route] = k.split("||");
        const s = [...r.values].sort((a, b) => a - b);
        return { metric, route, count: s.length, p75: percentile(s, 75), poor: r.poor };
      }).sort((a, b) => b.poor - a.poor || b.p75 - a.p75).slice(0, 40);

      // cron aggregation
      const cMap = new Map<string, { runs: number; failures: number; durations: number[]; last: { status: string; at: string } | null }>();
      for (const c of cron ?? []) {
        const rec = cMap.get(c.job_name) ?? { runs: 0, failures: 0, durations: [], last: null };
        rec.runs++;
        if (c.status === "error") rec.failures++;
        if (c.duration_ms != null) rec.durations.push(c.duration_ms);
        if (!rec.last || c.started_at > rec.last.at) rec.last = { status: c.status, at: c.started_at };
        cMap.set(c.job_name, rec);
      }
      const cAgg: CronStat[] = [...cMap.entries()].map(([job, r]) => {
        const s = [...r.durations].sort((a, b) => a - b);
        return { job_name: job, runs: r.runs, failures: r.failures, p95: percentile(s, 95), last_status: r.last?.status ?? "-", last_at: r.last?.at ?? "" };
      }).sort((a, b) => b.failures - a.failures || b.p95 - a.p95);

      setFnStats(fnAgg);
      setVitalStats(vAgg);
      setCronStats(cAgg);
      setLoading(false);
    };
    load();
    return () => { cancelled = true; };
  }, [window]);

  const totals = useMemo(() => ({
    fnCalls: fnStats.reduce((s, r) => s + r.count, 0),
    fnErrors: fnStats.reduce((s, r) => s + r.errors, 0),
    vitals: vitalStats.reduce((s, r) => s + r.count, 0),
  }), [fnStats, vitalStats]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Runtime performance</h1>
          <p className="text-sm text-muted-foreground">Slowest edge functions, worst Web Vitals, cron durations.</p>
        </div>
        <Select value={window} onValueChange={(v) => setWindow(v as Window)}>
          <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1h</SelectItem>
            <SelectItem value="24h">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7d</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="text-sm">Edge fn calls ({WINDOW_SQL[window]})</CardTitle></CardHeader><CardContent className="text-3xl font-mono">{totals.fnCalls.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Edge fn errors</CardTitle></CardHeader><CardContent className="text-3xl font-mono text-destructive">{totals.fnErrors.toLocaleString()}</CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm">Web Vitals samples</CardTitle></CardHeader><CardContent className="text-3xl font-mono">{totals.vitals.toLocaleString()}</CardContent></Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Slowest edge functions (by p95)</CardTitle></CardHeader>
        <CardContent>
          {loading ? "Loading…" : (
            <Table>
              <TableHeader><TableRow><TableHead>Function</TableHead><TableHead className="text-right">Calls</TableHead><TableHead className="text-right">p50</TableHead><TableHead className="text-right">p95</TableHead><TableHead className="text-right">p99</TableHead><TableHead className="text-right">Errors</TableHead></TableRow></TableHeader>
              <TableBody>
                {fnStats.slice(0, 25).map((r) => (
                  <TableRow key={r.function_name}>
                    <TableCell className="font-mono text-xs">{r.function_name}</TableCell>
                    <TableCell className="text-right">{r.count}</TableCell>
                    <TableCell className="text-right">{r.p50}ms</TableCell>
                    <TableCell className="text-right"><Badge variant={r.p95 > 2000 ? "destructive" : r.p95 > 800 ? "secondary" : "outline"}>{r.p95}ms</Badge></TableCell>
                    <TableCell className="text-right">{r.p99}ms</TableCell>
                    <TableCell className="text-right">{r.errors > 0 ? <Badge variant="destructive">{r.errors}</Badge> : "0"}</TableCell>
                  </TableRow>
                ))}
                {fnStats.length === 0 && <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground">No data</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Worst Web Vitals (by poor count, p75)</CardTitle></CardHeader>
        <CardContent>
          {loading ? "Loading…" : (
            <Table>
              <TableHeader><TableRow><TableHead>Metric</TableHead><TableHead>Route</TableHead><TableHead className="text-right">Samples</TableHead><TableHead className="text-right">p75</TableHead><TableHead className="text-right">Poor</TableHead></TableRow></TableHeader>
              <TableBody>
                {vitalStats.map((r, i) => (
                  <TableRow key={i}>
                    <TableCell><Badge variant="outline">{r.metric}</Badge></TableCell>
                    <TableCell className="font-mono text-xs">{r.route}</TableCell>
                    <TableCell className="text-right">{r.count}</TableCell>
                    <TableCell className="text-right">{Math.round(r.p75)}</TableCell>
                    <TableCell className="text-right">{r.poor > 0 ? <Badge variant="destructive">{r.poor}</Badge> : "0"}</TableCell>
                  </TableRow>
                ))}
                {vitalStats.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No RUM data yet</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Cron job performance</CardTitle></CardHeader>
        <CardContent>
          {loading ? "Loading…" : (
            <Table>
              <TableHeader><TableRow><TableHead>Job</TableHead><TableHead className="text-right">Runs</TableHead><TableHead className="text-right">Failures</TableHead><TableHead className="text-right">p95</TableHead><TableHead>Last</TableHead></TableRow></TableHeader>
              <TableBody>
                {cronStats.map((r) => (
                  <TableRow key={r.job_name}>
                    <TableCell className="font-mono text-xs">{r.job_name}</TableCell>
                    <TableCell className="text-right">{r.runs}</TableCell>
                    <TableCell className="text-right">{r.failures > 0 ? <Badge variant="destructive">{r.failures}</Badge> : "0"}</TableCell>
                    <TableCell className="text-right">{r.p95}ms</TableCell>
                    <TableCell><Badge variant={r.last_status === "error" ? "destructive" : r.last_status === "success" ? "outline" : "secondary"}>{r.last_status}</Badge></TableCell>
                  </TableRow>
                ))}
                {cronStats.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">No cron runs in window</TableCell></TableRow>}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPerformancePage;
