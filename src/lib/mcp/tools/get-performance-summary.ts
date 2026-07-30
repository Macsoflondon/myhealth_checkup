import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

type VitalRow = { metric: string | null; value: number | null; route: string | null; rating: string | null };

function percentile(sorted: number[], p: number): number | null {
  if (sorted.length === 0) return null;
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return Number(sorted[index].toFixed(3));
}

export default defineTool({
  name: "get_performance_summary",
  title: "Get performance summary",
  description:
    "Aggregate Core Web Vitals (LCP, CLS, INP) percentiles by page route, plus the worst performing routes. Anonymous aggregates only — no patient or personal data.",
  inputSchema: {
    days: z.number().int().min(1).max(90).default(7).describe("Lookback window in days."),
    limit: z.number().int().min(1).max(100).default(20).describe("Number of routes to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;
    const since = new Date(Date.now() - args.days * 86_400_000).toISOString();

    const { data, error } = await session.client
      .from("web_vitals")
      .select("metric, value, route, rating")
      .gte("created_at", since)
      .limit(50000);
    if (error) return fail(error.message);

    const rows = (data ?? []) as VitalRow[];
    const buckets = new Map<string, Map<string, number[]>>();
    const overall = new Map<string, number[]>();

    for (const row of rows) {
      if (row.metric == null || row.value == null) continue;
      const metric = row.metric.toUpperCase();
      const route = row.route ?? "unknown";
      if (!buckets.has(route)) buckets.set(route, new Map());
      const routeBucket = buckets.get(route)!;
      routeBucket.set(metric, [...(routeBucket.get(metric) ?? []), row.value]);
      overall.set(metric, [...(overall.get(metric) ?? []), row.value]);
    }

    const summarise = (values: number[]) => {
      const sorted = [...values].sort((a, b) => a - b);
      return { samples: sorted.length, p50: percentile(sorted, 50), p75: percentile(sorted, 75), p95: percentile(sorted, 95) };
    };

    const byRoute = [...buckets.entries()]
      .map(([route, metrics]) => ({
        route,
        samples: [...metrics.values()].reduce((n, v) => n + v.length, 0),
        metrics: Object.fromEntries([...metrics.entries()].map(([m, v]) => [m, summarise(v)])),
      }))
      .sort((a, b) => b.samples - a.samples)
      .slice(0, args.limit);

    const worstBy = (metric: string) =>
      [...buckets.entries()]
        .map(([route, metrics]) => ({ route, ...summarise(metrics.get(metric) ?? []) }))
        .filter((r) => r.samples >= 5 && r.p75 != null)
        .sort((a, b) => (b.p75 ?? 0) - (a.p75 ?? 0))
        .slice(0, 5);

    await logAdminToolCall(session, "get_performance_summary", args);
    return ok({
      window_days: args.days,
      total_samples: rows.length,
      overall: Object.fromEntries([...overall.entries()].map(([m, v]) => [m, summarise(v)])),
      by_route: byRoute,
      worst_lcp: worstBy("LCP"),
      worst_cls: worstBy("CLS"),
      worst_inp: worstBy("INP"),
    });
  },
});
