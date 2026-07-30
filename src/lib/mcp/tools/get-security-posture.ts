import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

export default defineTool({
  name: "get_security_posture",
  title: "Get security posture",
  description:
    "Latest security scan snapshot metadata, open SOC incidents by severity, and recent CSP violation counts. Counts and metadata only — no patient data, no secrets.",
  inputSchema: {
    days: z.number().int().min(1).max(90).default(7).describe("Lookback window in days for CSP reports."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;
    const { client } = session;
    const since = new Date(Date.now() - args.days * 86_400_000).toISOString();

    const [snapshot, incidents, csp] = await Promise.all([
      client
        .from("security_scan_snapshots")
        .select("id, scanned_at, total_findings, error_count, warn_count, has_diff, added_findings, removed_findings, modified_findings, acknowledged_at")
        .order("scanned_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      client
        .from("soc_incidents")
        .select("id, cluster_key, source, entity, severity, status, title, signal_count, first_seen_at, last_seen_at")
        .neq("status", "resolved")
        .order("last_seen_at", { ascending: false })
        .limit(100),
      client.from("csp_reports").select("violated_directive, blocked_uri, received_at").gte("received_at", since).limit(2000),
    ]);

    const firstError = snapshot.error ?? incidents.error ?? csp.error;
    if (firstError) return fail(firstError.message);

    const bySeverity = new Map<string, number>();
    for (const i of incidents.data ?? []) {
      const key = (i as { severity: string | null }).severity ?? "unknown";
      bySeverity.set(key, (bySeverity.get(key) ?? 0) + 1);
    }
    const cspByDirective = new Map<string, number>();
    for (const r of csp.data ?? []) {
      const key = (r as { violated_directive: string | null }).violated_directive ?? "unknown";
      cspByDirective.set(key, (cspByDirective.get(key) ?? 0) + 1);
    }

    const snap = snapshot.data as
      | {
          added_findings: unknown;
          removed_findings: unknown;
          modified_findings: unknown;
          [key: string]: unknown;
        }
      | null;

    await logAdminToolCall(session, "get_security_posture", args);
    return ok({
      window_days: args.days,
      latest_scan: snap
        ? {
            scanned_at: snap.scanned_at,
            total_findings: snap.total_findings,
            error_count: snap.error_count,
            warn_count: snap.warn_count,
            has_diff: snap.has_diff,
            acknowledged_at: snap.acknowledged_at,
            added_findings: Array.isArray(snap.added_findings) ? snap.added_findings.length : 0,
            removed_findings: Array.isArray(snap.removed_findings) ? snap.removed_findings.length : 0,
            modified_findings: Array.isArray(snap.modified_findings) ? snap.modified_findings.length : 0,
          }
        : null,
      open_incidents_total: incidents.data?.length ?? 0,
      open_incidents_by_severity: Object.fromEntries(bySeverity),
      open_incidents: incidents.data ?? [],
      csp_reports_total: csp.data?.length ?? 0,
      csp_reports_by_directive: Object.fromEntries(
        [...cspByDirective.entries()].sort((a, b) => b[1] - a[1]),
      ),
    });
  },
});
