import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { runAdminTool } from "../admin-guard";

/** Each check is a PostgREST `or`/filter expression on unified_provider_tests. */
export const DATA_QUALITY_CHECKS: Record<string, string> = {
  missing_biomarkers:
    "biomarker_count.is.null,biomarker_count.eq.0,biomarkers_listed.is.null,biomarkers_listed.eq.0",
  missing_or_placeholder_price: "price.is.null,price.lte.1",
  missing_turnaround: "turnaround_days_text.is.null,turnaround_days_text.eq.",
  url_never_checked: "url_verified.is.null",
  url_failed_check: "url_verified.eq.false",
  missing_collection_fee: "collection_fee_type.is.null",
};

export default defineTool({
  name: "get_data_quality",
  title: "Get data quality",
  description:
    "Exact counts and sample test ids for catalogue data problems: missing biomarkers, missing or placeholder prices (£1 or less), missing turnaround, booking links never checked or failing, and missing collection fee data. Catalogue data only; no patient data.",
  inputSchema: {
    sample_size: z.number().int().min(1).max(50).default(10),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "get_data_quality", args, async ({ client }) => {
      const entries = Object.entries(DATA_QUALITY_CHECKS);
      const results = await Promise.all(
        entries.map(([, filter]) =>
          client
            .from("unified_provider_tests")
            .select("id", { count: "exact" })
            .or(filter)
            .order("id", { ascending: true })
            .limit(args.sample_size),
        ),
      );
      const checks: Record<string, { count: number; sample_ids: string[] }> =
        {};
      for (let i = 0; i < entries.length; i++) {
        const r = results[i];
        if (r.error) return { error: r.error.message };
        checks[entries[i][0]] = {
          count: r.count ?? 0,
          sample_ids: ((r.data ?? []) as Array<{ id: string }>).map(
            (d) => d.id,
          ),
        };
      }
      return { payload: { checks } };
    }),
});
