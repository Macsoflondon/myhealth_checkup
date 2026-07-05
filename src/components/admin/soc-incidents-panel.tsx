import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, ClipboardList, Loader2, MessageSquarePlus, RefreshCw, ShieldAlert, UserPlus, Undo2 } from "lucide-react";
import { socIncidentsApi, type SocIncident, type SocIncidentSeverity, type SocIncidentStatus } from "@/api/supabase/socIncidents.api";
import { formatSocDateTime } from "@/lib/socWatchUtils";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";

const STATUS_OPTIONS: Array<SocIncidentStatus | "active" | "all"> = ["active", "open", "acknowledged", "resolved", "suppressed", "all"];
const SEVERITY_OPTIONS: Array<SocIncidentSeverity | "all"> = ["all", "critical", "high", "medium", "low", "info"];

const severityClasses: Record<SocIncidentSeverity, string> = {
  critical: "bg-clinical-alert text-clinical-alert-foreground",
  high: "bg-error text-error-foreground",
  medium: "bg-health-warning text-primary-foreground",
  low: "bg-primary-container text-primary-on-container",
  info: "bg-muted text-muted-foreground",
};

const statusClasses: Record<SocIncidentStatus, string> = {
  open: "bg-error/15 text-error",
  acknowledged: "bg-health-warning/15 text-health-warning",
  resolved: "bg-primary-container text-primary-on-container",
  suppressed: "bg-muted text-muted-foreground",
};

