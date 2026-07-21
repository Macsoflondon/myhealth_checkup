/**
 * History + change-event helpers.
 *
 * `writeHistorySnapshot` appends an immutable row to `provider_test_history`
 * on every scrape run so we build a longitudinal dataset. It also diffs the
 * incoming row against the current `provider_tests` row and emits one
 * `scrape_change_events` row per changed field.
 */

// deno-lint-ignore no-explicit-any -- Supabase client is not typed here.
type SupabaseClient = any;

import { getErrorMessage } from "../errors.ts";

/** Fields we track in history + diff for change events. */
export const TRACKED_FIELDS = [
  "price",
  "was_price",
  "collection_fee",
  "gp_review_fee",
  "home_visit_fee",
  "total_expected_cost",
  "biomarker_count",
  "biomarkers_list",
  "turnaround_raw",
  "turnaround_hours",
  "turnaround_days",
  "turnaround_unit",
  "sample_type",
  "collection_method",
  "in_stock",
  "trustpilot_rating",
  "trustpilot_review_count",
  "scrape_source_url",
] as const;

export type TrackedField = typeof TRACKED_FIELDS[number];

export interface ProviderTestSnapshot {
  provider_test_id?: string | null;
  provider_id: string;
  test_name: string;
  price?: number | null;
  was_price?: number | null;
  collection_fee?: number | null;
  gp_review_fee?: number | null;
  home_visit_fee?: number | null;
  total_expected_cost?: number | null;
  biomarker_count?: number | null;
  biomarkers_list?: unknown;
  turnaround_raw?: string | null;
  turnaround_hours?: number | null;
  turnaround_days?: number | null;
  turnaround_unit?: string | null;
  sample_type?: string | null;
  collection_method?: string | null;
  in_stock?: boolean | null;
  trustpilot_rating?: number | null;
  trustpilot_review_count?: number | null;
  scrape_source_url?: string | null;
  raw_payload?: unknown;
}

function eq(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || a === undefined) return b === null || b === undefined;
  if (b === null || b === undefined) return false;
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-9;
  }
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/**
 * Append a snapshot to `provider_test_history` and emit field-level change
 * events. Never throws — returns `{ ok: false, error }` so scraper loops
 * keep running.
 */
export async function writeHistorySnapshot(
  supabase: SupabaseClient,
  snapshot: ProviderTestSnapshot,
  opts: { scrapeRunId?: string | null; previous?: Record<string, unknown> | null } = {},
): Promise<{ ok: true } | { ok: false; error: string }> {
  const { scrapeRunId = null, previous = null } = opts;

  try {
    const historyRow = {
      provider_test_id: snapshot.provider_test_id ?? null,
      provider_id: snapshot.provider_id,
      test_name: snapshot.test_name,
      scrape_run_id: scrapeRunId,
      price: snapshot.price ?? null,
      was_price: snapshot.was_price ?? null,
      collection_fee: snapshot.collection_fee ?? null,
      gp_review_fee: snapshot.gp_review_fee ?? null,
      home_visit_fee: snapshot.home_visit_fee ?? null,
      total_expected_cost: snapshot.total_expected_cost ?? null,
      biomarker_count: snapshot.biomarker_count ?? null,
      biomarkers_list: snapshot.biomarkers_list ?? null,
      turnaround_raw: snapshot.turnaround_raw ?? null,
      turnaround_hours: snapshot.turnaround_hours ?? null,
      turnaround_days: snapshot.turnaround_days ?? null,
      turnaround_unit: snapshot.turnaround_unit ?? null,
      sample_type: snapshot.sample_type ?? null,
      collection_method: snapshot.collection_method ?? null,
      in_stock: snapshot.in_stock ?? null,
      trustpilot_rating: snapshot.trustpilot_rating ?? null,
      trustpilot_review_count: snapshot.trustpilot_review_count ?? null,
      scrape_source_url: snapshot.scrape_source_url ?? null,
      raw_payload: snapshot.raw_payload ?? null,
    };

    const { error: histErr } = await supabase
      .from("provider_test_history")
      .insert(historyRow);
    if (histErr) throw histErr;

    if (previous && snapshot.provider_test_id) {
      const events: Array<Record<string, unknown>> = [];
      for (const field of TRACKED_FIELDS) {
        const oldVal = previous[field];
        const newVal = (historyRow as Record<string, unknown>)[field];
        if (oldVal === undefined && newVal === undefined) continue;
        if (!eq(oldVal, newVal)) {
          events.push({
            provider_test_id: snapshot.provider_test_id,
            provider_id: snapshot.provider_id,
            field_name: field,
            old_value: oldVal ?? null,
            new_value: newVal ?? null,
            scrape_run_id: scrapeRunId,
          });
        }
      }
      if (events.length) {
        const { error: evErr } = await supabase
          .from("scrape_change_events")
          .insert(events);
        if (evErr) {
          console.warn("[history] change events insert failed:", evErr.message);
        }
      }
    }

    return { ok: true };
  } catch (err) {
    const msg = getErrorMessage(err);
    console.error("[history] writeHistorySnapshot failed:", msg);
    return { ok: false, error: msg };
  }
}
