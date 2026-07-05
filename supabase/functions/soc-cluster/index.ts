// SOC Batch 1 — incident clustering job.
// Reads recent SOC-relevant events, groups by (source, entity, hour-bucket),
// upserts a single "open" incident per cluster, and logs signal_added events.
//
// Invoked by pg_cron on a short interval and via manual admin trigger.
// Service-role client only; no user input executed as SQL.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

type Severity = "critical" | "high" | "medium" | "low" | "info";

const SEV_RANK: Record<Severity, number> = { critical: 5, high: 4, medium: 3, low: 2, info: 1 };
const higherSeverity = (a: Severity, b: Severity): Severity => (SEV_RANK[a] >= SEV_RANK[b] ? a : b);

interface RawSignal {
  id: string;
  source: string;
  entity: string;
  severity: Severity;
  title: string;
  summary: string;
  occurredAt: string;
}

function normSev(v: unknown): Severity {
  if (typeof v !== "string") return "info";
  const s = v.trim().toLowerCase();
  if (s === "critical" || s === "emergency" || s === "severe") return "critical";
  if (s === "high" || s === "error" || s === "failed") return "high";
  if (s === "warning" || s === "warn" || s === "medium" || s === "denied") return "medium";
  if (s === "low") return "low";
  return "info";
}

function sevFromHttp(status: number | null | undefined): Severity {
  if (typeof status !== "number") return "info";
  if (status >= 500) return "high";
  if (status >= 400) return "medium";
  return "info";
}

