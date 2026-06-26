import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SectionShell, StatCard, HealthDot } from "../SectionShell";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AlertRow {
  id: string;
  alert_type: string | null;
  severity: string | null;
  message: string | null;
  provider: string | null;
  resolved: boolean | null;
  created_at: string | null;
}

export default function NotificationsSection() {
  const [alerts, setAlerts] = useState<AlertRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () =>
    supabase
      .from("scraper_alerts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setAlerts((data ?? []) as any);
        setLoading(false);
      });

  useEffect(() => {
    load();
  }, []);

  const resolve = async (id: string) => {
    await supabase.from("scraper_alerts").update({ resolved: true }).eq("id", id);
    load();
  };

  const open = alerts.filter((a) => !a.resolved);
  const critical = open.filter((a) => a.severity === "critical" || a.severity === "high").length;

  return (
    <SectionShell title="Notification Centre" description="Open alerts from every subsystem." status="live">
      <div className="grid grid-cols-3 gap-3 mb-6">
        <StatCard label="Open alerts" value={open.length} tone={open.length > 0 ? "warn" : "good"} />
        <StatCard label="Critical / High" value={critical} tone={critical > 0 ? "bad" : "good"} />
        <StatCard label="Total (recent)" value={alerts.length} />
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-muted-foreground text-sm py-12">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading alerts…
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((a) => (
            <div key={a.id} className="rounded-lg border bg-card p-3 flex items-start gap-3">
              <HealthDot state={severityToState(a.severity)} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium">{a.alert_type ?? "alert"}</span>
                  {a.provider && <span className="text-xs text-muted-foreground">· {a.provider}</span>}
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{a.severity}</span>
                  {a.resolved && <span className="text-[10px] uppercase tracking-wider text-emerald-600">resolved</span>}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.message}</div>
                <div className="text-[10px] text-muted-foreground mt-1 tabular-nums">
                  {a.created_at ? new Date(a.created_at).toLocaleString() : ""}
                </div>
              </div>
              {!a.resolved && (
                <Button size="sm" variant="outline" onClick={() => resolve(a.id)}>Resolve</Button>
              )}
            </div>
          ))}
          {alerts.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-12">No alerts. All systems quiet.</p>
          )}
        </div>
      )}
    </SectionShell>
  );
}

function severityToState(s: string | null): "good" | "warn" | "bad" | "idle" {
  if (s === "critical" || s === "high") return "bad";
  if (s === "warning" || s === "medium") return "warn";
  if (s === "info" || s === "low") return "good";
  return "idle";
}
