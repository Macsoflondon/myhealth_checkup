import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { runAdminTool } from "../admin-guard";

export default defineTool({
  name: "get_price_movements",
  title: "Get price movements",
  description:
    "Catalogue price changes in a window, aggregated in the database so nothing is truncated. Compares the published price at the first and last snapshot in the window (never mixed with total expected cost), and lists price log entries with test names. Filter by provider (applied to both sources), direction and minimum percentage change. Commercial data only; no patient data.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30),
    provider: z.string().trim().max(100).optional().describe("Provider id."),
    direction: z.enum(["up", "down", "any"]).default("any"),
    min_change_percentage: z.number().min(0).max(1000).default(0),
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "get_price_movements", args, async ({ client }) => {
      const { data, error } = await client.rpc("mcp_price_movements", {
        p_days: args.days,
        p_provider: args.provider ?? null,
        p_direction: args.direction,
        p_min_change_percentage: args.min_change_percentage,
        p_limit: args.limit,
      });
      if (error) return { error: error.message };
      return {
        payload: {
          window_days: args.days,
          compared_field: "price",
          ...((data ?? {}) as Record<string, unknown>),
        },
      };
    }),
});
