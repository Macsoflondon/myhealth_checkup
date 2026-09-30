import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { truncate } from "../shared";
import { runAdminTool } from "../admin-guard";

export default defineTool({
  name: "list_scraper_alerts",
  title: "List scraper alerts",
  description:
    "List open scraper alerts (newest first) with severity, provider and counts. No patient data; pseudonymous user IDs may be included. Free-text messages are truncated to 200 characters.",
  inputSchema: {
    include_acknowledged: z.boolean().default(false),
    severity: z
      .string()
      .trim()
      .optional()
      .describe("Filter to a single severity, for example 'critical'."),
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "list_scraper_alerts", args, async ({ client }) => {
      let q = client
        .from("scraper_alerts")
        .select(
          "id, provider_id, alert_type, severity, message, current_count, previous_count, expected_min, acknowledged, acknowledged_at, created_at",
          { count: "exact" },
        )
        .order("created_at", { ascending: false })
        .limit(args.limit);
      if (!args.include_acknowledged) q = q.eq("acknowledged", false);
      if (args.severity) q = q.eq("severity", args.severity);
      const { data, error, count } = await q;
      if (error) return { error: error.message };
      const alerts = ((data ?? []) as Array<{ message: string | null }>).map(
        (a) => ({ ...a, message: truncate(a.message) }),
      );
      return { payload: { total: count ?? alerts.length, count: alerts.length, alerts } };
    }),
});
