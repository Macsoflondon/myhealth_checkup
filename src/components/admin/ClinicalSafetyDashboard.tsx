import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ShieldAlert, Activity, Brain, ServerCog, Volume2, VolumeX, Lock, Unlock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Severity = "critical" | "high" | "medium" | "low";
const SEVERITIES: Severity[] = ["critical", "high", "medium", "low"];

interface StreamEvent {
  id: string;
  source: "soc_incident" | "ai_operation" | "engine_run";
  severity: Severity;
  title: string;
  detail?: string;
  at: string;
}

interface FreezeRow {
  id: string;
  path: string;
  reason: string;
  active: boolean;
  created_at: string;
  created_by: string | null;
}

const severityStyle: Record<Severity, string> = {
  critical: "bg-red-600 text-white border-red-700",
  high: "bg-orange-500 text-white border-orange-600",
  medium: "bg-amber-400 text-black border-amber-500",
  low: "bg-slate-300 text-black border-slate-400",
};

const errorTypeToSeverity = (t: string | null): Severity => {
  if (!t) return "low";
  const s = t.toLowerCase();
  if (s.includes("safety") || s.includes("clinical") || s.includes("critical")) return "critical";
  if (s.includes("timeout") || s.includes("rate_limit") || s.includes("auth")) return "high";
  return "medium";
};

const runStatusToSeverity = (status: string): Severity => {
  if (status === "blocked") return "critical";
  if (status === "failed") return "high";
  return "low";
};

const REFRESH_MS = 5000;

