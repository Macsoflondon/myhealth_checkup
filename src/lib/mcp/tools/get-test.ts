import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { anonClient, fail, ok, PRICE_NOTE, toNumber   withAccreditation,
} from "../shared";

export const TEST_DETAIL_COLUMNS =
  "id, provider_id, provider_name, test_name, description, is_addon, category_primary, price, original_price, collection_fee_type, collection_fee_amount, clinical_review_type, clinical_review_fee, total_expected_cost, biomarker_count, biomarkers_list, biomarkers_listed, turnaround_days_text, sample_type, collection_method, location_options, home_kit_available, clinic_visit_available, url, url_verified, lab_ukas_accredited, lab_cqc_regulated, lab_iso15189, scraped_at, updated_at";

export type TestDetail = {
  price: unknown;
  total_expected_cost: unknown;
  biomarker_count: unknown;
  biomarkers_listed: unknown;
  url_verified: boolean | null;
  collection_fee_type: string | null;
  turnaround_days_text: string | null;
};

export function testLimitations(t: TestDetail): string[] {
  const out: string[] = [];
  const price = toNumber(t.price);
  if (price == null) out.push("Price is missing.");
  else if (price <= 1) out.push("Price looks like a placeholder and is unverified.");
  if (toNumber(t.total_expected_cost) == null)
    out.push("Total expected cost has not been calculated.");
  const count = toNumber(t.biomarker_count);
  const listed = toNumber(t.biomarkers_listed);
  if (!listed) out.push("The provider's biomarker list has not been captured.");
  else if (count != null && listed < count)
    out.push(
      `Only ${listed} of ${count} biomarkers are listed by name; the list is incomplete.`,
    );
  if (t.url_verified === null)
    out.push("The booking link has not been checked yet.");
  else if (t.url_verified === false)
    out.push("The booking link failed its last check.");
  if (!t.collection_fee_type)
    out.push("Collection fee information has not been captured.");
  if (!t.turnaround_days_text) out.push("Turnaround time is not stated.");
  return out;
}

export default defineTool({
  name: "get_test",
  title: "Get test details",
  description:
    "Fetch the full record for one test by id: provider description (verbatim), full biomarker list, price, collection and clinical review fees, total expected cost, turnaround, sample and collection method, location options, accreditation flags with accreditation_status (confirmed, not_confirmed or failed), provider URL, scraped_at and updated_at, plus a limitations list stating any missing or unverified data.",
  inputSchema: {
    id: z.string().uuid().describe("Test UUID returned by search_tests."),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ id }) => {
    const { data, error } = await anonClient()
      .from("unified_provider_tests")
      .select(TEST_DETAIL_COLUMNS)
      .eq("id", id)
      .maybeSingle();
    if (error) return fail(error.message);
    if (!data) return fail("Not found");
    const test = data as unknown as TestDetail & Record<string, unknown>;
    return ok({ test: withAccreditation(test), limitations: testLimitations(test), note: PRICE_NOTE });
  },
});
