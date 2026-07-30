import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { DENIED, fail, logAdminToolCall, ok, requireAdmin } from "../admin-guard";

type TestRow = {
  id: string;
  provider_id: string | null;
  canonical_category: string | null;
  is_active: boolean | null;
  last_validated_at: string | null;
};

export default defineTool({
  name: "get_catalogue_coverage",
  title: "Get catalogue coverage",
  description:
    "Active test counts by provider and by category, plus records whose validation is stale or missing — the freshness signal for the comparison catalogue. No patient or personal data.",
  inputSchema: {
    stale_after_days: z
      .number()
      .int()
      .min(1)
      .max(365)
      .default(30)
      .describe("Treat a test as stale when it has not been validated within this many days."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (args, ctx) => {
    const session = await requireAdmin(ctx);
    if (!session) return DENIED;
    const { client } = session;

    const [tests, categories, mappings] = await Promise.all([
      client
        .from("provider_tests")
        .select("id, provider_id, canonical_category, is_active, last_validated_at")
        .eq("is_active", true)
        .limit(20000),
      client.from("categories").select("id, slug, name, is_active").eq("is_active", true),
      client.from("category_test_mapping").select("category_id", { count: "exact", head: true }),
    ]);

    const firstError = tests.error ?? categories.error ?? mappings.error;
    if (firstError) return fail(firstError.message);

    const rows = (tests.data ?? []) as TestRow[];
    const cutoff = Date.now() - args.stale_after_days * 86_400_000;

    const byProvider = new Map<string, { provider_id: string; active_tests: number; stale: number; never_validated: number }>();
    const byCategory = new Map<string, { canonical_category: string; active_tests: number }>();
    let stale = 0;
    let neverValidated = 0;

    for (const row of rows) {
      const p = row.provider_id ?? "unknown";
      const entry = byProvider.get(p) ?? { provider_id: p, active_tests: 0, stale: 0, never_validated: 0 };
      entry.active_tests += 1;
      if (!row.last_validated_at) {
        entry.never_validated += 1;
        neverValidated += 1;
      } else if (new Date(row.last_validated_at).getTime() < cutoff) {
        entry.stale += 1;
        stale += 1;
      }
      byProvider.set(p, entry);

      const c = row.canonical_category ?? "uncategorised";
      const cat = byCategory.get(c) ?? { canonical_category: c, active_tests: 0 };
      cat.active_tests += 1;
      byCategory.set(c, cat);
    }

    await logAdminToolCall(session, "get_catalogue_coverage", args);
    return ok({
      stale_after_days: args.stale_after_days,
      total_active_tests: rows.length,
      stale_tests: stale,
      never_validated_tests: neverValidated,
      active_categories: categories.data?.length ?? 0,
      category_test_mappings: mappings.count ?? 0,
      by_provider: [...byProvider.values()].sort((a, b) => b.active_tests - a.active_tests),
      by_category: [...byCategory.values()].sort((a, b) => b.active_tests - a.active_tests),
    });
  },
});
