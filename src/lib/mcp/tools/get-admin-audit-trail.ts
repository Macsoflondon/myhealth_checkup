import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { truncate } from "../shared";
import { runAdminTool } from "../admin-guard";

export default defineTool({
  name: "get_admin_audit_trail",
  title: "Get admin audit trail",
  description:
    "Recent administrative activity, role changes and audit log entries: action names, actor and target user IDs, and timestamps. Record payloads are omitted. No patient data; pseudonymous user IDs included. Free-text fields are truncated to 200 characters.",
  inputSchema: {
    days: z.number().int().min(1).max(180).default(14),
    limit: z
      .number()
      .int()
      .min(1)
      .max(200)
      .default(50)
      .describe("Maximum entries per log."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "get_admin_audit_trail", args, async ({ client }) => {
      const since = new Date(Date.now() - args.days * 86_400_000).toISOString();
      const [adminLog, roleLog, auditLog] = await Promise.all([
        client
          .from("admin_activity_log")
          .select(
            "id, admin_user_id, action, resource_type, resource_id, success, error_message, created_at",
          )
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
          .select(
            "id, user_id, action, table_name, record_id, reason_code, purpose, data_classification, created_at",
          )
          .gte("created_at", since)
          .order("created_at", { ascending: false })
          .limit(args.limit),
      ]);
      const firstError = adminLog.error ?? roleLog.error ?? auditLog.error;
      if (firstError) return { error: firstError.message };
      return {
        payload: {
          window_days: args.days,
          admin_activity_log: (
            (adminLog.data ?? []) as Array<{ error_message: string | null }>
          ).map((r) => ({ ...r, error_message: truncate(r.error_message) })),
          role_audit_log: roleLog.data ?? [],
          audit_logs: (
            (auditLog.data ?? []) as Array<{ purpose: string | null }>
          ).map((r) => ({ ...r, purpose: truncate(r.purpose) })),
        },
      };
    }),
});
