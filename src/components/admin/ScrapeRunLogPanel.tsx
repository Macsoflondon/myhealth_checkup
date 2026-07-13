/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, XCircle, AlertTriangle, ArrowDown, ArrowUp, Minus, ExternalLink } from "lucide-react";

interface ScrapeRun {
  id: string;
  status: string;
  trigger_source: string | null;
  started_at: string;
  completed_at: string | null;
  providers_run: number | null;
  tests_scraped: number | null;
  tests_promoted: number | null;
  mappings_upserted: number | null;
  verification_failures: number | null;
  details: any | null;
}

const PROJECT_REF = "clvuioagsgfadynuvodj";

export const ScrapeRunLogPanel = () => {
  const [runs, setRuns] = useState<ScrapeRun[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("scrape_run_log")
        .select("*")
        .order("started_at", { ascending: false })
        .limit(10);
      setRuns((data as ScrapeRun[]) ?? []);
      setLoading(false);
    })();
  }, []);

  const statusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (status === "failed") return <XCircle className="h-4 w-4 text-red-600" />;
    if (status === "running") return <Clock className="h-4 w-4 text-amber-600 animate-pulse" />;
    return <AlertTriangle className="h-4 w-4 text-muted-foreground" />;
  };

  const diff = (cur: number | null, prev: number | null) => {
    const c = cur ?? 0;
    const p = prev ?? 0;
    const d = c - p;
    if (d === 0) return <span className="inline-flex items-center text-muted-foreground"><Minus className="h-3 w-3" /></span>;
    if (d > 0) return <span className="inline-flex items-center text-green-600"><ArrowUp className="h-3 w-3" />{d}</span>;
    return <span className="inline-flex items-center text-red-600"><ArrowDown className="h-3 w-3" />{Math.abs(d)}</span>;
  };

  const extractFailureReasons = (r: ScrapeRun): string[] => {
    const reasons: string[] = [];
    const d = r.details;
    if (!d) return reasons;
    if (d.scrapers?.status && d.scrapers.status >= 300) reasons.push(`scrapers HTTP ${d.scrapers.status}`);
    if (d.promote?.error) reasons.push(`promote: ${d.promote.error}`);
    if (Array.isArray(d.promote?.failures)) {
      for (const f of d.promote.failures.slice(0, 3)) reasons.push(`promote: ${f.reason ?? JSON.stringify(f)}`);
    }
    if (Array.isArray(d.verification?.failures)) {
      for (const f of d.verification.failures.slice(0, 3)) reasons.push(`verify: ${f.url ?? f.reason ?? "fail"}`);
    }
    return reasons;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Automated Scrape Runs
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Twice-daily scrape, promote and verify pipeline. Cron: 06:00 &amp; 18:00 UTC. Diff arrows compare each run to the
          previous one.
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {runs.map((r, idx) => {
              const prev = runs[idx + 1];
              const reasons = extractFailureReasons(r);
              return (
                <div
                  key={r.id}
                  className="rounded-md border border-border bg-background p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {statusIcon(r.status)}
                      <div>
                        <div className="font-medium">
                          {new Date(r.started_at).toLocaleString("en-GB")}
                        </div>
                        <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
                          <span>{r.trigger_source ?? "manual"}</span>
                          <span>{r.providers_run ?? 0} providers</span>
                          <span className="inline-flex items-center gap-1">
                            scraped {r.tests_scraped ?? 0} {prev && diff(r.tests_scraped, prev.tests_scraped)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            promoted {r.tests_promoted ?? 0} {prev && diff(r.tests_promoted, prev.tests_promoted)}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            mapped {r.mappings_upserted ?? 0} {prev && diff(r.mappings_upserted, prev.mappings_upserted)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(r.verification_failures ?? 0) > 0 && (
                        <Badge variant="destructive">{r.verification_failures} fail</Badge>
                      )}
                      <Badge variant={r.status === "completed" ? "default" : "secondary"}>
                        {r.status}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="ghost">Details</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Run {r.id.slice(0, 8)} · {r.status}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3 text-sm">
                            <div>
                              <strong>Started:</strong> {new Date(r.started_at).toLocaleString("en-GB")}
                              {r.completed_at && <> · <strong>Completed:</strong> {new Date(r.completed_at).toLocaleString("en-GB")}</>}
                            </div>
                            {reasons.length > 0 && (
                              <div>
                                <strong>Failure reasons:</strong>
                                <ul className="ml-4 list-disc">
                                  {reasons.map((x, i) => <li key={i}>{x}</li>)}
                                </ul>
                              </div>
                            )}
                            <details>
                              <summary className="cursor-pointer text-muted-foreground">Raw details JSON</summary>
                              <pre className="mt-2 max-h-96 overflow-auto rounded bg-muted p-2 text-xs">
                                {JSON.stringify(r.details, null, 2)}
                              </pre>
                            </details>
                            <div className="flex gap-2 pt-2">
                              <a
                                href={`https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new?content=${encodeURIComponent(
                                  `select * from scrape_run_log where id = '${r.id}';`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                              >
                                Open run in SQL editor <ExternalLink className="h-3 w-3" />
                              </a>
                              <a
                                href={`https://supabase.com/dashboard/project/${PROJECT_REF}/functions/scrape-and-verify/logs`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary inline-flex items-center gap-1 hover:underline"
                              >
                                Edge function logs <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  {reasons.length > 0 && (
                    <div className="mt-2 rounded bg-destructive/10 p-2 text-xs text-destructive">
                      {reasons.slice(0, 2).join(" · ")}
                      {reasons.length > 2 && ` · +${reasons.length - 2} more`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
