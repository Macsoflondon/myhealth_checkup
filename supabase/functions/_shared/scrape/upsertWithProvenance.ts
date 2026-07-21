/**
 * Per-row upsert into `provider_tests` with provenance + safety rails.
 *
 * Guarantees:
 *  - Sets `last_validated_at` and `scrape_source_url` on every write.
 *  - Refuses to silently overwrite a positive `price` with 0 unless the
 *    caller explicitly asserts `outOfStock: true` (scrape evidence).
 *  - Computes `data_status` from field completeness.
 *  - Emits a history snapshot + change events (via writeHistorySnapshot).
 *  - Never throws — returns { ok, action, warnings, error }.
 */

// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

import { getErrorMessage } from "../errors.ts";
import {
  writeHistorySnapshot,
  type ProviderTestSnapshot,
} from "./history.ts";

export interface UpsertResult {
  ok: boolean;
  action: "inserted" | "updated" | "skipped" | "error";
  providerTestId: string | null;
  warnings: string[];
  error?: string;
}

export interface UpsertOptions {
  scrapeRunId?: string | null;
  outOfStock?: boolean;
  /** If true, we allow price to go from >0 to null (product removed). */
  allowPriceClear?: boolean;
}

const REQUIRED_FIELDS = [
  "price",
  "biomarker_count",
  "biomarkers_list",
  "turnaround_unit",
  "sample_type",
] as const;

function computeStatus(row: Record<string, unknown>): {
  status: "complete" | "partial" | "not_stated";
  score: number;
} {
  let filled = 0;
  for (const f of REQUIRED_FIELDS) {
    const v = row[f];
    if (v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0)) filled++;
  }
  const score = filled / REQUIRED_FIELDS.length;
  if (score === 1) return { status: "complete", score };
  if (score === 0) return { status: "not_stated", score };
  return { status: "partial", score };
}

/**
 * Look up an existing row on (provider_id, provider_test_id) OR
 * (provider_id, test_name) — matches the writable table's uniqueness
 * conventions used by existing scrapers.
 */
async function findExisting(
  supabase: SupabaseClient,
  providerId: string,
  providerTestId: string | null | undefined,
  testName: string,
): Promise<Record<string, unknown> | null> {
  if (providerTestId) {
    const { data } = await supabase
      .from("provider_tests")
      .select("*")
      .eq("provider_id", providerId)
      .eq("provider_test_id", providerTestId)
      .maybeSingle();
    if (data) return data;
  }
  const { data } = await supabase
    .from("provider_tests")
    .select("*")
    .eq("provider_id", providerId)
    .eq("test_name", testName)
    .maybeSingle();
  return data ?? null;
}

export async function upsertWithProvenance(
  supabase: SupabaseClient,
  input: ProviderTestSnapshot & {
    provider_test_id?: string | null;
    url?: string | null;
  },
  opts: UpsertOptions = {},
): Promise<UpsertResult> {
  const warnings: string[] = [];
  const { scrapeRunId = null, outOfStock = false, allowPriceClear = false } = opts;

  try {
    if (!input.provider_id || !input.test_name) {
      return {
        ok: false,
        action: "error",
        providerTestId: null,
        warnings,
        error: "provider_id and test_name are required",
      };
    }

    const existing = await findExisting(
      supabase,
      input.provider_id,
      input.provider_test_id ?? null,
      input.test_name,
    );

    // Safety rail: refuse silent price wipes.
    let safePrice = input.price ?? null;
    if (existing && typeof existing.price === "number" && existing.price > 0) {
      if (safePrice === 0 && !outOfStock) {
        warnings.push("refused to overwrite positive price with 0 (no out-of-stock evidence)");
        safePrice = existing.price as number;
      } else if (safePrice === null && !allowPriceClear) {
        warnings.push("refused to null out positive price without allowPriceClear");
        safePrice = existing.price as number;
      }
    }

    const row: Record<string, unknown> = {
      provider_id: input.provider_id,
      test_name: input.test_name,
      price: safePrice,
      was_price: input.was_price ?? null,
      collection_fee: input.collection_fee ?? null,
      gp_review_fee: input.gp_review_fee ?? null,
      home_visit_fee: input.home_visit_fee ?? null,
      biomarker_count: input.biomarker_count ?? null,
      biomarkers_list: input.biomarkers_list ?? null,
      turnaround_raw: input.turnaround_raw ?? null,
      turnaround_hours: input.turnaround_hours ?? null,
      turnaround_days: input.turnaround_days ?? null,
      turnaround_unit: input.turnaround_unit ?? null,
      sample_type: input.sample_type ?? null,
      collection_method: input.collection_method ?? null,
      in_stock: outOfStock ? false : (input.in_stock ?? true),
      scrape_source_url: input.scrape_source_url ?? input.url ?? null,
      last_validated_at: new Date().toISOString(),
      price_not_stated: safePrice === null,
      biomarkers_not_stated: !Array.isArray(input.biomarkers_list) || (input.biomarkers_list as unknown[]).length === 0,
      turnaround_not_stated: !input.turnaround_unit || input.turnaround_unit === "not_stated",
    };

    if (input.provider_test_id) row.provider_test_id = input.provider_test_id;

    const { status, score } = computeStatus(row);
    row.data_status = status;
    row.field_completeness_score = score;

    let providerTestId: string | null = null;
    let action: UpsertResult["action"];

    if (existing) {
      const { data, error } = await supabase
        .from("provider_tests")
        .update(row)
        .eq("id", existing.id as string)
        .select("id")
        .maybeSingle();
      if (error) throw error;
      providerTestId = (data?.id as string) ?? (existing.id as string);
      action = "updated";
    } else {
      const { data, error } = await supabase
        .from("provider_tests")
        .insert({ ...row, is_active: true })
        .select("id")
        .maybeSingle();
      if (error) throw error;
      providerTestId = (data?.id as string) ?? null;
      action = "inserted";
    }

    // Fire-and-log history snapshot (never blocks the upsert result).
    // NOTE: providerTestId is the uuid PK of provider_tests, which is what
    // provider_test_history.provider_test_id (uuid) expects. The provider's
    // string external id lives in row.provider_test_id — spread it FIRST so
    // the uuid override wins.
    await writeHistorySnapshot(
      supabase,
      { ...input, ...row, provider_test_id: providerTestId } as ProviderTestSnapshot,
      { scrapeRunId, previous: existing },
    );

    return { ok: true, action, providerTestId, warnings };
  } catch (err) {
    return {
      ok: false,
      action: "error",
      providerTestId: null,
      warnings,
      error: getErrorMessage(err),
    };
  }
}
