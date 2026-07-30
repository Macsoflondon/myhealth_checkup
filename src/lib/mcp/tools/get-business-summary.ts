import { defineTool } from "@lovable.dev/mcp-js";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

export default defineTool({
  name: "get_business_summary",
  title: "Get business summary",
  description:
    "Aggregate commercial totals: order count and value, newsletter subscriber count, and total registered users as a bare number. Aggregates only — never individual records, names or email addresses.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;
    const { client } = session;

    const [orders, subscribers, activeSubscribers, users] = await Promise.all([
      client.from("orders").select("price, status, order_date").limit(50000),
      client.from("newsletter_subscribers").select("id", { count: "exact", head: true }),
      client.from("newsletter_subscribers").select("id", { count: "exact", head: true }).eq("status", "active"),
      client.rpc("get_registered_user_count"),
    ]);

    const firstError = orders.error ?? subscribers.error ?? activeSubscribers.error ?? users.error;
    if (firstError) return fail(firstError.message);

    const rows = (orders.data ?? []) as Array<{ price: number | null; status: string | null; order_date: string | null }>;
    const totalValue = rows.reduce((sum, r) => sum + (r.price ?? 0), 0);
    const byStatus = new Map<string, { orders: number; value: number }>();
    for (const r of rows) {
      const key = r.status ?? "unknown";
      const entry = byStatus.get(key) ?? { orders: 0, value: 0 };
      entry.orders += 1;
      entry.value += r.price ?? 0;
      byStatus.set(key, entry);
    }

    await logAdminToolCall(session, "get_business_summary", {});
    return ok({
      orders_total: rows.length,
      orders_total_value_gbp: Number(totalValue.toFixed(2)),
      average_order_value_gbp: rows.length ? Number((totalValue / rows.length).toFixed(2)) : 0,
      orders_by_status: Object.fromEntries(
        [...byStatus.entries()].map(([k, v]) => [k, { orders: v.orders, value_gbp: Number(v.value.toFixed(2)) }]),
      ),
      newsletter_subscribers_total: subscribers.count ?? 0,
      newsletter_subscribers_active: activeSubscribers.count ?? 0,
      registered_users_total: typeof users.data === "number" ? users.data : 0,
    });
  },
});
