import { createServerFn } from "@tanstack/react-start";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  RELATED_TESTS_CACHE_DAYS,
  RELATED_TESTS_INSTRUCTIONS,
  RELATED_TESTS_MODEL,
  RELATED_TESTS_PROMPT_VERSION,
  buildCandidates,
  describeForPrompt,
  toRelatedTest,
  validateRecommendedIds,
  type CatalogueTest,
  type RelatedTest,
} from "@/lib/recommendations/related-tests";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const COLUMNS =
  "id, provider_id, provider_name, test_name, canonical_category:category_primary, biomarkers_list, biomarker_count, price, total_expected_cost";

function publicClient(): SupabaseClient | null {
  const url = process.env["SUPABASE_URL"];
  const key =
    process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (
          key.startsWith("sb_") &&
          headers.get("Authorization") === `Bearer ${key}`
        )
          headers.delete("Authorization");
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

async function loadRows(
  client: SupabaseClient,
  ids: string[],
): Promise<CatalogueTest[]> {
  if (!ids.length) return [];
  const { data } = await client
    .from("unified_provider_tests")
    .select(COLUMNS)
    .in("id", ids);
  return (data ?? []) as CatalogueTest[];
}

async function askModel(
  current: CatalogueTest,
  candidates: CatalogueTest[],
): Promise<string[]> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("missing_api_key");
  const [{ streamText, Output }, { z }, { createLovableResponsesProvider }] =
    await Promise.all([
      import("ai"),
      import("zod"),
      import("@/lib/recommendations/ai-gateway.server"),
    ]);
  const provider = createLovableResponsesProvider(apiKey);
  const result = streamText({
    model: provider.responses(RELATED_TESTS_MODEL),
    system: RELATED_TESTS_INSTRUCTIONS,
    prompt: `Current test:\n${describeForPrompt(current)}\n\nCandidates (id | name | category | biomarkers):\n${candidates.map(describeForPrompt).join("\n")}`,
    output: Output.object({ schema: z.object({ ids: z.array(z.string()) }) }),
    maxRetries: 0,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });
  const output = await result.output;
  return validateRecommendedIds(output.ids, candidates);
}

async function logOperation(entry: {
  testId: string;
  success: boolean;
  latencyMs: number;
  errorType?: string;
}) {
  const { supabaseAdmin } =
    await import("@/integrations/supabase/client.server");
  await supabaseAdmin.from("ai_operation_logs").insert({
    job_type: "related_tests",
    model: RELATED_TESTS_MODEL,
    prompt_version: RELATED_TESTS_PROMPT_VERSION,
    latency_ms: entry.latencyMs,
    success: entry.success,
    error_type: entry.errorType ?? null,
    entity_type: "provider_test",
    entity_id: entry.testId,
    cache_hit: false,
  });
}

/**
 * Complementary tests for a test page. Reads the 7-day cache; on a miss,
 * asks Lovable AI once (catalogue data only, no user data) and stores the ids.
 */
export const getRelatedTests = createServerFn({ method: "GET" })
  .inputValidator((input: unknown): { testId: string } => {
    const testId =
      typeof input === "object" && input !== null && "testId" in input
        ? (input as { testId: unknown }).testId
        : undefined;
    if (typeof testId !== "string" || !UUID.test(testId))
      throw new Error("Invalid test id");
    return { testId };
  })
  .handler(async ({ data }): Promise<{ tests: RelatedTest[] }> => {
    const client = publicClient();
    if (!client) return { tests: [] };

    const [current] = await loadRows(client, [data.testId]);
    if (!current) return { tests: [] };

    const cutoff = Date.now() - RELATED_TESTS_CACHE_DAYS * 86_400_000;
    const { data: cached } = await client
      .from("test_recommendations")
      .select("recommended_ids, generated_at")
      .eq("test_id", data.testId)
      .maybeSingle();
    const cache = cached as {
      recommended_ids: string[];
      generated_at: string;
    } | null;

    let ids: string[] | null =
      cache && new Date(cache.generated_at).getTime() > cutoff
        ? cache.recommended_ids
        : null;

    if (!ids) {
      const { data: pool } = await client
        .from("unified_provider_tests")
        .select(COLUMNS)
        .eq("is_addon", false)
        .gt("price", 0)
        .order("price")
        .limit(600);
      const candidates = buildCandidates(
        current,
        (pool ?? []) as CatalogueTest[],
      );
      if (candidates.length === 0) return { tests: [] };
      const started = Date.now();
      try {
        ids = await askModel(current, candidates);
        try {
          const { supabaseAdmin } =
            await import("@/integrations/supabase/client.server");
          await (supabaseAdmin as unknown as SupabaseClient)
            .from("test_recommendations")
            .upsert({
              test_id: data.testId,
              recommended_ids: ids,
              model: RELATED_TESTS_MODEL,
              prompt_version: RELATED_TESTS_PROMPT_VERSION,
              generated_at: new Date().toISOString(),
            });
        } catch {
          // Cache write is best-effort; never discard valid ids over it.
        }
        await logOperation({
          testId: data.testId,
          success: true,
          latencyMs: Date.now() - started,
        });
      } catch (error) {
        await logOperation({
          testId: data.testId,
          success: false,
          latencyMs: Date.now() - started,
          errorType: error instanceof Error ? error.name : "unknown",
        }).catch(() => undefined);
        // Fall back to a stale cache rather than showing nothing.
        ids = cache?.recommended_ids ?? [];
      }
    }

    const rows = await loadRows(client, ids);
    const byId = new Map(rows.map((r) => [r.id, r]));
    return {
      tests: ids.flatMap((id) => {
        const row = byId.get(id);
        return row ? [toRelatedTest(current, row)] : [];
      }),
    };
  });
