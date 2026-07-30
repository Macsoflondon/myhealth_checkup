import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

export default defineTool({
  name: "list_scraper_alerts",
  title: "List scraper alerts",
  description:
    "List open scraper alerts (newest first) with severity, provider and counts. Operational data only — no patient or personal data.",
  inputSchema: {
    include_acknowledged: z.boolean().default(false).describe("Include alerts already acknowledged."),
    severity: z.string().trim().optional().describe("Filter to a single severity, e.g. 'critical'."),
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;

    let q = session.client
      .from("scraper_alerts")
      .select(
        "id, provider_id, alert_type, severity, message, current_count, previous_count, expected_min, acknowledged, acknowledged_at, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(args.limit);
    if (!args.include_acknowledged) q = q.eq("acknowledged", false);
    if (args.severity) q = q.eq("severity", args.severity);

    const { data, error } = await q;
    if (error) return fail(error.message);

    await logAdminToolCall(session, "list_scraper_alerts", args);
    return ok({ count: data?.length ?? 0, alerts: data ?? [] });
  },
});
