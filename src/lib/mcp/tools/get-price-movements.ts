import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

type HistoryRow = {
  provider_test_id: string | null;
  provider_id: string | null;
  test_name: string | null;
  price: number | null;
  was_price: number | null;
  total_expected_cost: number | null;
  snapshot_at: string | null;
};

export default defineTool({
  name: "get_price_movements",
  title: "Get price movements",
  description:
    "Recent catalogue price changes from provider test history and the price history log: what moved, by how much, and when. Commercial data only — no patient or personal data.",
  inputSchema: {
    days: z.number().int().min(1).max(365).default(30).describe("Lookback window in days."),
    provider: z.string().trim().optional().describe("Restrict to one provider id."),
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;
    const { client } = session;
    const since = new Date(Date.now() - args.days * 86_400_000).toISOString();

    let historyQuery = client
      .from("provider_test_history")
      .select("provider_test_id, provider_id, test_name, price, was_price, total_expected_cost, snapshot_at")
      .gte("snapshot_at", since)
      .order("snapshot_at", { ascending: false })
      .limit(5000);
    if (args.provider) historyQuery = historyQuery.eq("provider_id", args.provider);

    const [history, priceLog] = await Promise.all([
      historyQuery,
      client
        .from("price_history")
        .select("test_id, provider, old_price, new_price, change_percentage, availability_changed, changed_at")
        .gte("changed_at", since)
        .order("changed_at", { ascending: false })
        .limit(args.limit),
    ]);

    const firstError = history.error ?? priceLog.error;
    if (firstError) return fail(firstError.message);

    // Compare newest vs oldest snapshot per test inside the window.
    const byTest = new Map<string, { newest: HistoryRow; oldest: HistoryRow }>();
    for (const row of (history.data ?? []) as HistoryRow[]) {
      const key = row.provider_test_id ?? `${row.provider_id}:${row.test_name}`;
      const existing = byTest.get(key);
      if (!existing) byTest.set(key, { newest: row, oldest: row });
      else if ((row.snapshot_at ?? "") < (existing.oldest.snapshot_at ?? "")) existing.oldest = row;
    }

    const movements = [...byTest.values()]
      .map(({ newest, oldest }) => {
        const from = oldest.price ?? oldest.total_expected_cost;
        const to = newest.price ?? newest.total_expected_cost;
        if (from == null || to == null || from === to) return null;
        return {
          provider_id: newest.provider_id,
          test_name: newest.test_name,
          from_price: from,
          to_price: to,
          delta: Number((to - from).toFixed(2)),
          change_percentage: from === 0 ? null : Number((((to - from) / from) * 100).toFixed(2)),
          first_seen_at: oldest.snapshot_at,
          last_seen_at: newest.snapshot_at,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
      .slice(0, args.limit);

    await logAdminToolCall(session, "get_price_movements", args);
    return ok({
      window_days: args.days,
      movements_found: movements.length,
      movements,
      price_history_log: priceLog.data ?? [],
    });
  },
});
