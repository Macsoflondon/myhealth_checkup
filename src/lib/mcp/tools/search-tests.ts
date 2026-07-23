import { createClient } from "@supabase/supabase-js";
import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";

function anonClient() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export default defineTool({
  name: "search_tests",
  title: "Search diagnostic tests",
  description:
    "Search the myhealth checkup catalogue of private UK diagnostic tests. Filter by keyword, category, provider, and price. Returns test name, provider, price (GBP), turnaround, biomarker count, and URL.",
  inputSchema: {
    query: z.string().trim().optional().describe("Keyword to match against test name or description."),
    category: z.string().trim().optional().describe("Category slug (e.g. 'womens-health', 'cancer-screening', 'hormones')."),
    provider: z.string().trim().optional().describe("Provider name (e.g. 'Medichecks', 'Randox', 'Goodbody')."),
    max_price: z.number().positive().optional().describe("Maximum total expected cost in GBP."),
    limit: z.number().int().min(1).max(50).default(20),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, category, provider, max_price, limit }) => {
    let q = anonClient()
      .from("unified_provider_tests")
      .select(
        "id, test_name, provider_name, price, total_expected_cost, category_primary, biomarker_count, turnaround_days_text, sample_type, url",
      )
      .limit(limit);
    if (query) q = q.ilike("test_name", `%${query}%`);
    if (category) q = q.eq("category_primary", category);
    if (provider) q = q.ilike("provider_name", `%${provider}%`);
    if (max_price != null) q = q.lte("total_expected_cost", max_price);

    const { data, error } = await q;
    if (error) {
      return { content: [{ type: "text", text: `Error: ${error.message}` }], isError: true };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? [], null, 2) }],
      structuredContent: { results: data ?? [], count: data?.length ?? 0 },
    };
  },
});
