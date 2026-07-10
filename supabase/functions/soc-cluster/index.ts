// SOC clustering job — Batch 1 base + Batch 2 (baselines + pattern rules).
// Runs every 5 minutes via pg_cron.

import { createClient, SupabaseClient } from "npm:@supabase/supabase-js@2";

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

async function collectSignals(supabase: SupabaseClient, since: string): Promise<RawSignal[]> {
  const signals: RawSignal[] = [];

  const { data: denied } = await supabase
    .from("protected_call_log")
    .select("id, function_name, status, caller_id, ip_address, created_at")
    .eq("status", "denied")
    .gte("created_at", since)
    .limit(1000);
  for (const r of denied ?? []) {
    const entity = r.caller_id ?? r.ip_address ?? "unknown";
    signals.push({
      id: r.id, source: "protected-call", entity, severity: "medium",
      title: `Denied protected call · ${r.function_name}`,
      summary: `Caller ${entity} denied on ${r.function_name}`,
      occurredAt: r.created_at,
    });
  }

  const { data: scraperAlerts } = await supabase
    .from("scraper_alerts")
    .select("id, provider_id, alert_type, severity, message, created_at, acknowledged")
    .eq("acknowledged", false)
    .gte("created_at", since)
    .limit(1000);
  for (const r of scraperAlerts ?? []) {
    signals.push({
      id: r.id, source: "scraper-alert",
      entity: `${r.provider_id}:${r.alert_type}`,
      severity: normSev(r.severity),
      title: `Scraper alert · ${r.alert_type}`,
      summary: r.message ?? r.alert_type,
      occurredAt: r.created_at,
    });
  }

  const { data: opsAlerts } = await supabase
    .from("operational_alerts")
    .select("id, title, message, severity, source, entity_type, entity_name, last_seen_at, is_resolved")
    .eq("is_resolved", false)
    .gte("last_seen_at", since)
    .limit(1000);
  for (const r of opsAlerts ?? []) {
    signals.push({
      id: r.id, source: "operational-alert",
      entity: `${r.source}:${r.entity_type ?? "?"}:${r.entity_name ?? "?"}`,
      severity: normSev(r.severity),
      title: r.title,
      summary: r.message ?? r.title,
      occurredAt: r.last_seen_at,
    });
  }

  const { data: edgeFails } = await supabase
    .from("edge_function_logs")
    .select("id, function_name, status, error_message, http_status, created_at")
    .or("status.eq.error,http_status.gte.500")
    .gte("created_at", since)
    .limit(1000);
  for (const r of edgeFails ?? []) {
    signals.push({
      id: r.id, source: "edge-function",
      entity: r.function_name ?? "unknown",
      severity: r.http_status && r.http_status >= 500 ? "high" : sevFromHttp(r.http_status ?? null),
      title: `Edge function failure · ${r.function_name}`,
      summary: r.error_message ?? `HTTP ${r.http_status}`,
      occurredAt: r.created_at,
    });
  }

  const { data: cronErr } = await supabase
    .from("cron_run_log")
    .select("id, job_name, status, error_message, started_at")
    .eq("status", "error")
    .gte("started_at", since)
    .limit(500);
  for (const r of cronErr ?? []) {
    signals.push({
      id: r.id, source: "cron", entity: r.job_name, severity: "high",
      title: `Cron failure · ${r.job_name}`,
      summary: r.error_message ?? "cron job failed",
      occurredAt: r.started_at,
    });
  }

  const { data: cspReports } = await supabase
    .from("csp_reports")
    .select("id, blocked_uri, document_uri, violated_directive, received_at")
    .gte("received_at", since)
    .limit(500);
  for (const r of cspReports ?? []) {
    signals.push({
      id: r.id, source: "csp",
      entity: r.violated_directive ?? "csp", severity: "low",
      title: `CSP violation · ${r.violated_directive ?? "unknown"}`,
      summary: `${r.blocked_uri ?? ""} on ${r.document_uri ?? ""}`,
      occurredAt: r.received_at,
    });
  }

  return signals;
}

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

function clusterSignals(signals: RawSignal[]): Cluster[] {
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
        source: s.source, entity: s.entity, severity: s.severity,
        title: s.title, summary: s.summary,
        first_seen_at: s.occurredAt, last_seen_at: s.occurredAt,
        signal_ids: [s.id],
      });
    }
  }
  return Array.from(clusters.values());
}

