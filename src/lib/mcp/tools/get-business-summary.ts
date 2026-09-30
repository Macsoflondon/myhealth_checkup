import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { runAdminTool } from "../admin-guard";

export default defineTool({
  name: "get_business_summary",
  title: "Get business summary",
  description:
    "Aggregate commercial totals computed in the database: order count and value for the window, by status and by month, exact newsletter subscriber counts and total registered users as a bare number. Aggregates only; never individual records, names or email addresses.",
  inputSchema: {
    days: z.number().int().min(1).max(3650).default(365),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "get_business_summary", args, async ({ client }) => {
      const [orders, subscribers, activeSubscribers, users] = await Promise.all(
        [
          client.rpc("mcp_business_summary", { p_days: args.days }),
          client
            .from("newsletter_subscribers")
            .select("id", { count: "exact", head: true }),
          client
            .from("newsletter_subscribers")
            .select("id", { count: "exact", head: true })
            .eq("status", "active"),
          client.rpc("get_registered_user_count"),
        ],
      );
      const firstError =
        orders.error ??
        subscribers.error ??
        activeSubscribers.error ??
        users.error;
      if (firstError) return { error: firstError.message };
      return {
        payload: {
          window_days: args.days,
          ...((orders.data ?? {}) as Record<string, unknown>),
          newsletter_subscribers_total: subscribers.count ?? 0,
          newsletter_subscribers_active: activeSubscribers.count ?? 0,
          registered_users_total: Number(users.data ?? 0),
        },
      };
    }),
});
