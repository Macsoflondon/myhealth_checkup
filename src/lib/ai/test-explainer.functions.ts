import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { ExplainableTest, TestExplainerResult } from "./test-explainer.server";

/**
 * Public, read-only server functions behind the homepage "Understand any test"
 * panel. Catalogue reads use the publishable key (public SELECT policy); the
 * Claude call stays server-side in test-explainer.server.ts.
 */

const EXPLAINER_COLUMNS =
  "id, provider_name, test_name, description, price, biomarker_count, biomarkers_list, sample_type, collection_method, turnaround_days_text, category_primary, url";

type ExplainerRow = {
  id: string | null;
  provider_name: string | null;
  test_name: string | null;
  description: string | null;
  price: number | null;
  biomarker_count: number | null;
  biomarkers_list: unknown;
  sample_type: string | null;
  collection_method: string | null;
  turnaround_days_text: string | null;
  category_primary: string | null;
  url: string | null;
};

function createPublicClient(): SupabaseClient<Database> | null {
  const url = process.env["SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (
          key.startsWith("sb_") &&
          headers.get("Authorization") === `Bearer ${key}`
        ) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

function toBiomarkerList(value: unknown): string[] | null {
  if (!Array.isArray(value)) return null;
  const list = value.filter((item): item is string => typeof item === "string");
  return list.length > 0 ? list : null;
}

function toExplainableTest(row: ExplainerRow): ExplainableTest | null {
  if (!row.id || !row.test_name || !row.provider_name) return null;
  return {
    id: row.id,
    testName: row.test_name,
    providerName: row.provider_name,
    description: row.description,
    price: row.price,
    biomarkerCount: row.biomarker_count,
    biomarkersList: toBiomarkerList(row.biomarkers_list),
    sampleType: row.sample_type,
    collectionMethod: row.collection_method,
    turnaroundText: row.turnaround_days_text,
    category: row.category_primary,
  };
}

export interface ExplainableTestOption {
  id: string;
  testName: string;
  providerName: string;
  price: number | null;
  biomarkerCount: number | null;
}

/** Bounded list for the homepage picker: real tests with a provider page. */
export const listExplainableTests = createServerFn({ method: "GET" }).handler(
  async (): Promise<ExplainableTestOption[]> => {
    const supabase = createPublicClient();
    if (!supabase) return [];

    const { data, error } = await supabase
      .from("unified_provider_tests")
      .select(EXPLAINER_COLUMNS)
      .eq("is_addon", false)
      .gt("price", 0)
      .not("url", "is", null)
      .not("test_name", "ilike", "%appointment%")
      .not("test_name", "ilike", "%consultation%")
      .order("test_name", { ascending: true })
      .limit(900);

    if (error || !data) return [];

    return (data as unknown as ExplainerRow[]).flatMap((row) => {
      const test = toExplainableTest(row);
      if (!test) return [];
      return [
        {
          id: test.id,
          testName: test.testName,
          providerName: test.providerName,
          price: test.price,
          biomarkerCount: test.biomarkerCount,
        },
      ];
    });
  },
);

export const explainTestForVisitor = createServerFn({ method: "POST" })
  .inputValidator((input: { testId: string }) => {
    if (
      !input ||
      typeof input.testId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(input.testId)
    ) {
      throw new Error("A valid test id is required");
    }
    return { testId: input.testId };
  })
  .handler(async ({ data }): Promise<TestExplainerResult | null> => {
    const supabase = createPublicClient();
    if (!supabase) return null;

    const { data: row, error } = await supabase
      .from("unified_provider_tests")
      .select(EXPLAINER_COLUMNS)
      .eq("id", data.testId)
      .maybeSingle();

    if (error || !row) return null;
    const test = toExplainableTest(row as unknown as ExplainerRow);
    if (!test) return null;

    const request = getRequest();
    const forwarded = request.headers.get("x-forwarded-for");
    const clientIp = forwarded?.split(",")[0]?.trim() || "unknown";

    const { explainTest } = await import("./test-explainer.server");
    return explainTest(test, clientIp);
  });
