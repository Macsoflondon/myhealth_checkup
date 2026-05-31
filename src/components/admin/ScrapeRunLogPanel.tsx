import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { Clock, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";

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
}

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Automated Scrape Runs
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Twice-daily scrape, promote and verify pipeline. Cron: 06:00 &amp; 18:00 UTC.
        </p>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : runs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No runs recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {runs.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between rounded-md border border-border bg-background p-3 text-sm"
              >
                <div className="flex items-center gap-3">
                  {statusIcon(r.status)}
                  <div>
                    <div className="font-medium">
                      {new Date(r.started_at).toLocaleString("en-GB")}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {r.trigger_source ?? "manual"} ·{" "}
                      {r.providers_run ?? 0} providers ·{" "}
                      {r.tests_scraped ?? 0} scraped ·{" "}
                      {r.tests_promoted ?? 0} promoted
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(r.verification_failures ?? 0) > 0 && (
                    <Badge variant="destructive">
                      {r.verification_failures} failures
                    </Badge>
                  )}
                  <Badge variant={r.status === "completed" ? "default" : "secondary"}>
                    {r.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
