import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

export interface TestSeoSummary {
  readonly testName: string;
  readonly providerName: string;
  readonly price: number | null;
  readonly biomarkerCount: number | null;
}

/**
 * Fetches the minimum fields required to render unique SSR metadata and
 * structured data for a provider test detail route. Returns null when the
 * test cannot be resolved so the route falls back to slug-derived metadata.
 */
export const fetchTestSeoSummary = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ testId: z.string().min(1) }).parse(data),
  )
  .handler(async ({ data }): Promise<TestSeoSummary | null> => {
    const { data: row, error } = await supabase
      .from("unified_provider_tests")
      .select(
        "test_name, provider_name, price, total_expected_cost, biomarker_count",
      )
      .eq("id", data.testId)
      .maybeSingle();

    if (error || !row) return null;

    return {
      testName: row.test_name ?? "Test details",
      providerName: row.provider_name ?? "",
      // All-in figure (test plus required collection), matching the booking
      // panel; falls back to the headline price when no total is stored.
      price:
        typeof row.total_expected_cost === "number"
          ? row.total_expected_cost
          : typeof row.price === "number"
            ? row.price
            : null,
      biomarkerCount:
        typeof row.biomarker_count === "number" ? row.biomarker_count : null,
    };
  });
