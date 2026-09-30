import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { anonClient, fail, ilikeContains, ok, PRICE_NOTE, withAccreditation,
} from "../shared";

export const LISTING_COLUMNS =
  "id, test_name, provider_id, provider_name, biomarker_count, price, collection_fee_type, collection_fee_amount, clinical_review_type, clinical_review_fee, total_expected_cost, turnaround_days_text, sample_type, collection_method, location_options, home_kit_available, clinic_visit_available, url, lab_ukas_accredited, lab_cqc_regulated, lab_iso15189, updated_at";

export const SORTS = {
  price_asc: { column: "total_expected_cost", ascending: true },
  price_desc: { column: "total_expected_cost", ascending: false },
  biomarkers_desc: { column: "biomarker_count", ascending: false },
  name: { column: "test_name", ascending: true },
} as const;

export default defineTool({
  name: "search_tests",
  title: "Search diagnostic tests",
  description:
    "Search the myhealth checkup catalogue of UK private diagnostic tests. The keyword matches the test name or the provider's description. Filter by category slug (see list_categories), provider, maximum total expected cost, minimum biomarker count and collection method. Sorted only by the sort you choose (default price_asc, by total expected cost). Returns every listing field: name, biomarker count, price, collection and clinical review fees, total expected cost, turnaround, sample type, collection method, location options, home kit and clinic availability, provider URL, accreditation flags with accreditation_status and updated_at, plus total_matches.",
  inputSchema: {
    query: z
      .string()
      .trim()
      .max(100)
      .optional()
      .describe("Keyword matched against test name or description."),
    category: z
      .string()
      .trim()
      .optional()
      .describe("Category slug, for example 'womens-health'."),
    provider: z
      .string()
      .trim()
      .optional()
      .describe("Provider id or name, for example 'medichecks'."),
    max_price: z
      .number()
      .positive()
      .optional()
      .describe("Maximum total expected cost in GBP."),
    min_biomarkers: z.number().int().min(1).optional(),
    collection: z.enum(["home_kit", "clinic_visit"]).optional(),
    include_addons: z
      .boolean()
      .default(false)
      .describe("Include add-on tests that cannot be bought alone."),
    sort: z
      .enum(["price_asc", "price_desc", "biomarkers_desc", "name"])
      .default("price_asc"),
    limit: z.number().int().min(1).max(50).default(20),
    offset: z.number().int().min(0).default(0),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async (args) => {
    const sort = SORTS[args.sort];
    let q = anonClient()
      .from("unified_provider_tests")
      .select(LISTING_COLUMNS, { count: "exact" });
    if (args.query) {
      const operand = ilikeContains(args.query);
      q = q.or(`test_name.ilike.${operand},description.ilike.${operand}`);
    }
    if (args.category) q = q.eq("category_primary", args.category);
    if (args.provider) {
      const operand = ilikeContains(args.provider);
      q = q.or(`provider_id.ilike.${operand},provider_name.ilike.${operand}`);
    }
    if (args.max_price != null) q = q.lte("total_expected_cost", args.max_price);
    if (args.min_biomarkers != null)
      q = q.gte("biomarker_count", args.min_biomarkers);
    if (args.collection === "home_kit") q = q.eq("home_kit_available", true);
    if (args.collection === "clinic_visit")
      q = q.eq("clinic_visit_available", true);
    if (!args.include_addons) q = q.eq("is_addon", false);

    const { data, error, count } = await q
      .order(sort.column, { ascending: sort.ascending, nullsFirst: false })
      .order("id", { ascending: true })
      .range(args.offset, args.offset + args.limit - 1);
    if (error) return fail(error.message);
    return ok({
      total_matches: count ?? 0,
      offset: args.offset,
      sort: args.sort,
      results: ((data ?? []) as unknown as Array<Record<string, unknown>>).map((r) => withAccreditation(r)),
      note: PRICE_NOTE,
    });
  },
});
