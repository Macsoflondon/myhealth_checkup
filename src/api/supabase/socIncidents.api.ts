import { supabase } from "@/integrations/supabase/client";
import type { Database, Json } from "@/integrations/supabase/types";
import type { ApiResponse } from "./base";


type IncidentRow = Database["public"]["Tables"]["soc_incidents"]["Row"];
type IncidentEventRow = Database["public"]["Tables"]["soc_incident_events"]["Row"];

export type SocIncidentStatus = "open" | "acknowledged" | "resolved" | "suppressed";
export type SocIncidentSeverity = "critical" | "high" | "medium" | "low" | "info";

export interface SocIncidentListFilters {
  status?: SocIncidentStatus[];
  severity?: SocIncidentSeverity[];
  source?: string[];
  limit?: number;
}

async function currentUserId(): Promise<string | null> {
  const { data } = await supabase.auth.getUser();
  return data.user?.id ?? null;
}

async function logEvent(
  incidentId: string,
  eventType: string,
  detail: Json = {},
): Promise<void> {
  const actor = await currentUserId();
  if (!actor) return;
  await supabase.from("soc_incident_events").insert({
    incident_id: incidentId,
    actor_id: actor,
    event_type: eventType,
    detail,
  });
}


async function list(filters: SocIncidentListFilters = {}): Promise<ApiResponse<IncidentRow[]>> {
  let query = supabase
    .from("soc_incidents")
    .select("*", { count: "exact" })
    .order("last_seen_at", { ascending: false })
    .limit(filters.limit ?? 200);

  if (filters.status && filters.status.length) query = query.in("status", filters.status);
  if (filters.severity && filters.severity.length) query = query.in("severity", filters.severity);
  if (filters.source && filters.source.length) query = query.in("source", filters.source);

  const { data, error, count } = await query;
  return { data: data ?? null, error, count };
}

async function getEvents(incidentId: string): Promise<ApiResponse<IncidentEventRow[]>> {
  const { data, error } = await supabase
    .from("soc_incident_events")
    .select("*")
    .eq("incident_id", incidentId)
    .order("created_at", { ascending: false })
    .limit(100);
  return { data: data ?? null, error };
}

async function acknowledge(incidentId: string): Promise<ApiResponse<IncidentRow>> {
  const actor = await currentUserId();
  const { data, error } = await supabase
    .from("soc_incidents")
    .update({
      status: "acknowledged",
      acknowledged_at: new Date().toISOString(),
      acknowledged_by: actor,
    })
    .eq("id", incidentId)
    .select()
    .single();
  if (!error && data) await logEvent(incidentId, "acknowledged");
  return { data: data ?? null, error };
}

async function assignToSelf(incidentId: string): Promise<ApiResponse<IncidentRow>> {
  const actor = await currentUserId();
  if (!actor) return { data: null, error: new Error("Not authenticated") };
  const { data, error } = await supabase
    .from("soc_incidents")
    .update({ assignee_id: actor })
    .eq("id", incidentId)
    .select()
    .single();
  if (!error && data) await logEvent(incidentId, "assigned", { assignee_id: actor });
  return { data: data ?? null, error };
}

async function unassign(incidentId: string): Promise<ApiResponse<IncidentRow>> {
  const { data, error } = await supabase
    .from("soc_incidents")
    .update({ assignee_id: null })
    .eq("id", incidentId)
    .select()
    .single();
  if (!error && data) await logEvent(incidentId, "unassigned");
  return { data: data ?? null, error };
}

async function resolve(incidentId: string, note: string): Promise<ApiResponse<IncidentRow>> {
  const actor = await currentUserId();
  const trimmed = note.trim();
  if (trimmed.length < 3) return { data: null, error: new Error("Resolution note required (min 3 chars)") };
  const { data, error } = await supabase
    .from("soc_incidents")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
      resolved_by: actor,
      resolution_note: trimmed,
    })
    .eq("id", incidentId)
    .select()
    .single();
  if (!error && data) await logEvent(incidentId, "resolved", { note: trimmed });
  return { data: data ?? null, error };
}

async function reopen(incidentId: string, reason: string): Promise<ApiResponse<IncidentRow>> {
  const trimmed = reason.trim();
  const { data, error } = await supabase
    .from("soc_incidents")
    .update({
      status: "open",
      resolved_at: null,
      resolved_by: null,
      resolution_note: null,
    })
    .eq("id", incidentId)
    .select()
    .single();
  if (!error && data) await logEvent(incidentId, "reopened", { reason: trimmed });
  return { data: data ?? null, error };
}

async function suppress(incidentId: string, reason: string): Promise<ApiResponse<IncidentRow>> {
  const trimmed = reason.trim();
  if (trimmed.length < 3) return { data: null, error: new Error("Suppression reason required") };
  const { data, error } = await supabase
    .from("soc_incidents")
    .update({ status: "suppressed" })
    .eq("id", incidentId)
    .select()
    .single();
  if (!error && data) await logEvent(incidentId, "suppressed", { reason: trimmed });
  return { data: data ?? null, error };
}

async function addNote(incidentId: string, note: string): Promise<ApiResponse<IncidentEventRow>> {
  const trimmed = note.trim();
  if (trimmed.length < 1) return { data: null, error: new Error("Note cannot be empty") };
  const actor = await currentUserId();
  if (!actor) return { data: null, error: new Error("Not authenticated") };
  const detail: Json = { note: trimmed };
  const { data, error } = await supabase
    .from("soc_incident_events")
    .insert({
      incident_id: incidentId,
      actor_id: actor,
      event_type: "note",
      detail,
    })
    .select()
    .single();

  return { data: data ?? null, error };
}

async function triggerCluster(): Promise<ApiResponse<{ incidents_created: number; incidents_updated: number; signals_scanned: number }>> {
  const { data, error } = await supabase.functions.invoke("soc-cluster", { body: {} });
  if (error) return { data: null, error };
  return { data: data as { incidents_created: number; incidents_updated: number; signals_scanned: number }, error: null };
}

function subscribeToChanges(onChange: () => void): () => void {
  const channel = supabase
    .channel("soc-incidents-changes")
    .on("postgres_changes", { event: "*", schema: "public", table: "soc_incidents" }, () => onChange())
    .on("postgres_changes", { event: "*", schema: "public", table: "soc_incident_events" }, () => onChange())
    .subscribe();
  return () => {
    void supabase.removeChannel(channel);
  };
}

export type { IncidentRow as SocIncident, IncidentEventRow as SocIncidentEvent };

export const socIncidentsApi = {
  list,
  getEvents,
  acknowledge,
  assignToSelf,
  unassign,
  resolve,
  reopen,
  suppress,
  addNote,
  triggerCluster,
  subscribeToChanges,
};