async function upsertIncident(
  supabase: SupabaseClient,
  c: Cluster,
): Promise<"created" | "updated" | "skipped"> {
  const { data: existing } = await supabase
    .from("soc_incidents")
    .select("id, signal_count, sample_signal_ids, severity, last_seen_at")
    .eq("cluster_key", c.cluster_key)
    .in("status", ["open", "acknowledged"])
    .maybeSingle();

  if (existing) {
    const existingIds = new Set<string>(existing.sample_signal_ids ?? []);
    const newIds = c.signal_ids.filter((id) => !existingIds.has(id));
    if (newIds.length === 0) return "skipped";
    const mergedSamples = Array.from(existingIds);
    for (const id of newIds) {
      if (mergedSamples.length >= 20) break;
      mergedSamples.push(id);
    }
    const nextSeverity = higherSeverity(existing.severity as Severity, c.severity);
    const { error } = await supabase.from("soc_incidents").update({
      signal_count: (existing.signal_count ?? 0) + newIds.length,
      sample_signal_ids: mergedSamples,
      severity: nextSeverity,
      last_seen_at: c.last_seen_at,
    }).eq("id", existing.id);
    if (error) return "skipped";
    await supabase.from("soc_incident_events").insert({
      incident_id: existing.id, actor_id: null, event_type: "signal_added",
      detail: { added: newIds.length, new_ids: newIds.slice(0, 10), severity: nextSeverity },
    });
    return "updated";
  }

  const { data: ins, error } = await supabase.from("soc_incidents").insert({
    cluster_key: c.cluster_key, source: c.source, entity: c.entity,
    severity: c.severity, status: "open", title: c.title, summary: c.summary,
    first_seen_at: c.first_seen_at, last_seen_at: c.last_seen_at,
    signal_count: c.signal_ids.length, sample_signal_ids: c.signal_ids.slice(0, 20),
  }).select("id").single();

  if (error || !ins) return "skipped";
  await supabase.from("soc_incident_events").insert({
    incident_id: ins.id, actor_id: null, event_type: "created",
    detail: { signal_count: c.signal_ids.length, source: c.source, entity: c.entity },
  });
  return "created";
}

// ============ COR-2 anomaly baselines ============
// Compare last-1h signal volume per (source,entity) to prior 7-day hourly mean.
// Flag ≥ 4x baseline AND ≥ 5 signals as an "anomaly::" cluster incident.
async function detectAnomalies(supabase: SupabaseClient): Promise<Cluster[]> {
  const nowIso = new Date().toISOString();
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  // Count last-hour signals grouped by (source, entity) — reuse the collection logic
  const recentSignals = await collectSignals(supabase, oneHourAgo);
  const recentCounts = new Map<string, { source: string; entity: string; count: number; last: string; sev: Severity }>();
  for (const s of recentSignals) {
    const key = `${s.source}::${s.entity}`;
    const rec = recentCounts.get(key);
    if (rec) {
      rec.count++;
      if (s.occurredAt > rec.last) rec.last = s.occurredAt;
      rec.sev = higherSeverity(rec.sev, s.severity);
    } else {
      recentCounts.set(key, { source: s.source, entity: s.entity, count: 1, last: s.occurredAt, sev: s.severity });
    }
  }

  // 7-day baseline: hourly-average per (source,entity)
  const baselineSignals = await collectSignals(supabase, sevenDaysAgo);
  const baselineCounts = new Map<string, number>();
  for (const s of baselineSignals) {
    const key = `${s.source}::${s.entity}`;
    baselineCounts.set(key, (baselineCounts.get(key) ?? 0) + 1);
  }

  const anomalies: Cluster[] = [];
  for (const [key, rec] of recentCounts) {
    if (rec.count < 5) continue;
    const baselineHourly = (baselineCounts.get(key) ?? 0) / (7 * 24);
    const expected = Math.max(baselineHourly, 0.5);
    const ratio = rec.count / expected;
    if (ratio < 4) continue;

    anomalies.push({
      cluster_key: `anomaly::${key}::${hourBucket(nowIso)}`,
      source: rec.source, entity: rec.entity,
      severity: rec.count >= 20 ? "critical" : "high",
      title: `Anomaly · ${rec.count} ${rec.source} signals for ${rec.entity}`,
      summary: `${rec.count} signals in last hour vs baseline of ${expected.toFixed(2)}/h (ratio ${ratio.toFixed(1)}x)`,
      first_seen_at: oneHourAgo,
      last_seen_at: rec.last,
      signal_ids: recentSignals.filter((s) => s.source === rec.source && s.entity === rec.entity).map((s) => s.id).slice(0, 20),
    });
  }
  return anomalies;
}

