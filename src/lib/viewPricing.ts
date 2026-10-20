/**
 * Single source of truth for prices, fees and totals shown on the site.
 *
 * Consumers keep their own provider_tests query for non-price metadata and
 * take every price field from the unified_provider_tests view, which applies
 * provider_collection_fee_rules. The view's `id` is provider_tests.id, so the
 * two map 1:1.
 */
import type { QueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  formatCollectionFee,
  type CollectionFeeType,
} from "@/lib/comparisonFormat";

export const VIEW_PRICING_COLUMNS =
  "id, price, collection_fee_type, collection_fee_amount, collection_fee_note, total_expected_cost, price_checked_at";

const IN_CHUNK = 200;

export interface ViewPricing {
  id: string;
  price: number | null;
  collection_fee_type: CollectionFeeType | null;
  collection_fee_amount: number | null;
  collection_fee_note: string | null;
  total_expected_cost: number | null;
  price_checked_at: string | null;
}

export type ViewPricingFields = Omit<ViewPricing, "id">;

const FEE_TYPES: readonly CollectionFeeType[] = [
  "none",
  "fixed",
  "from",
  "varies",
  "self_arranged",
];

const toNum = (v: unknown): number | null => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "" && Number.isFinite(Number(v)))
    return Number(v);
  return null;
};

const toFeeType = (v: unknown): CollectionFeeType | null =>
  typeof v === "string" && (FEE_TYPES as readonly string[]).includes(v)
    ? (v as CollectionFeeType)
    : null;

export function toViewPricing(row: Record<string, unknown>): ViewPricing {
  return {
    id: String(row.id ?? ""),
    price: toNum(row.price),
    collection_fee_type: toFeeType(row.collection_fee_type),
    collection_fee_amount: toNum(row.collection_fee_amount),
    collection_fee_note:
      typeof row.collection_fee_note === "string"
        ? row.collection_fee_note
        : null,
    total_expected_cost: toNum(row.total_expected_cost),
    price_checked_at:
      typeof row.price_checked_at === "string" ? row.price_checked_at : null,
  };
}

/** One request per 200 ids; returns view pricing keyed by provider_tests.id. */
export async function fetchViewPricing(
  ids: readonly string[],
): Promise<Map<string, ViewPricing>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  const out = new Map<string, ViewPricing>();
  for (let i = 0; i < unique.length; i += IN_CHUNK) {
    const chunk = unique.slice(i, i + IN_CHUNK);
    const { data, error } = await supabase
      .from("unified_provider_tests")
      .select(VIEW_PRICING_COLUMNS)
      .in("id", chunk);
    if (error) throw error;
    for (const raw of (data ?? []) as unknown as Record<string, unknown>[]) {
      const p = toViewPricing(raw);
      out.set(p.id, p);
    }
  }
  return out;
}

/** Stable React Query key fragment for a set of ids. */
export function viewPricingKey(ids: readonly string[]): string {
  return Array.from(new Set(ids)).sort().join(",");
}

/** Query options for the pricing request, keyed by the ids it covers. */
export function viewPricingQueryOptions(ids: readonly string[]) {
  return {
    queryKey: ["view-pricing", viewPricingKey(ids)] as const,
    queryFn: async (): Promise<ViewPricing[]> =>
      Array.from((await fetchViewPricing(ids)).values()),
    staleTime: 5 * 60 * 1000,
  };
}

/** Fetch (or reuse cached) view pricing through React Query; one request per consumer. */
export async function loadViewPricing(
  queryClient: QueryClient,
  ids: readonly string[],
): Promise<Map<string, ViewPricing>> {
  if (ids.length === 0) return new Map();
  const rows = await queryClient.fetchQuery(viewPricingQueryOptions(ids));
  return new Map(rows.map((r) => [r.id, r]));
}

/**
 * Overwrite only the price fields on `row`. With no view entry the row keeps
 * its bare price and carries no fee and no total, so nothing built from
 * provider_tests fee columns can be shown.
 */
export function mergeViewPricing<T extends object>(
  row: T,
  pricing: ViewPricing | undefined,
): T & ViewPricingFields {
  if (pricing) {
    return {
      ...row,
      price: pricing.price,
      collection_fee_type: pricing.collection_fee_type,
      collection_fee_amount: pricing.collection_fee_amount,
      collection_fee_note: pricing.collection_fee_note,
      total_expected_cost: pricing.total_expected_cost,
      price_checked_at: pricing.price_checked_at,
    };
  }
  const bare = toNum((row as { price?: unknown }).price);
  return {
    ...row,
    price: bare,
    collection_fee_type: null,
    collection_fee_amount: null,
    collection_fee_note: null,
    total_expected_cost: null,
    price_checked_at: null,
  };
}

/**
 * Merge view pricing into rows that only list active tests: a row with no
 * view entry is dropped rather than shown with an unreconciled price.
 */
export function mergeActiveRows<T extends { id: unknown }>(
  rows: readonly T[],
  pricing: Map<string, ViewPricing>,
): Array<T & ViewPricingFields> {
  const out: Array<T & ViewPricingFields> = [];
  for (const row of rows) {
    const p = pricing.get(String(row.id));
    if (p) out.push(mergeViewPricing(row, p));
  }
  return out;
}

/** Fee added on top of the test price by the view (0 when none). */
export function viewCollectionFee(p: {
  price?: number | null;
  total_expected_cost?: number | null;
}): number | null {
  const price = toNum(p.price);
  const total = toNum(p.total_expected_cost);
  if (price == null || total == null) return null;
  return Math.max(0, Math.round((total - price) * 100) / 100);
}

/** Collection fee label matching the comparison table, or null when there is none. */
export function viewFeeLabel(p: {
  collection_fee_type?: CollectionFeeType | null;
  collection_fee_amount?: number | null;
}): string | null {
  if (!p.collection_fee_type || p.collection_fee_type === "none") return null;
  return formatCollectionFee(p.collection_fee_type, p.collection_fee_amount)
    .label;
}
