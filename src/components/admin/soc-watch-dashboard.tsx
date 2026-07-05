import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Activity, AlertTriangle, Eye, Gauge, LockKeyhole, RefreshCw, Search, ShieldCheck, Siren, TimerReset, Zap } from "lucide-react";
import { socWatchApi, type SocSignal, type SocSource } from "@/api/supabase/socWatch.api";
import { formatSocDateTime, humaniseToken, type SocSeverity } from "@/lib/socWatchUtils";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SocIncidentsPanel } from "@/components/admin/soc-incidents-panel";


interface SocWatchDashboardProps {
  embedded?: boolean;
}

const SEVERITIES: Array<SocSeverity | "all"> = ["all", "critical", "high", "medium", "low", "info"];
const SOURCES: Array<SocSource | "all"> = [
  "all",
  "security-scan",
  "operational-alert",
  "scraper-alert",
  "edge-function",
  "protected-call",
  "cron",
  "csp",
  "audit",
  "role-audit",
  "rate-limit",
];

const severityClasses: Record<SocSeverity, string> = {
  critical: "bg-clinical-alert text-clinical-alert-foreground",
  high: "bg-error text-error-foreground",
  medium: "bg-health-warning text-primary-foreground",
  low: "bg-primary-container text-primary-on-container",
  info: "bg-muted text-muted-foreground",
};

const sourceLabels: Record<SocSource, string> = {
  "security-scan": "Security scan",
  csp: "CSP",
  "scraper-alert": "Scraper alert",
  "operational-alert": "Operational alert",
  cron: "Cron",
  "edge-function": "Edge function",
  "protected-call": "Protected call",
  audit: "Audit log",
  "role-audit": "Role audit",
  "rate-limit": "Rate limit",
};

function MetricCard({ label, value, hint, icon: Icon, tone = "info" }: {
  label: string;
  value: string | number;
  hint: string;
  icon: typeof ShieldCheck;
  tone?: SocSeverity;
}) {
  return (
    <Card variant="outlined" className="p-4 bg-card/95">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold text-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground truncate">{hint}</p>
        </div>
        <span className={cn("rounded-md p-2", tone === "critical" || tone === "high" ? "bg-error/10 text-error" : tone === "medium" ? "bg-health-warning/10 text-health-warning" : "bg-primary/10 text-primary")}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}

function SeverityBadge({ severity }: { severity: SocSeverity }) {
  return <Badge className={cn("h-7 px-3 capitalize", severityClasses[severity])}>{severity}</Badge>;
}

function StatusBadge({ status }: { status: SocSignal["status"] }) {
  return (
    <Badge className={cn("h-7 px-3 capitalize", status === "open" ? "bg-error/10 text-error" : status === "resolved" ? "bg-primary-container text-primary-on-container" : "bg-muted text-muted-foreground")}>{status}</Badge>
  );
}

function LoadingGrid() {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton key={index} className="h-32 rounded-lg" />
      ))}
    </div>
  );
}