function hourBucket(iso: string): string {
  const d = new Date(iso);
  return `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}-${d.getUTCDate()}T${d.getUTCHours()}`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: "server not configured" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const signals: RawSignal[] = [];

  // ---- protected_call_log denied ----
  const { data: denied } = await supabase
    .from("protected_call_log")
    .select("id, function_name, status, caller_id, ip_address, created_at")
    .eq("status", "denied")
    .gte("created_at", since)
    .limit(1000);
  for (const r of denied ?? []) {
    const entity = r.caller_id ?? r.ip_address ?? "unknown";
    signals.push({
      id: r.id,
      source: "protected-call",
      entity,
      severity: "medium",
      title: `Denied protected call · ${r.function_name}`,
      summary: `Caller ${entity} denied on ${r.function_name}`,
      occurredAt: r.created_at,
    });
  }

  // ---- scraper_alerts ----
  const { data: scraperAlerts } = await supabase
    .from("scraper_alerts")
    .select("id, provider_id, alert_type, severity, message, created_at, acknowledged")
    .eq("acknowledged", false)
    .gte("created_at", since)
    .limit(1000);
  for (const r of scraperAlerts ?? []) {
    signals.push({
      id: r.id,
      source: "scraper-alert",
      entity: `${r.provider_id}:${r.alert_type}`,
      severity: normSev(r.severity),
      title: `Scraper alert · ${r.alert_type}`,
      summary: r.message ?? r.alert_type,
      occurredAt: r.created_at,
    });
  }

  // ---- operational_alerts ----
  const { data: opsAlerts } = await supabase
    .from("operational_alerts")
    .select("id, title, message, severity, source, entity_type, entity_name, last_seen_at, is_resolved")
    .eq("is_resolved", false)
    .gte("last_seen_at", since)
    .limit(1000);
  for (const r of opsAlerts ?? []) {
    signals.push({
      id: r.id,
      source: "operational-alert",
      entity: `${r.source}:${r.entity_type ?? "?"}:${r.entity_name ?? "?"}`,
      severity: normSev(r.severity),
      title: r.title,
      summary: r.message ?? r.title,
      occurredAt: r.last_seen_at,
    });
  }

  // ---- edge_function_logs failures ----
  const { data: edgeFails } = await supabase
    .from("edge_function_logs")
    .select("id, function_name, status, error_message, http_status, created_at")
    .or("status.eq.error,http_status.gte.500")
    .gte("created_at", since)
    .limit(1000);
  for (const r of edgeFails ?? []) {
    signals.push({
      id: r.id,
      source: "edge-function",
      entity: r.function_name ?? "unknown",
      severity: r.http_status && r.http_status >= 500 ? "high" : sevFromHttp(r.http_status ?? null),
      title: `Edge function failure · ${r.function_name}`,
      summary: r.error_message ?? `HTTP ${r.http_status}`,
      occurredAt: r.created_at,
    });
  }

  // ---- cron_run_log errors ----
  const { data: cronErr } = await supabase
    .from("cron_run_log")
    .select("id, job_name, status, error_message, started_at")
    .eq("status", "error")
    .gte("started_at", since)
    .limit(500);
  for (const r of cronErr ?? []) {
    signals.push({
      id: r.id,
      source: "cron",
      entity: r.job_name,
      severity: "high",
      title: `Cron failure · ${r.job_name}`,
      summary: r.error_message ?? "cron job failed",
      occurredAt: r.started_at,
    });
  }

  // ---- csp_reports ----
  const { data: cspReports } = await supabase
    .from("csp_reports")
    .select("id, blocked_uri, document_uri, violated_directive, received_at")
    .gte("received_at", since)
    .limit(500);
  for (const r of cspReports ?? []) {
    signals.push({
      id: r.id,
      source: "csp",
      entity: r.violated_directive ?? "csp",
      severity: "low",
      title: `CSP violation · ${r.violated_directive ?? "unknown"}`,
      summary: `${r.blocked_uri ?? ""} on ${r.document_uri ?? ""}`,
      occurredAt: r.received_at,
    });
  }

  // ---- cluster ----
  interface Cluster {
    cluster_key: string;
    source: string;
    entity: string;
    severity: Severity;
    title: string;
    summary: string;
    first_seen_at: string;
    last_seen_at: string;
    signal_ids: string[];
  }

  const clusters = new Map<string, Cluster>();
  for (const s of signals) {
    const bucket = hourBucket(s.occurredAt);
    const key = `${s.source}::${s.entity}::${bucket}`;
    const existing = clusters.get(key);
    if (existing) {
      existing.signal_ids.push(s.id);
      existing.severity = higherSeverity(existing.severity, s.severity);
      if (s.occurredAt < existing.first_seen_at) existing.first_seen_at = s.occurredAt;
      if (s.occurredAt > existing.last_seen_at) existing.last_seen_at = s.occurredAt;
    } else {
      clusters.set(key, {
        cluster_key: key,
        source: s.source,
        entity: s.entity,
        severity: s.severity,
        title: s.title,
        summary: s.summary,
        first_seen_at: s.occurredAt,
        last_seen_at: s.occurredAt,
        signal_ids: [s.id],
      });
    }
  }

  let created = 0;
  let updated = 0;

  for (const c of clusters.values()) {
    const { data: existing } = await supabase
      .from("soc_incidents")
      .select("id, signal_count, sample_signal_ids, severity, last_seen_at")
      .eq("cluster_key", c.cluster_key)
      .in("status", ["open", "acknowledged"])
      .maybeSingle();

    if (existing) {
      const existingIds = new Set<string>(existing.sample_signal_ids ?? []);
      const newIds = c.signal_ids.filter((id) => !existingIds.has(id));
      if (newIds.length === 0) continue;

      const mergedSamples = Array.from(existingIds);
      for (const id of newIds) {
        if (mergedSamples.length >= 20) break;
        mergedSamples.push(id);
      }

      const nextSeverity = higherSeverity(existing.severity as Severity, c.severity);
      const { error: updErr } = await supabase
        .from("soc_incidents")
        .update({
          signal_count: (existing.signal_count ?? 0) + newIds.length,
          sample_signal_ids: mergedSamples,
          severity: nextSeverity,
          last_seen_at: c.last_seen_at,
        })
        .eq("id", existing.id);

      if (!updErr) {
        updated++;
        await supabase.from("soc_incident_events").insert({
          incident_id: existing.id,
          actor_id: null,
          event_type: "signal_added",
          detail: { added: newIds.length, new_ids: newIds.slice(0, 10), severity: nextSeverity },
        });
      }
    } else {
      const { data: ins, error: insErr } = await supabase
        .from("soc_incidents")
        .insert({
          cluster_key: c.cluster_key,
          source: c.source,
          entity: c.entity,
          severity: c.severity,
          status: "open",
          title: c.title,
          summary: c.summary,
          first_seen_at: c.first_seen_at,
          last_seen_at: c.last_seen_at,
          signal_count: c.signal_ids.length,
          sample_signal_ids: c.signal_ids.slice(0, 20),
        })
        .select("id")
        .single();

      if (!insErr && ins) {
        created++;
        await supabase.from("soc_incident_events").insert({
          incident_id: ins.id,
          actor_id: null,
          event_type: "created",
          detail: { signal_count: c.signal_ids.length, source: c.source, entity: c.entity },
        });
      }
    }
  }

  return new Response(
    JSON.stringify({
      ok: true,
      signals_scanned: signals.length,
      clusters: clusters.size,
      incidents_created: created,
      incidents_updated: updated,
      window_since: since,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