export function SocIncidentsPanel() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<SocIncidentStatus | "active" | "all">("active");
  const [severityFilter, setSeverityFilter] = useState<SocIncidentSeverity | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [resolveDialog, setResolveDialog] = useState<{ incident: SocIncident; note: string } | null>(null);
  const [reopenDialog, setReopenDialog] = useState<{ incident: SocIncident; reason: string } | null>(null);
  const [noteDialog, setNoteDialog] = useState<{ incidentId: string; note: string } | null>(null);

  const listQuery = useQuery({
    queryKey: ["soc-incidents", statusFilter, severityFilter],
    queryFn: async () => {
      const statuses: SocIncidentStatus[] | undefined =
        statusFilter === "all"
          ? undefined
          : statusFilter === "active"
            ? ["open", "acknowledged"]
            : [statusFilter];
      const response = await socIncidentsApi.list({
        status: statuses,
        severity: severityFilter === "all" ? undefined : [severityFilter],
        limit: 200,
      });
      if (response.error) throw response.error;
      return response.data ?? [];
    },
    staleTime: 30_000,
    refetchInterval: 60_000,
  });

  const eventsQuery = useQuery({
    queryKey: ["soc-incident-events", expandedId],
    queryFn: async () => {
      if (!expandedId) return [];
      const response = await socIncidentsApi.getEvents(expandedId);
      if (response.error) throw response.error;
      return response.data ?? [];
    },
    enabled: !!expandedId,
  });

  useEffect(() => {
    return socIncidentsApi.subscribeToChanges(() => {
      void queryClient.invalidateQueries({ queryKey: ["soc-incidents"] });
      void queryClient.invalidateQueries({ queryKey: ["soc-incident-events"] });
    });
  }, [queryClient]);

  const clusterMutation = useMutation({
    mutationFn: () => socIncidentsApi.triggerCluster(),
    onSuccess: (result) => {
      if (result.error) {
        toast.error(`Clustering failed: ${result.error.message}`);
        return;
      }
      const r = result.data;
      toast.success(`Clustered ${r?.signals_scanned ?? 0} signals · ${r?.incidents_created ?? 0} new · ${r?.incidents_updated ?? 0} updated`);
      void queryClient.invalidateQueries({ queryKey: ["soc-incidents"] });
    },
    onError: (err) => toast.error(err instanceof Error ? err.message : "Clustering failed"),
  });

  const ackMutation = useMutation({
    mutationFn: (id: string) => socIncidentsApi.acknowledge(id),
    onSuccess: (r) => r.error ? toast.error(r.error.message) : toast.success("Incident acknowledged"),
  });
  const assignMutation = useMutation({
    mutationFn: (id: string) => socIncidentsApi.assignToSelf(id),
    onSuccess: (r) => r.error ? toast.error(r.error.message) : toast.success("Assigned to you"),
  });
  const unassignMutation = useMutation({
    mutationFn: (id: string) => socIncidentsApi.unassign(id),
    onSuccess: (r) => r.error ? toast.error(r.error.message) : toast.success("Unassigned"),
  });
  const resolveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => socIncidentsApi.resolve(id, note),
    onSuccess: (r) => {
      if (r.error) return toast.error(r.error.message);
      toast.success("Incident resolved");
      setResolveDialog(null);
    },
  });
  const reopenMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => socIncidentsApi.reopen(id, reason),
    onSuccess: (r) => {
      if (r.error) return toast.error(r.error.message);
      toast.success("Incident reopened");
      setReopenDialog(null);
    },
  });
  const noteMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) => socIncidentsApi.addNote(id, note),
    onSuccess: (r) => {
      if (r.error) return toast.error(r.error.message);
      toast.success("Note added");
      setNoteDialog(null);
    },
  });

  const incidents = listQuery.data ?? [];
  const activeCount = useMemo(() => incidents.filter((i) => i.status === "open" || i.status === "acknowledged").length, [incidents]);

  return (
    <>
      <Card variant="outlined" className="p-4 bg-card/95">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">Incidents</h2>
              <Badge className="bg-primary text-primary-foreground">{activeCount} active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Signals clustered by source, entity and hour into acknowledgeable incidents.</p>
          </div>
          <div className="flex flex-wrap items-end gap-2">
            <div className="w-40">
              <Label className="text-xs">Status</Label>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s === "active" ? "Active" : s === "all" ? "All" : s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-40">
              <Label className="text-xs">Severity</Label>
              <Select value={severityFilter} onValueChange={(v) => setSeverityFilter(v as SocIncidentSeverity | "all")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((s) => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={() => clusterMutation.mutate()} disabled={clusterMutation.isPending}>
              <RefreshCw className={cn("mr-2 h-4 w-4", clusterMutation.isPending && "animate-spin")} />
              Refresh clustering
            </Button>
          </div>
        </div>

        {listQuery.isLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : listQuery.error ? (
          <Alert variant="destructive"><AlertDescription>{(listQuery.error as Error).message}</AlertDescription></Alert>
        ) : incidents.length === 0 ? (
          <div className="rounded-md border border-dashed border-border/60 p-10 text-center text-sm text-muted-foreground">
            No incidents match these filters. Try widening the status, or trigger clustering to scan the last 24h.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Severity</TableHead>
                <TableHead>Incident</TableHead>
                <TableHead>Source</TableHead>
                <TableHead className="text-right">Signals</TableHead>
                <TableHead>Last seen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incidents.map((inc) => {
                const isExpanded = expandedId === inc.id;
                const isActive = inc.status === "open" || inc.status === "acknowledged";
                return (
                  <>
                    <TableRow
                      key={inc.id}
                      onClick={() => setExpandedId(isExpanded ? null : inc.id)}
                      className="cursor-pointer"
                    >
                      <TableCell><Badge className={cn("capitalize", severityClasses[inc.severity as SocIncidentSeverity])}>{inc.severity}</Badge></TableCell>
                      <TableCell className="min-w-[280px]">
                        <div className="font-medium text-foreground">{inc.title}</div>
                        <div className="mt-1 text-xs text-muted-foreground">{inc.entity ?? "—"}</div>
                      </TableCell>
                      <TableCell className="capitalize">{inc.source.replace(/-/g, " ")}</TableCell>
                      <TableCell className="text-right font-mono">{inc.signal_count}</TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">{formatSocDateTime(inc.last_seen_at)}</TableCell>
                      <TableCell><Badge className={cn("capitalize", statusClasses[inc.status as SocIncidentStatus])}>{inc.status}</Badge></TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex flex-wrap justify-end gap-1">
                          {isActive && inc.status === "open" && (
                            <Button size="sm" variant="outline" onClick={() => ackMutation.mutate(inc.id)} disabled={ackMutation.isPending}>
                              Ack
                            </Button>
                          )}
                          {isActive && !inc.assignee_id && (
                            <Button size="sm" variant="outline" onClick={() => assignMutation.mutate(inc.id)}>
                              <UserPlus className="mr-1 h-3 w-3" />Take
                            </Button>
                          )}
                          {isActive && inc.assignee_id && (
                            <Button size="sm" variant="ghost" onClick={() => unassignMutation.mutate(inc.id)}>Drop</Button>
                          )}
                          {isActive && (
                            <Button size="sm" onClick={() => setResolveDialog({ incident: inc, note: "" })}>
                              <CheckCircle2 className="mr-1 h-3 w-3" />Resolve
                            </Button>
                          )}
                          {inc.status === "resolved" && (
                            <Button size="sm" variant="outline" onClick={() => setReopenDialog({ incident: inc, reason: "" })}>
                              <Undo2 className="mr-1 h-3 w-3" />Reopen
                            </Button>
                          )}
                          <Button size="sm" variant="ghost" onClick={() => setNoteDialog({ incidentId: inc.id, note: "" })}>
                            <MessageSquarePlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    {isExpanded && (
                      <TableRow key={`${inc.id}-expand`}>
                        <TableCell colSpan={7} className="bg-muted/30 py-4">
                          <div className="grid gap-4 lg:grid-cols-2">
                            <div>
                              <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">Summary</h4>
                              <p className="text-sm text-foreground">{inc.summary ?? "—"}</p>
                              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                                <div><span className="font-semibold">First seen:</span> {formatSocDateTime(inc.first_seen_at)}</div>
                                <div><span className="font-semibold">Cluster:</span> <code className="text-xs">{inc.cluster_key}</code></div>
                                {inc.acknowledged_at && <div><span className="font-semibold">Ack:</span> {formatSocDateTime(inc.acknowledged_at)}</div>}
                                {inc.resolved_at && <div><span className="font-semibold">Resolved:</span> {formatSocDateTime(inc.resolved_at)}</div>}
                                {inc.resolution_note && <div className="col-span-2"><span className="font-semibold">Note:</span> {inc.resolution_note}</div>}
                              </div>
                              {inc.sample_signal_ids?.length > 0 && (
                                <div className="mt-3">
                                  <h4 className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Sample signal IDs</h4>
                                  <div className="max-h-24 overflow-y-auto rounded bg-background/50 p-2 font-mono text-xs">
                                    {inc.sample_signal_ids.slice(0, 20).join(", ")}
                                  </div>
                                </div>
                              )}
                            </div>
                            <div>
                              <h4 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
                                <ClipboardList className="h-3 w-3" />Timeline
                              </h4>
                              {eventsQuery.isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (eventsQuery.data ?? []).length === 0 ? (
                                <p className="text-sm text-muted-foreground">No lifecycle events.</p>
                              ) : (
                                <ul className="space-y-1 text-xs">
                                  {(eventsQuery.data ?? []).map((ev) => (
                                    <li key={ev.id} className="border-l-2 border-primary/30 pl-2">
                                      <div className="flex items-center gap-2">
                                        <Badge variant="outline" className="capitalize">{ev.event_type.replace(/_/g, " ")}</Badge>
                                        <span className="text-muted-foreground">{formatSocDateTime(ev.created_at)}</span>
                                      </div>
                                      {ev.detail && Object.keys(ev.detail as object).length > 0 && (
                                        <pre className="mt-1 max-h-20 overflow-y-auto text-xs text-muted-foreground">{JSON.stringify(ev.detail, null, 2)}</pre>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                );
              })}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog open={!!resolveDialog} onOpenChange={(open) => !open && setResolveDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Resolve incident</DialogTitle>
            <DialogDescription>{resolveDialog?.incident.title}</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Resolution note (required, min 3 chars)"
            value={resolveDialog?.note ?? ""}
            onChange={(e) => setResolveDialog((prev) => prev ? { ...prev, note: e.target.value } : null)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialog(null)}>Cancel</Button>
            <Button
              disabled={!resolveDialog || resolveDialog.note.trim().length < 3 || resolveMutation.isPending}
              onClick={() => resolveDialog && resolveMutation.mutate({ id: resolveDialog.incident.id, note: resolveDialog.note })}
            >
              Resolve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reopenDialog} onOpenChange={(open) => !open && setReopenDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reopen incident</DialogTitle>
            <DialogDescription>{reopenDialog?.incident.title}</DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for reopening"
            value={reopenDialog?.reason ?? ""}
            onChange={(e) => setReopenDialog((prev) => prev ? { ...prev, reason: e.target.value } : null)}
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReopenDialog(null)}>Cancel</Button>
            <Button
              disabled={!reopenDialog || reopenMutation.isPending}
              onClick={() => reopenDialog && reopenMutation.mutate({ id: reopenDialog.incident.id, reason: reopenDialog.reason })}
            >
              Reopen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!noteDialog} onOpenChange={(open) => !open && setNoteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add note</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Note (visible to all admins)"
            value={noteDialog?.note ?? ""}
            onChange={(e) => setNoteDialog((prev) => prev ? { ...prev, note: e.target.value } : null)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setNoteDialog(null)}>Cancel</Button>
            <Button
              disabled={!noteDialog || noteDialog.note.trim().length === 0 || noteMutation.isPending}
              onClick={() => noteDialog && noteMutation.mutate({ id: noteDialog.incidentId, note: noteDialog.note })}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
