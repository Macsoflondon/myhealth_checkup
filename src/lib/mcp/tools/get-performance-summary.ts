import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { runAdminTool } from "../admin-guard";

export default defineTool({
  name: "get_performance_summary",
  title: "Get performance summary",
  description:
    "Core Web Vitals (LCP, CLS, INP and others) computed in the database over every sample in the window: p50, p75 and p95 per route and metric, the good, needs-improvement and poor share from the stored rating, and the worst routes. Anonymous aggregates; no patient data.",
  inputSchema: {
    days: z.number().int().min(1).max(90).default(7),
    limit: z
      .number()
      .int()
      .min(1)
      .max(100)
      .default(20)
      .describe("Number of routes to return."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "get_performance_summary", args, async ({ client }) => {
      const { data, error } = await client.rpc("mcp_web_vitals_summary", {
        p_days: args.days,
        p_limit: args.limit,
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
