import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { anonClient, biomarkerNames, fail, ok, PRICE_NOTE, withAccreditation,
} from "../shared";

type CompareRow = {
  id: string;
  test_name: string;
  provider_name: string | null;
  price: number | null;
  collection_fee_type: string | null;
  collection_fee_amount: number | null;
  clinical_review_type: string | null;
  clinical_review_fee: number | null;
  total_expected_cost: number | null;
  turnaround_days_text: string | null;
  sample_type: string | null;
  collection_method: string | null;
  location_options: unknown;
  biomarker_count: number | null;
  biomarkers_list: unknown;
  updated_at: string | null;
};

export function biomarkerOverlap(
  tests: Array<{ id: string; biomarkers: string[] }>,
): { shared: string[]; unique: Record<string, string[]> } {
  const sets = tests.map((t) => ({
    id: t.id,
    map: new Map(t.biomarkers.map((b) => [b.toLowerCase(), b])),
  }));
  const shared =
    sets.length === 0
      ? []
      : [...sets[0].map.entries()]
          .filter(([key]) => sets.every((s) => s.map.has(key)))
          .map(([, label]) => label);
  const unique: Record<string, string[]> = {};
  for (const s of sets) {
    unique[s.id] = [...s.map.entries()]
      .filter(([key]) => sets.every((o) => o.id === s.id || !o.map.has(key)))
      .map(([, label]) => label);
  }
  return { shared, unique };
}

export default defineTool({
  name: "compare_tests",
  title: "Compare tests side by side",
  description:
    "Compare two to five tests by id side by side: price, collection fee, clinical review fee, total expected cost, turnaround, sample method, location options and biomarker counts, plus biomarkers shared by all tests and biomarkers unique to each. Tests are returned in the order given; nothing is ranked.",
  inputSchema: {
    test_ids: z.array(z.string().uuid()).min(2).max(5),
  },
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    openWorldHint: false,
  },
  handler: async ({ test_ids }) => {
    const ids = [...new Set(test_ids)];
    if (ids.length < 2) return fail("Provide at least two different test ids.");
    const { data, error } = await anonClient()
      .from("unified_provider_tests")
      .select(
        "id, test_name, provider_name, price, collection_fee_type, collection_fee_amount, clinical_review_type, clinical_review_fee, total_expected_cost, turnaround_days_text, sample_type, collection_method, location_options, biomarker_count, biomarkers_list, lab_ukas_accredited, lab_cqc_regulated, lab_iso15189, updated_at",
      )
      .in("id", ids);
    if (error) return fail(error.message);
    const byId = new Map(((data ?? []) as CompareRow[]).map((r) => [r.id, r]));
    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length > 0) return fail(`Tests not found: ${missing.join(", ")}`);

    const ordered = ids.map((id) => byId.get(id)!);
    const overlap = biomarkerOverlap(
      ordered.map((r) => ({ id: r.id, biomarkers: biomarkerNames(r.biomarkers_list) })),
    );
    const table = ordered.map(({ biomarkers_list, ...rest }) =>
      withAccreditation({
        ...rest,
        biomarkers_listed: biomarkerNames(biomarkers_list).length,
      }),
    );
    return ok({
      tests: table,
      shared_biomarkers: overlap.shared,
      unique_biomarkers: overlap.unique,
      note: PRICE_NOTE,
    });
  },
});