export function SocWatchDashboard({ embedded = false }: SocWatchDashboardProps) {
  const queryClient = useQueryClient();
  const [days, setDays] = useState("7");
  const [severity, setSeverity] = useState<SocSeverity | "all">("all");
  const [source, setSource] = useState<SocSource | "all">("all");
  const [query, setQuery] = useState("");

  const queryKey = useMemo(() => ["soc-watch", days], [days]);
  const dashboardQuery = useQuery({
    queryKey,
    queryFn: async () => {
      const response = await socWatchApi.getDashboard({ days: Number(days) });
      if (!response.data) throw response.error ?? new Error("SOC Watch data unavailable");
      return { dashboard: response.data, partialError: response.error };
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  useEffect(() => {
    return socWatchApi.subscribeToChanges(() => {
      void queryClient.invalidateQueries({ queryKey: ["soc-watch"] });
    });
  }, [queryClient]);

  const dashboard = dashboardQuery.data?.dashboard;
  const partialError = dashboardQuery.data?.partialError;

  const filteredSignals = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return (dashboard?.signals ?? []).filter((signal) => {
      const matchesSeverity = severity === "all" || signal.severity === severity;
      const matchesSource = source === "all" || signal.source === source;
      const haystack = [signal.title, signal.description, signal.entity, signal.evidence, sourceLabels[signal.source]].join(" ").toLowerCase();
      const matchesQuery = needle.length === 0 || haystack.includes(needle);
      return matchesSeverity && matchesSource && matchesQuery;
    });
  }, [dashboard?.signals, query, severity, source]);

  const shellClass = embedded ? "space-y-6" : "min-h-screen bg-brand-navy text-primary-foreground";
  const innerClass = embedded ? "space-y-6" : "container mx-auto max-w-7xl px-4 py-8 space-y-6";

  return (
    <div className={shellClass}>
      <div className={innerClass}>
        <header className={cn("flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between", !embedded && "border-b border-primary-foreground/10 pb-6")}>
          <div className="max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <Badge className="bg-primary text-primary-foreground">SOC Phase 1</Badge>
              <Badge className="bg-secondary text-secondary-foreground">Monitoring only</Badge>
              <Badge className="bg-card text-card-foreground">Admin + MFA</Badge>
            </div>
            <h1 className={cn("font-heading text-3xl font-semibold", embedded ? "text-foreground" : "text-primary-foreground")}>SOC Watch</h1>
            <p className={cn("mt-2 text-sm", embedded ? "text-muted-foreground" : "text-primary-foreground/70")}>Read-only security operations visibility across audit logs, alerts, protected calls, CSP reports, cron jobs and edge function health.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {embedded && (
              <Button asChild variant="outline" size="sm">
                <Link to="/admin/soc-watch"><Eye className="mr-2 h-4 w-4" />Full screen</Link>
              </Button>
            )}
            <Button variant={embedded ? "default" : "secondary"} onClick={() => void dashboardQuery.refetch()} disabled={dashboardQuery.isFetching}>
              <RefreshCw className={cn("mr-2 h-4 w-4", dashboardQuery.isFetching && "animate-spin")} />Refresh
            </Button>
          </div>
        </header>

        {partialError && (
          <Alert className="border-health-warning/40 bg-health-warning/10">
            <AlertTriangle className="h-4 w-4 text-health-warning" />
            <AlertDescription className="text-sm">
              Some SOC sources are unavailable under the current RLS context: {dashboard?.unavailableSources.join(", ") || partialError.message}
            </AlertDescription>
          </Alert>
        )}

        {dashboardQuery.isLoading ? (
          <LoadingGrid />
        ) : dashboard ? (
          <>
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Open high-risk signals" value={dashboard.summary.criticalOpen + dashboard.summary.highOpen} hint={`${dashboard.summary.criticalOpen} critical · ${dashboard.summary.highOpen} high`} icon={Siren} tone={dashboard.summary.criticalOpen > 0 ? "critical" : dashboard.summary.highOpen > 0 ? "high" : "info"} />
              <MetricCard label="Protected call denials" value={dashboard.summary.deniedProtectedCalls} hint="Denied calls in selected window" icon={LockKeyhole} tone={dashboard.summary.deniedProtectedCalls > 0 ? "medium" : "info"} />
              <MetricCard label="Function failures" value={dashboard.summary.functionFailures} hint="Edge function errors and 4xx/5xx statuses" icon={Zap} tone={dashboard.summary.functionFailures > 0 ? "high" : "info"} />
              <MetricCard label="Total signals" value={dashboard.summary.totalSignals} hint={`Updated ${formatSocDateTime(dashboard.summary.lastUpdatedAt)}`} icon={Gauge} />
            </section>

            <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
              <Card variant="outlined" className="p-4 bg-card/95">
                <div className="mb-4 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">Signal queue</h2>
                    <p className="text-sm text-muted-foreground">{filteredSignals.length} of {dashboard.signals.length} signals shown</p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-[150px_170px_230px]">
                    <div>
                      <Label className="text-xs">Window</Label>
                      <Select value={days} onValueChange={setDays}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">24 hours</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Severity</Label>
                      <Select value={severity} onValueChange={(value) => setSeverity(value as SocSeverity | "all")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {SEVERITIES.map((item) => <SelectItem key={item} value={item}>{humaniseToken(item)}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="sm:col-span-2 xl:col-span-1">
                      <Label htmlFor="soc-search" className="text-xs">Search</Label>
                      <div className="relative">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input id="soc-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Function, provider, event…" className="pl-9" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  {SOURCES.map((item) => (
                    <Button key={item} type="button" variant={source === item ? "default" : "outline"} size="sm" onClick={() => setSource(item)}>
                      {item === "all" ? "All sources" : sourceLabels[item]}
                    </Button>
                  ))}
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Signal</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last seen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSignals.map((signal) => (
                      <TableRow key={signal.id}>
                        <TableCell className="min-w-[260px]">
                          <div className="font-medium text-foreground">{signal.title}</div>
                          <div className="mt-1 max-w-xl text-xs text-muted-foreground">{signal.description || "No additional detail returned"}</div>
                          <div className="mt-1 text-xs text-muted-foreground">{signal.entity}</div>
                        </TableCell>
                        <TableCell>{sourceLabels[signal.source]}</TableCell>
                        <TableCell><SeverityBadge severity={signal.severity} /></TableCell>
                        <TableCell><StatusBadge status={signal.status} /></TableCell>
                        <TableCell className="whitespace-nowrap text-muted-foreground">{formatSocDateTime(signal.occurredAt)}</TableCell>
                      </TableRow>
                    ))}
                    {filteredSignals.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No matching SOC signals in this window.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Card>

              <aside className="space-y-4">
                <Card variant="outlined" className="p-4 bg-card/95">
                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Operational health</h2>
                  </div>
                  <div className="space-y-3">
                    {dashboard.health.map((item) => (
                      <div key={item.id} className="rounded-md border border-border/70 p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
                          <SeverityBadge severity={item.severity} />
                        </div>
                        <div className="mt-2 text-2xl font-semibold text-foreground">{item.value}</div>
                        <div className="text-xs text-muted-foreground">{item.detail}</div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="outlined" className="p-4 bg-card/95">
                  <div className="mb-3 flex items-center gap-2">
                    <TimerReset className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Recent timeline</h2>
                  </div>
                  <div className="space-y-3">
                    {dashboard.timeline.slice(0, 8).map((signal) => (
                      <div key={`timeline-${signal.id}`} className="border-l-2 border-primary/30 pl-3">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">{signal.title}</p>
                          <SeverityBadge severity={signal.severity} />
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{sourceLabels[signal.source]} · {formatSocDateTime(signal.occurredAt)}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card variant="outlined" className="p-4 bg-card/95">
                  <div className="mb-3 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    <h2 className="font-semibold text-foreground">Source coverage</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(dashboard.sourceCounts).map(([key, value]) => (
                      <div key={key} className="rounded-md bg-muted/70 px-3 py-2">
                        <div className="font-semibold text-foreground">{value}</div>
                        <div className="text-xs text-muted-foreground">{sourceLabels[key as SocSource]}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </aside>
            </section>
          </>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{dashboardQuery.error instanceof Error ? dashboardQuery.error.message : "SOC Watch data could not be loaded."}</AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}