export function ClinicalSafetyDashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState<StreamEvent[]>([]);
  const [filter, setFilter] = useState<Set<Severity>>(new Set(SEVERITIES));
  const [soundOn, setSoundOn] = useState(false);
  const [freezes, setFreezes] = useState<FreezeRow[]>([]);
  const [emergencyReason, setEmergencyReason] = useState("");
  const [unfreezeReason, setUnfreezeReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const lastCriticalId = useRef<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchAll = useCallback(async () => {
    const [incidents, aiOps, runs, frz] = await Promise.all([
      supabase.from("soc_incidents").select("id,severity,title,summary,first_seen_at,status").order("first_seen_at", { ascending: false }).limit(50),
      supabase.from("ai_operation_logs").select("id,job_type,model,success,error_type,error_message,created_at").eq("success", false).order("created_at", { ascending: false }).limit(30),
      supabase.from("engine_runs").select("id,skill,scope,status,current_stage,started_at").in("status", ["failed", "blocked"]).order("started_at", { ascending: false }).limit(30),
      supabase.from("engine_freezes").select("id,path,reason,active,created_at,created_by").eq("active", true).order("created_at", { ascending: false }),
    ]);

    const merged: StreamEvent[] = [];
    for (const r of incidents.data ?? []) {
      merged.push({
        id: `soc-${r.id}`,
        source: "soc_incident",
        severity: (r.severity as Severity) ?? "medium",
        title: r.title ?? "SOC incident",
        detail: r.summary ?? undefined,
        at: r.first_seen_at ?? new Date().toISOString(),
      });
    }
    for (const r of aiOps.data ?? []) {
      merged.push({
        id: `ai-${r.id}`,
        source: "ai_operation",
        severity: errorTypeToSeverity(r.error_type),
        title: `AI failure · ${r.job_type ?? "unknown"} (${r.model ?? "?"})`,
        detail: r.error_message ?? r.error_type ?? undefined,
        at: r.created_at ?? new Date().toISOString(),
      });
    }
    for (const r of runs.data ?? []) {
      merged.push({
        id: `run-${r.id}`,
        source: "engine_run",
        severity: runStatusToSeverity(r.status),
        title: `${r.skill} · ${r.status} @ ${r.current_stage}`,
        detail: r.scope ?? undefined,
        at: r.started_at ?? new Date().toISOString(),
      });
    }
    merged.sort((a, b) => b.at.localeCompare(a.at));
    setEvents(merged);
    setFreezes((frz.data ?? []) as FreezeRow[]);

    const topCritical = merged.find((e) => e.severity === "critical");
    if (soundOn && topCritical && topCritical.id !== lastCriticalId.current) {
      lastCriticalId.current = topCritical.id;
      audioRef.current?.play().catch(() => {});
    }
  }, [soundOn]);

  useEffect(() => {
    fetchAll();
    const t = setInterval(fetchAll, REFRESH_MS);
    return () => clearInterval(t);
  }, [fetchAll]);

  const filtered = useMemo(() => events.filter((e) => filter.has(e.severity)), [events, filter]);
  const counts = useMemo(() => {
    const c: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    events.forEach((e) => (c[e.severity] += 1));
    return c;
  }, [events]);

  const globalFreeze = freezes.find((f) => f.path === "*");

  const logAdmin = async (action: string, meta: Record<string, unknown>, success = true, err?: string) => {
    await supabase.from("admin_activity_log").insert({
      admin_user_id: user?.id ?? null,
      action,
      resource_type: "clinical_safety",
      resource_id: null,
      resource_name: "emergency_override",
      new_value: meta as never,
      success,
      error_message: err ?? null,
    });
  };

  const triggerEmergencyFreeze = async () => {
    if (confirmText !== "FREEZE ALL") {
      toast({ title: "Type FREEZE ALL to confirm", variant: "destructive" });
      return;
    }
    if (emergencyReason.trim().length < 10) {
      toast({ title: "Reason must be ≥ 10 chars", variant: "destructive" });
      return;
    }
    setLoading(true);
    const reason = `[EMERGENCY ${new Date().toISOString()}] ${emergencyReason.trim()}`;
    const { error } = await supabase.from("engine_freezes").upsert(
      { path: "*", reason, active: true, created_by: user?.id ?? null, unfrozen_at: null, unfrozen_by: null, unfreeze_reason: null },
      { onConflict: "path" },
    );
    await logAdmin("emergency_freeze", { reason }, !error, error?.message);
    setLoading(false);
    if (error) {
      toast({ title: "Freeze failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Global freeze active", description: "All write skills will refuse." });
    setEmergencyReason("");
    setConfirmText("");
    fetchAll();
  };

  const releaseFreeze = async () => {
    if (unfreezeReason.trim().length < 10) {
      toast({ title: "Unfreeze reason ≥ 10 chars", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("engine_freezes")
      .update({
        active: false,
        unfrozen_at: new Date().toISOString(),
        unfrozen_by: user?.id ?? null,
        unfreeze_reason: unfreezeReason.trim(),
      })
      .eq("path", "*")
      .eq("active", true);
    await logAdmin("emergency_unfreeze", { reason: unfreezeReason.trim() }, !error, error?.message);
    setLoading(false);
    if (error) {
      toast({ title: "Release failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Global freeze released" });
    setUnfreezeReason("");
    fetchAll();
  };

  const toggleSev = (s: Severity) => {
    const next = new Set(filter);
    next.has(s) ? next.delete(s) : next.add(s);
    setFilter(next);
  };

  return (
    <div className="container mx-auto space-y-6 p-6">
      <audio ref={audioRef} src="data:audio/wav;base64,UklGRnwAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YVgAAAA=" preload="auto" />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-red-600" /> Clinical Safety Monitor
          </h1>
          <p className="text-sm text-muted-foreground">Live severity stream · SOC incidents · AI decisions · execution engine</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setSoundOn((s) => !s)}>
          {soundOn ? <Volume2 className="mr-2 h-4 w-4" /> : <VolumeX className="mr-2 h-4 w-4" />}
          Critical alert sound: {soundOn ? "on" : "off"}
        </Button>
      </div>

      {globalFreeze && (
        <Alert className="border-red-600 bg-red-50 dark:bg-red-950/30">
          <Lock className="h-4 w-4" />
          <AlertTitle className="text-red-700 dark:text-red-300">Global write freeze active</AlertTitle>
          <AlertDescription className="space-y-3">
            <div className="text-sm">{globalFreeze.reason}</div>
            <div className="flex gap-2">
              <Input
                placeholder="Release reason (≥10 chars)"
                value={unfreezeReason}
                onChange={(e) => setUnfreezeReason(e.target.value)}
                className="max-w-md"
              />
              <Button variant="outline" onClick={releaseFreeze} disabled={loading}>
                <Unlock className="mr-2 h-4 w-4" /> Release
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {SEVERITIES.map((s) => (
          <button
            key={s}
            onClick={() => toggleSev(s)}
            className={`rounded-lg border-2 p-4 text-left transition ${filter.has(s) ? severityStyle[s] : "opacity-40 border-dashed"}`}
          >
            <div className="text-xs uppercase tracking-widest">{s}</div>
            <div className="text-3xl font-bold">{counts[s]}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-4 w-4" /> Live event stream ({filtered.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[600px] overflow-y-auto space-y-2">
            {filtered.length === 0 && <p className="text-sm text-muted-foreground">No events match current filters.</p>}
            {filtered.map((e) => (
              <div key={e.id} className="flex items-start gap-3 rounded border p-3">
                <Badge className={severityStyle[e.severity]}>{e.severity}</Badge>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    {e.source === "ai_operation" && <Brain className="h-3 w-3" />}
                    {e.source === "engine_run" && <ServerCog className="h-3 w-3" />}
                    {e.source === "soc_incident" && <ShieldAlert className="h-3 w-3" />}
                    <span className="truncate">{e.title}</span>
                  </div>
                  {e.detail && <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.detail}</div>}
                  <div className="mt-1 text-[10px] uppercase text-muted-foreground">{new Date(e.at).toLocaleString("en-GB")}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className={globalFreeze ? "border-slate-300" : "border-red-300"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-red-600" /> Emergency override
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Inserts a wildcard freeze (<code>path=*</code>). All write skills in the execution engine will refuse until released. Audit-logged to
              <code> admin_activity_log</code>.
            </p>
            <Textarea
              placeholder="Reason for emergency freeze (≥10 chars)"
              value={emergencyReason}
              onChange={(e) => setEmergencyReason(e.target.value)}
              rows={3}
              disabled={!!globalFreeze}
            />
            <Input
              placeholder='Type "FREEZE ALL" to confirm'
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              disabled={!!globalFreeze}
            />
            <Button variant="destructive" className="w-full" onClick={triggerEmergencyFreeze} disabled={loading || !!globalFreeze}>
              <Lock className="mr-2 h-4 w-4" />
              {globalFreeze ? "Freeze already active" : "FREEZE ALL WRITES"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
