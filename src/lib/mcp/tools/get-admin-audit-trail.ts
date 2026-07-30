import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

export default defineTool({
  name: "get_admin_audit_trail",
  title: "Get admin audit trail",
  description:
    "Recent administrative activity, role changes and audit log entries: action names, actor user IDs and timestamps only. Record payloads are deliberately omitted so no personal data is returned.",
  inputSchema: {
    days: z.number().int().min(1).max(180).default(14).describe("Lookback window in days."),
    limit: z.number().int().min(1).max(200).default(50).describe("Maximum entries per log."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;
    const { client } = session;
    const since = new Date(Date.now() - args.days * 86_400_000).toISOString();

    const [adminLog, roleLog, auditLog] = await Promise.all([
      client
        .from("admin_activity_log")
        .select("id, admin_user_id, action, resource_type, resource_id, success, error_message, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(args.limit),
      client
        .from("role_audit_log")
        .select("id, actor_id, target_user_id, role, action, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(args.limit),
      client
        .from("audit_logs")
        .select("id, user_id, action, table_name, record_id, reason_code, purpose, data_classification, created_at")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(args.limit),
    ]);

    const firstError = adminLog.error ?? roleLog.error ?? auditLog.error;
    if (firstError) return fail(firstError.message);

    await logAdminToolCall(session, "get_admin_audit_trail", args);
    return ok({
      window_days: args.days,
      admin_activity_log: adminLog.data ?? [],
      role_audit_log: roleLog.data ?? [],
      audit_logs: auditLog.data ?? [],
    });
  },
});