// ============ COR-4 pattern rules ============
// Hand-written detectors that fuse multiple sources.
async function detectPatterns(supabase: SupabaseClient): Promise<Cluster[]> {
  const patterns: Cluster[] = [];
  const now = new Date();
  const nowIso = now.toISOString();
  const fifteenMinAgo = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();

  // Pattern 1: role granted + protected-call denial spike from same actor within 1h
  const { data: recentGrants } = await supabase
    .from("role_audit_log")
    .select("id, actor_id, target_user_id, role, created_at")
    .eq("action", "granted")
    .gte("created_at", oneHourAgo)
    .limit(50);
  for (const g of recentGrants ?? []) {
    if (!g.target_user_id) continue;
    const { count } = await supabase
      .from("protected_call_log")
      .select("id", { count: "exact", head: true })
      .eq("caller_id", g.target_user_id)
      .eq("status", "denied")
      .gte("created_at", g.created_at);
    if ((count ?? 0) >= 3) {
      patterns.push({
        cluster_key: `pattern::role-grant-abuse::${g.target_user_id}::${hourBucket(nowIso)}`,
        source: "operational-alert",
        entity: `user:${g.target_user_id}`,
        severity: "high",
        title: `Pattern · role grant followed by ${count} denied calls`,
        summary: `User ${g.target_user_id} was granted role ${g.role} at ${g.created_at} and then triggered ${count} denied protected calls`,
        first_seen_at: g.created_at,
        last_seen_at: nowIso,
        signal_ids: [g.id],
      });
    }
  }

  // Pattern 2: same caller_id denied ≥5 times across ≥2 distinct functions in 15 min
  const { data: denials } = await supabase
    .from("protected_call_log")
    .select("id, caller_id, ip_address, function_name, created_at")
    .eq("status", "denied")
    .gte("created_at", fifteenMinAgo)
    .limit(1000);
  const grouped = new Map<string, { fns: Set<string>; ids: string[]; last: string }>();
  for (const d of denials ?? []) {
    const key = d.caller_id ?? d.ip_address ?? "anon";
    const rec = grouped.get(key) ?? { fns: new Set<string>(), ids: [], last: d.created_at };
    rec.fns.add(d.function_name ?? "unknown");
    rec.ids.push(d.id);
    if (d.created_at > rec.last) rec.last = d.created_at;
    grouped.set(key, rec);
  }
  for (const [caller, rec] of grouped) {
    if (rec.ids.length >= 5 && rec.fns.size >= 2) {
      patterns.push({
        cluster_key: `pattern::caller-fanout::${caller}::${hourBucket(nowIso)}`,
        source: "protected-call",
        entity: caller,
        severity: "high",
        title: `Pattern · ${rec.ids.length} denied calls across ${rec.fns.size} functions from ${caller}`,
        summary: `Functions probed: ${Array.from(rec.fns).slice(0, 5).join(", ")}`,
        first_seen_at: fifteenMinAgo,
        last_seen_at: rec.last,
        signal_ids: rec.ids.slice(0, 20),
      });
    }
  }

  // Pattern 3: CSP burst — ≥10 distinct blocked URIs in 15 min for same directive
  const { data: csp } = await supabase
    .from("csp_reports")
    .select("id, blocked_uri, violated_directive, received_at")
    .gte("received_at", fifteenMinAgo)
    .limit(500);
  const cspGrouped = new Map<string, { uris: Set<string>; ids: string[]; last: string }>();
  for (const r of csp ?? []) {
    const key = r.violated_directive ?? "unknown";
    const rec = cspGrouped.get(key) ?? { uris: new Set<string>(), ids: [], last: r.received_at };
    if (r.blocked_uri) rec.uris.add(r.blocked_uri);
    rec.ids.push(r.id);
    if (r.received_at > rec.last) rec.last = r.received_at;
    cspGrouped.set(key, rec);
  }
  for (const [directive, rec] of cspGrouped) {
    if (rec.uris.size >= 10) {
      patterns.push({
        cluster_key: `pattern::csp-burst::${directive}::${hourBucket(nowIso)}`,
        source: "csp",
        entity: directive,
        severity: "medium",
        title: `Pattern · CSP burst · ${rec.uris.size} distinct URIs on ${directive}`,
        summary: `${rec.ids.length} reports covering ${rec.uris.size} unique blocked URIs in the last 15 min`,
        first_seen_at: fifteenMinAgo,
        last_seen_at: rec.last,
        signal_ids: rec.ids.slice(0, 20),
      });
    }
  }

  return patterns;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const url = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) {
    return new Response(JSON.stringify({ error: "server not configured" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // AuthN: accept cron secret header, service-role bearer, or admin JWT.
  const cronSecret = Deno.env.get("SCRAPER_CRON_SECRET") ?? "";
  const cronHeader = req.headers.get("x-cron-secret") ?? "";
  const authHeader = req.headers.get("Authorization") ?? "";
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  let allowed = Boolean(cronSecret) && cronHeader === cronSecret;
  if (!allowed && bearer && bearer === serviceKey) allowed = true;
  if (!allowed && bearer) {
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    if (anonKey) {
      const anon = createClient(url, anonKey, { global: { headers: { Authorization: authHeader } } });
      const { data: claimsData } = await anon.auth.getClaims(bearer);
      const uid = claimsData?.claims?.sub as string | undefined;
      if (uid) {
        const svc = createClient(url, serviceKey, { auth: { persistSession: false } });
        const { data: isAdmin } = await svc.rpc("has_role", { _user_id: uid, _role: "admin" });
        allowed = isAdmin === true;
      }
    }
  }
  if (!allowed) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const signals = await collectSignals(supabase, since);
  const baseClusters = clusterSignals(signals);
  const anomalies = await detectAnomalies(supabase);
  const patterns = await detectPatterns(supabase);

  let created = 0, updated = 0;
  for (const c of [...baseClusters, ...anomalies, ...patterns]) {
    const result = await upsertIncident(supabase, c);
    if (result === "created") created++;
    else if (result === "updated") updated++;
  }

  return new Response(JSON.stringify({
    ok: true,
    signals_scanned: signals.length,
    base_clusters: baseClusters.length,
    anomalies: anomalies.length,
    patterns: patterns.length,
    incidents_created: created,
    incidents_updated: updated,
    window_since: since,
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
