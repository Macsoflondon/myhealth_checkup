import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { runAdminTool } from "../admin-guard";

export default defineTool({
  name: "get_affiliate_performance",
  title: "Get affiliate performance",
  description:
    "Affiliate click and conversion totals computed in the database for the last N days: clicks, conversions, conversion rate and commission in GBP, broken down by provider, by placement and by both. Aggregates only; click records hold no IP address, user agent or account details. Commission never influences ranking.",
  inputSchema: {
    days: z.number().int().min(1).max(730).default(30),
    provider: z.string().min(1).max(100).optional(),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "get_affiliate_performance", args, async ({ client }) => {
      const to = new Date();
      const from = new Date(to.getTime() - args.days * 86_400_000);
      const { data, error } = await client.rpc("affiliate_performance", {
        p_from: from.toISOString(),
        p_to: to.toISOString(),
        p_provider: args.provider ?? null,
      });
      if (error) return { error: error.message };
      return {
        payload: {
          window_days: args.days,
          ...((data ?? {}) as Record<string, unknown>),
        },
      };
    }),
});
