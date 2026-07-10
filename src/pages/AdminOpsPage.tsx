import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { Activity, AlertTriangle, CheckCircle2, Clock, RefreshCw, Zap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatSocDateTime } from "@/lib/socWatchUtils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HOURS = 24;

interface CronSummary {
  job_name: string;
  runs: number;
  errors: number;
  last_status: string;
  last_started: string;
  avg_ms: number;
}
interface EdgeSummary {
  function_name: string;
  calls: number;
  errors: number;
  p95_ms: number | null;
  last_error: string | null;
  last_called: string;
}

function successRate(runs: number, errors: number): string {
  if (runs === 0) return "—";
  return `${(((runs - errors) / runs) * 100).toFixed(1)}%`;
}

export default function AdminOpsPage() {
  const since = new Date(Date.now() - HOURS * 60 * 60 * 1000).toISOString();

  const cronQuery = useQuery({
    queryKey: ["ops-cron", since],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cron_run_log")
        .select("job_name, status, started_at, duration_ms, error_message")
        .gte("started_at", since)
        .order("started_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      const map = new Map<string, CronSummary>();
      for (const r of data ?? []) {
        const s = map.get(r.job_name) ?? { job_name: r.job_name, runs: 0, errors: 0, last_status: r.status, last_started: r.started_at, avg_ms: 0 };
        s.runs++;
        if (r.status === "error") s.errors++;
        s.avg_ms = s.avg_ms + ((r.duration_ms ?? 0) - s.avg_ms) / s.runs;
        map.set(r.job_name, s);
      }
      return Array.from(map.values()).sort((a, b) => b.errors - a.errors || b.runs - a.runs);
    },
    refetchInterval: 60_000,
  });

  const edgeQuery = useQuery({
    queryKey: ["ops-edge", since],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("edge_function_logs")
        .select("function_name, status, duration_ms, error_message, created_at, http_status")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (error) throw error;
      const map = new Map<string, { calls: number; errors: number; durations: number[]; last_error: string | null; last_called: string }>();
      for (const r of data ?? []) {
        const s = map.get(r.function_name) ?? { calls: 0, errors: 0, durations: [], last_error: null, last_called: r.created_at };
        s.calls++;
        if (r.status === "error" || (r.http_status ?? 0) >= 500) {
          s.errors++;
          if (!s.last_error) s.last_error = r.error_message ?? `HTTP ${r.http_status}`;
        }
        if (r.duration_ms != null) s.durations.push(r.duration_ms);
        map.set(r.function_name, s);
      }
      const summaries: EdgeSummary[] = Array.from(map.entries()).map(([fn, s]) => {
        s.durations.sort((a, b) => a - b);
        const p95 = s.durations.length ? s.durations[Math.min(s.durations.length - 1, Math.floor(s.durations.length * 0.95))] : null;
        return {
          function_name: fn, calls: s.calls, errors: s.errors, p95_ms: p95,
          last_error: s.last_error, last_called: s.last_called,
        };
      });
      return summaries.sort((a, b) => b.errors - a.errors || b.calls - a.calls);
    },
    refetchInterval: 60_000,
  });

  return (
    <>
      <Helmet>
        <title>Ops dashboard — myhealth checkup</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold text-foreground">
              <Activity className="h-6 w-6 text-primary" />Operations dashboard
            </h1>
            <p className="text-sm text-muted-foreground">Cron jobs and edge functions over the last {HOURS} hours.</p>
          </div>
          <Button variant="outline" onClick={() => { void cronQuery.refetch(); void edgeQuery.refetch(); }}>
            <RefreshCw className="mr-2 h-4 w-4" />Refresh
          </Button>
        </header>

        <Tabs defaultValue="cron">
          <TabsList>
            <TabsTrigger value="cron"><Clock className="mr-1 h-3 w-3" />Cron jobs</TabsTrigger>
            <TabsTrigger value="edge"><Zap className="mr-1 h-3 w-3" />Edge functions</TabsTrigger>
          </TabsList>

          <TabsContent value="cron" className="mt-4">
            <Card variant="outlined" className="p-4">
              {cronQuery.isLoading ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job</TableHead>
                      <TableHead className="text-right">Runs</TableHead>
                      <TableHead className="text-right">Errors</TableHead>
                      <TableHead className="text-right">Success</TableHead>
                      <TableHead className="text-right">Avg ms</TableHead>
                      <TableHead>Last status</TableHead>
                      <TableHead>Last run</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(cronQuery.data ?? []).map((r) => (
                      <TableRow key={r.job_name}>
                        <TableCell className="font-mono text-xs">{r.job_name}</TableCell>
                        <TableCell className="text-right font-mono">{r.runs}</TableCell>
                        <TableCell className="text-right font-mono">
                          {r.errors > 0 ? <Badge className="bg-error text-error-foreground">{r.errors}</Badge> : <span className="text-muted-foreground">0</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono">{successRate(r.runs, r.errors)}</TableCell>
                        <TableCell className="text-right font-mono">{Math.round(r.avg_ms)}</TableCell>
                        <TableCell>
                          {r.last_status === "error" ? <AlertTriangle className="inline h-4 w-4 text-error" /> : <CheckCircle2 className="inline h-4 w-4 text-primary" />}
                          <span className="ml-1 capitalize">{r.last_status}</span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{formatSocDateTime(r.last_started)}</TableCell>
                      </TableRow>
                    ))}
                    {(cronQuery.data ?? []).length === 0 && (
                      <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No cron runs in this window.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>

          <TabsContent value="edge" className="mt-4">
            <Card variant="outlined" className="p-4">
              {edgeQuery.isLoading ? (
                <div className="space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Function</TableHead>
                      <TableHead className="text-right">Calls</TableHead>
                      <TableHead className="text-right">Errors</TableHead>
                      <TableHead className="text-right">Success</TableHead>
                      <TableHead className="text-right">p95 ms</TableHead>
                      <TableHead>Last error</TableHead>
                      <TableHead>Last called</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {(edgeQuery.data ?? []).map((r) => (
                      <TableRow key={r.function_name}>
                        <TableCell className="font-mono text-xs">{r.function_name}</TableCell>
                        <TableCell className="text-right font-mono">{r.calls}</TableCell>
                        <TableCell className="text-right font-mono">
                          {r.errors > 0 ? <Badge className="bg-error text-error-foreground">{r.errors}</Badge> : <span className="text-muted-foreground">0</span>}
                        </TableCell>
                        <TableCell className="text-right font-mono">{successRate(r.calls, r.errors)}</TableCell>
                        <TableCell className="text-right font-mono">{r.p95_ms ?? "—"}</TableCell>
                        <TableCell className="max-w-xs truncate text-xs text-muted-foreground" title={r.last_error ?? ""}>{r.last_error ?? "—"}</TableCell>
                        <TableCell className="text-muted-foreground">{formatSocDateTime(r.last_called)}</TableCell>
                      </TableRow>
                    ))}
                    {(edgeQuery.data ?? []).length === 0 && (
                      <TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No edge function calls in this window.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
