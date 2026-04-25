import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScraperAlert {
  id: string;
  provider_id: string;
  alert_type: "below_floor" | "sudden_drop" | "scrape_failed" | "no_data";
  severity: "info" | "warning" | "critical";
  message: string;
  current_count: number | null;
  previous_count: number | null;
  expected_min: number | null;
  acknowledged: boolean;
  created_at: string;
}

const severityVariant: Record<ScraperAlert["severity"], "default" | "destructive" | "secondary"> = {
  info: "secondary",
  warning: "default",
  critical: "destructive",
};

export const ScraperAlertsPanel: React.FC = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<ScraperAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("scraper_alerts")
      .select("*")
      .eq("acknowledged", false)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      toast({ title: "Failed to load alerts", description: error.message, variant: "destructive" });
    } else {
      setAlerts((data as unknown as ScraperAlert[]) ?? []);
    }
    setLoading(false);
  };

  const runHealthCheck = async () => {
    setRunning(true);
    const { data, error } = await supabase.functions.invoke("scraper-health-check");
    setRunning(false);
    if (error) {
      toast({ title: "Health check failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({
      title: "Health check complete",
      description: `Checked ${data?.providers_checked ?? 0} providers, ${data?.alerts_inserted ?? 0} new alerts.`,
    });
    await load();
  };

  const acknowledge = async (id: string) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase
      .from("scraper_alerts")
      .update({
        acknowledged: true,
        acknowledged_by: userData.user?.id ?? null,
        acknowledged_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      toast({ title: "Could not acknowledge", description: error.message, variant: "destructive" });
      return;
    }
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    void load();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Scraper alerts
          </CardTitle>
          <CardDescription>
            Unacknowledged alerts when a provider drops below its expected test count.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button size="sm" onClick={runHealthCheck} disabled={running}>
            {running ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Run health check
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center gap-2 text-muted-foreground py-6">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading alerts…
          </div>
        ) : alerts.length === 0 ? (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>No unacknowledged scraper alerts.</AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {alerts.map((a) => (
              <div
                key={a.id}
                className="flex items-start justify-between gap-4 rounded-lg border p-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={severityVariant[a.severity]} className="capitalize">
                      {a.severity}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {a.alert_type.replace(/_/g, " ")}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(a.created_at).toLocaleString("en-GB")}
                    </span>
                  </div>
                  <p className="text-sm">{a.message}</p>
                  {(a.current_count !== null || a.previous_count !== null || a.expected_min !== null) && (
                    <p className="text-xs text-muted-foreground">
                      current: {a.current_count ?? "—"} · previous: {a.previous_count ?? "—"} · floor:{" "}
                      {a.expected_min ?? "—"}
                    </p>
                  )}
                </div>
                <Button variant="ghost" size="sm" onClick={() => acknowledge(a.id)}>
                  Acknowledge
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
