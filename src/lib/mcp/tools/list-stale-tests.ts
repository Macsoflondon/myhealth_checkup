import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { runAdminTool } from "../admin-guard";

export default defineTool({
  name: "list_stale_tests",
  title: "List stale tests",
  description:
    "List the active catalogue records that have never been validated or were last validated more than stale_after_days ago, oldest first, so they can be fixed. Returns total_matches as an exact count. Catalogue data only; no patient data.",
  inputSchema: {
    stale_after_days: z.number().int().min(1).max(365).default(30),
    provider_id: z.string().trim().max(100).optional(),
    limit: z.number().int().min(1).max(200).default(50),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args, ctx) =>
    runAdminTool(ctx, "list_stale_tests", args, async ({ client }) => {
      const cutoff = new Date(
        Date.now() - args.stale_after_days * 86_400_000,
      ).toISOString();
      let q = client
        .from("provider_tests")
        .select(
          "id, provider_id, test_name, price, url, url_verified, last_validated_at, updated_at",
          { count: "exact" },
        )
        .eq("is_active", true)
        .or(`last_validated_at.is.null,last_validated_at.lt.${cutoff}`)
        .order("last_validated_at", { ascending: true, nullsFirst: true })
        .order("id", { ascending: true })
        .limit(args.limit);
      if (args.provider_id) q = q.eq("provider_id", args.provider_id);
      const { data, error, count } = await q;
      if (error) return { error: error.message };
      return {
        payload: {
          stale_after_days: args.stale_after_days,
          total_matches: count ?? 0,
          tests: data ?? [],
        },
      };
    }),
});
