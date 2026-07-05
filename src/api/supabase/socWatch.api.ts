import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { ApiResponse } from "./base";
import {
  compareSeverityThenTime,
  humaniseToken,
  maskSensitiveIdentifier,
  normaliseSocSeverity,
  severityFromHttpStatus,
  type SocSeverity,
} from "@/lib/socWatchUtils";

type PublicTables = Database["public"]["Tables"];
type TableRow<TableName extends keyof PublicTables> = PublicTables[TableName]["Row"];

type ScraperAlertRow = Pick<
  TableRow<"scraper_alerts">,
  "id" | "provider_id" | "alert_type" | "severity" | "message" | "created_at" | "acknowledged" | "current_count" | "expected_min"
>;

type OperationalAlertRow = Pick<
  TableRow<"operational_alerts">,
  "id" | "title" | "message" | "severity" | "source" | "entity_type" | "entity_name" | "last_seen_at" | "is_resolved" | "occurrence_count"
>;

type SecurityScanRow = Pick<
  TableRow<"security_scan_snapshots">,
  "id" | "total_findings" | "warn_count" | "error_count" | "has_diff" | "scanned_at" | "created_at"
>;

type CspReportRow = Pick<
  TableRow<"csp_reports">,
  "id" | "blocked_uri" | "document_uri" | "violated_directive" | "received_at"
>;

type CronRunRow = Pick<
  TableRow<"cron_run_log">,
  "id" | "job_name" | "status" | "error_message" | "duration_ms" | "started_at" | "finished_at" | "rows_affected"
>;

type EdgeFunctionLogRow = Pick<
  TableRow<"edge_function_logs">,
  "id" | "function_name" | "status" | "error_message" | "http_status" | "duration_ms" | "created_at" | "triggered_by"
>;

type ProtectedCallRow = Pick<
  TableRow<"protected_call_log">,
  "id" | "function_name" | "status" | "caller_id" | "ip_address" | "created_at"
>;

type AuditLogRow = Pick<
  TableRow<"audit_logs">,
  "id" | "action" | "table_name" | "reason_code" | "data_classification" | "created_at" | "user_id"
>;

type RoleAuditRow = Pick<
  TableRow<"role_audit_log">,
  "id" | "action" | "role" | "actor_id" | "target_user_id" | "created_at"
>;

type ApiRateLimitRow = Pick<
  TableRow<"api_rate_limits">,
  "id" | "endpoint" | "client_key" | "request_count" | "window_start"
>;

export type SocSource =
  | "security-scan"
  | "csp"
  | "scraper-alert"
  | "operational-alert"
  | "cron"
  | "edge-function"
  | "protected-call"
  | "audit"
  | "role-audit"
  | "rate-limit";

export interface SocSignal {
  id: string;
  source: SocSource;
  severity: SocSeverity;
  title: string;
  description: string;
  occurredAt: string;
  status: "open" | "resolved" | "logged";
  entity: string;
  evidence: string;
}

export interface SocHealthItem {
  id: string;
  label: string;
  value: string | number;
  severity: SocSeverity;
  detail: string;
}

export interface SocWatchDashboard {
  summary: {
    totalSignals: number;
    criticalOpen: number;
    highOpen: number;
    mediumOpen: number;
    resolvedSignals: number;
    functionFailures: number;
    deniedProtectedCalls: number;
    cspReports: number;
    latestSecurityScanAt: string | null;
    lastUpdatedAt: string;
  };
  signals: SocSignal[];
  timeline: SocSignal[];
  health: SocHealthItem[];
  severityCounts: Record<SocSeverity, number>;
  sourceCounts: Record<SocSource, number>;
  unavailableSources: string[];
}

export interface SocWatchFilters {
  days?: number;
  limit?: number;
}

const DEFAULT_LIMIT = 120;
const WATCHED_TABLES = [
  "scraper_alerts",
  "operational_alerts",
  "security_scan_snapshots",
  "csp_reports",
  "cron_run_log",
  "edge_function_logs",
  "protected_call_log",
  "audit_logs",
  "role_audit_log",
  "api_rate_limits",
] as const;

function emptySeverityCounts(): Record<SocSeverity, number> {
  return { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
}

function emptySourceCounts(): Record<SocSource, number> {
  return {
    "security-scan": 0,
    csp: 0,
    "scraper-alert": 0,
    "operational-alert": 0,
    cron: 0,
    "edge-function": 0,
    "protected-call": 0,
    audit: 0,
    "role-audit": 0,
    "rate-limit": 0,
  };
}

function isOpenSignal(signal: SocSignal): boolean {
  return signal.status === "open";
}

function compactDescription(parts: Array<string | number | null | undefined>): string {
  return parts.filter((part) => part !== null && part !== undefined && String(part).trim().length > 0).join(" · ");
}

function securityScanSignal(row: SecurityScanRow): SocSignal {
  const severity: SocSeverity = row.error_count > 0 ? "high" : row.warn_count > 0 || row.has_diff ? "medium" : "info";
  return {
    id: `security-${row.id}`,
    source: "security-scan",
    severity,
    title: "Security scan snapshot",
    description: compactDescription([
      `${row.total_findings} total findings`,
      `${row.error_count} errors`,
      `${row.warn_count} warnings`,
      row.has_diff ? "baseline changed" : "no baseline change",
    ]),
    occurredAt: row.scanned_at ?? row.created_at,
    status: row.error_count > 0 || row.warn_count > 0 || row.has_diff ? "open" : "logged",
    entity: "Security baseline",
    evidence: row.id,
  };
}

function scraperAlertSignal(row: ScraperAlertRow): SocSignal {
  return {
    id: `scraper-${row.id}`,
    source: "scraper-alert",
    severity: normaliseSocSeverity(row.severity),
    title: humaniseToken(row.alert_type),
    description: compactDescription([row.message, row.current_count != null ? `current ${row.current_count}` : null, row.expected_min != null ? `expected ${row.expected_min}` : null]),
    occurredAt: row.created_at,
    status: row.acknowledged ? "resolved" : "open",
    entity: row.provider_id,
    evidence: row.id,
  };
}

function operationalAlertSignal(row: OperationalAlertRow): SocSignal {
  return {
    id: `ops-${row.id}`,
    source: "operational-alert",
    severity: normaliseSocSeverity(row.severity),
    title: row.title,
    description: compactDescription([row.message, row.occurrence_count != null ? `${row.occurrence_count} occurrences` : null]),
    occurredAt: row.last_seen_at,
    status: row.is_resolved ? "resolved" : "open",
    entity: compactDescription([row.source, row.entity_type, row.entity_name]),
    evidence: row.id,
  };
}

function cspSignal(row: CspReportRow): SocSignal {
  return {
    id: `csp-${row.id}`,
    source: "csp",
    severity: "medium",
    title: "Content Security Policy violation",
    description: compactDescription([row.violated_directive, row.blocked_uri ? `blocked ${row.blocked_uri}` : null]),
    occurredAt: row.received_at,
    status: "logged",
    entity: row.document_uri ?? "Browser policy",
    evidence: row.id,
  };
}

function cronSignal(row: CronRunRow): SocSignal {
  const failed = row.status.toLowerCase() === "error" || row.status.toLowerCase() === "failed";
  return {
    id: `cron-${row.id}`,
    source: "cron",
    severity: failed ? "high" : "info",
    title: `Cron ${humaniseToken(row.status)}`,
    description: compactDescription([row.error_message, row.duration_ms != null ? `${row.duration_ms}ms` : null, row.rows_affected != null ? `${row.rows_affected} rows` : null]),
    occurredAt: row.finished_at ?? row.started_at,
    status: failed ? "open" : "logged",
    entity: row.job_name,
    evidence: row.id,
  };
}

function edgeFunctionSignal(row: EdgeFunctionLogRow): SocSignal {
  const statusSeverity = severityFromHttpStatus(row.http_status);
  const executionSeverity = normaliseSocSeverity(row.status);
  const severity = statusSeverity === "info" ? executionSeverity : statusSeverity;
  const failed = severity === "high" || severity === "medium" || row.error_message != null;
  return {
    id: `edge-${row.id}`,
    source: "edge-function",
    severity,
    title: `Edge function ${humaniseToken(row.status)}`,
    description: compactDescription([row.error_message, row.http_status != null ? `HTTP ${row.http_status}` : null, row.duration_ms != null ? `${row.duration_ms}ms` : null]),
    occurredAt: row.created_at,
    status: failed ? "open" : "logged",
    entity: row.function_name,
    evidence: compactDescription([row.id, row.triggered_by ? `trigger ${maskSensitiveIdentifier(row.triggered_by)}` : null]),
  };
}

function protectedCallSignal(row: ProtectedCallRow): SocSignal {
  const denied = row.status.toLowerCase() === "denied";
  return {
    id: `protected-${row.id}`,
    source: "protected-call",
    severity: denied ? "medium" : "info",
    title: `Protected call ${humaniseToken(row.status)}`,
    description: compactDescription([row.caller_id ? `caller ${maskSensitiveIdentifier(row.caller_id)}` : null, row.ip_address ? `IP ${maskSensitiveIdentifier(row.ip_address)}` : null]),
    occurredAt: row.created_at,
    status: denied ? "open" : "logged",
    entity: row.function_name,
    evidence: row.id,
  };
}

function auditLogSignal(row: AuditLogRow): SocSignal {
  const sensitiveClass = row.data_classification === "C3" || row.data_classification === "C4";
  return {
    id: `audit-${row.id}`,
    source: "audit",
    severity: sensitiveClass ? "medium" : "info",
    title: `${humaniseToken(row.action)} on ${humaniseToken(row.table_name)}`,
    description: compactDescription([row.reason_code ? `reason ${row.reason_code}` : null, row.data_classification ? `class ${row.data_classification}` : null]),
    occurredAt: row.created_at,
    status: "logged",
    entity: row.table_name,
    evidence: maskSensitiveIdentifier(row.user_id),
  };
}

function roleAuditSignal(row: RoleAuditRow): SocSignal {
  const adminChange = row.role === "admin";
  return {
    id: `role-${row.id}`,
    source: "role-audit",
    severity: adminChange ? "high" : "medium",
    title: `${humaniseToken(row.role)} role ${humaniseToken(row.action)}`,
    description: compactDescription([`actor ${maskSensitiveIdentifier(row.actor_id)}`, `target ${maskSensitiveIdentifier(row.target_user_id)}`]),
    occurredAt: row.created_at,
    status: "logged",
    entity: "Access control",
    evidence: row.id,
  };
}

function rateLimitSignal(row: ApiRateLimitRow): SocSignal {
  const severity: SocSeverity = row.request_count >= 100 ? "medium" : row.request_count >= 40 ? "low" : "info";
  return {
    id: `rate-${row.id}`,
    source: "rate-limit",
    severity,
    title: "API rate limit window",
    description: `${row.request_count} requests from ${maskSensitiveIdentifier(row.client_key)}`,
    occurredAt: row.window_start,
    status: severity === "medium" ? "open" : "logged",
    entity: row.endpoint,
    evidence: row.id,
  };
}

function buildDashboard(input: {
  scraperAlerts: ScraperAlertRow[];
  operationalAlerts: OperationalAlertRow[];
  securityScans: SecurityScanRow[];
  cspReports: CspReportRow[];
  cronRuns: CronRunRow[];
  edgeLogs: EdgeFunctionLogRow[];
  protectedCalls: ProtectedCallRow[];
  auditLogs: AuditLogRow[];
  roleAudits: RoleAuditRow[];
  rateLimits: ApiRateLimitRow[];
  unavailableSources: string[];
  limit: number;
}): SocWatchDashboard {
  const signals = [
    ...input.scraperAlerts.map(scraperAlertSignal),
    ...input.operationalAlerts.map(operationalAlertSignal),
    ...input.securityScans.map(securityScanSignal),
    ...input.cspReports.map(cspSignal),
    ...input.cronRuns.map(cronSignal),
    ...input.edgeLogs.map(edgeFunctionSignal),
    ...input.protectedCalls.map(protectedCallSignal),
    ...input.auditLogs.map(auditLogSignal),
    ...input.roleAudits.map(roleAuditSignal),
    ...input.rateLimits.map(rateLimitSignal),
  ].sort(compareSeverityThenTime).slice(0, input.limit);

  const severityCounts = emptySeverityCounts();
  const sourceCounts = emptySourceCounts();
  for (const signal of signals) {
    severityCounts[signal.severity] += 1;
    sourceCounts[signal.source] += 1;
  }

  const openSignals = signals.filter(isOpenSignal);
  const functionFailures = signals.filter((signal) => signal.source === "edge-function" && isOpenSignal(signal)).length;
  const deniedProtectedCalls = input.protectedCalls.filter((row) => row.status.toLowerCase() === "denied").length;
  const failedCronRuns = input.cronRuns.filter((row) => ["error", "failed"].includes(row.status.toLowerCase())).length;

  const health: SocHealthItem[] = [
    {
      id: "security-baseline",
      label: "Security baseline",
      value: input.securityScans[0]?.total_findings ?? "—",
      severity: input.securityScans[0]?.error_count ? "high" : input.securityScans[0]?.warn_count ? "medium" : "info",
      detail: input.securityScans[0]?.scanned_at ? `Latest scan ${input.securityScans[0].scanned_at.slice(0, 10)}` : "No scan snapshot returned",
    },
    {
      id: "edge-functions",
      label: "Edge functions",
      value: functionFailures,
      severity: functionFailures > 0 ? "high" : "info",
      detail: `${input.edgeLogs.length} invocations reviewed`,
    },
    {
      id: "protected-calls",
      label: "Protected calls",
      value: deniedProtectedCalls,
      severity: deniedProtectedCalls >= 5 ? "high" : deniedProtectedCalls > 0 ? "medium" : "info",
      detail: `${input.protectedCalls.length} protected calls reviewed`,
    },
    {
      id: "cron",
      label: "Scheduled jobs",
      value: failedCronRuns,
      severity: failedCronRuns > 0 ? "high" : "info",
      detail: `${input.cronRuns.length} recent job runs reviewed`,
    },
  ];

  return {
    summary: {
      totalSignals: signals.length,
      criticalOpen: openSignals.filter((signal) => signal.severity === "critical").length,
      highOpen: openSignals.filter((signal) => signal.severity === "high").length,
      mediumOpen: openSignals.filter((signal) => signal.severity === "medium").length,
      resolvedSignals: signals.filter((signal) => signal.status === "resolved").length,
      functionFailures,
      deniedProtectedCalls,
      cspReports: input.cspReports.length,
      latestSecurityScanAt: input.securityScans[0]?.scanned_at ?? null,
      lastUpdatedAt: new Date().toISOString(),
    },
    signals,
    timeline: [...signals].sort((left, right) => new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime()).slice(0, 40),
    health,
    severityCounts,
    sourceCounts,
    unavailableSources: input.unavailableSources,
  };
}

export const socWatchApi = {
  async getDashboard(filters: SocWatchFilters = {}): Promise<ApiResponse<SocWatchDashboard>> {
    const days = filters.days ?? 7;
    const limit = filters.limit ?? DEFAULT_LIMIT;
    const sinceIso = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const results = await Promise.all([
      supabase.from("scraper_alerts").select("id, provider_id, alert_type, severity, message, created_at, acknowledged, current_count, expected_min").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(100),
      supabase.from("operational_alerts").select("id, title, message, severity, source, entity_type, entity_name, last_seen_at, is_resolved, occurrence_count").gte("last_seen_at", sinceIso).order("last_seen_at", { ascending: false }).limit(100),
      supabase.from("security_scan_snapshots").select("id, total_findings, warn_count, error_count, has_diff, scanned_at, created_at").gte("scanned_at", sinceIso).order("scanned_at", { ascending: false }).limit(20),
      supabase.from("csp_reports").select("id, blocked_uri, document_uri, violated_directive, received_at").gte("received_at", sinceIso).order("received_at", { ascending: false }).limit(100),
      supabase.from("cron_run_log").select("id, job_name, status, error_message, duration_ms, started_at, finished_at, rows_affected").gte("started_at", sinceIso).order("started_at", { ascending: false }).limit(100),
      supabase.from("edge_function_logs").select("id, function_name, status, error_message, http_status, duration_ms, created_at, triggered_by").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(100),
      supabase.from("protected_call_log").select("id, function_name, status, caller_id, ip_address, created_at").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(100),
      supabase.from("audit_logs").select("id, action, table_name, reason_code, data_classification, created_at, user_id").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(80),
      supabase.from("role_audit_log").select("id, action, role, actor_id, target_user_id, created_at").gte("created_at", sinceIso).order("created_at", { ascending: false }).limit(80),
      supabase.from("api_rate_limits").select("id, endpoint, client_key, request_count, window_start").gte("window_start", sinceIso).order("window_start", { ascending: false }).limit(80),
    ]);

    const unavailableSources = WATCHED_TABLES.filter((_, index) => results[index]?.error);
    const firstError = results.find((result) => result.error)?.error ?? null;

    const data = buildDashboard({
      scraperAlerts: (results[0].data ?? []) as ScraperAlertRow[],
      operationalAlerts: (results[1].data ?? []) as OperationalAlertRow[],
      securityScans: (results[2].data ?? []) as SecurityScanRow[],
      cspReports: (results[3].data ?? []) as CspReportRow[],
      cronRuns: (results[4].data ?? []) as CronRunRow[],
      edgeLogs: (results[5].data ?? []) as EdgeFunctionLogRow[],
      protectedCalls: (results[6].data ?? []) as ProtectedCallRow[],
      auditLogs: (results[7].data ?? []) as AuditLogRow[],
      roleAudits: (results[8].data ?? []) as RoleAuditRow[],
      rateLimits: (results[9].data ?? []) as ApiRateLimitRow[],
      unavailableSources,
      limit,
    });

    return { data, error: firstError, count: data.signals.length };
  },

  subscribeToChanges(onChange: () => void): () => void {
    const channel = supabase.channel("soc-watch-readonly");
    for (const table of WATCHED_TABLES) {
      channel.on("postgres_changes", { event: "*", schema: "public", table }, onChange);
    }
    channel.subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  },
};