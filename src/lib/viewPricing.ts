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
  "id, provider_id, sample_type, home_kit_available, clinic_visit_available, price, collection_fee_type, collection_fee_amount, collection_fee_note, clinical_review_type, clinical_review_fee, total_expected_cost, price_checked_at";

const IN_CHUNK = 200;

export interface RoutePricing {
  fee: number;
  feeLabel: string | null;
  total: number;
}

export interface CollectionFeeRule {
  provider_id: string;
  route: "any" | "home_kit" | "clinic_only";
  fee_type: CollectionFeeType;
  fee_amount: number | null;
}

export interface ViewPricing {
  id: string;
  price: number | null;
  collection_fee_type: CollectionFeeType | null;
  collection_fee_amount: number | null;
  collection_fee_note: string | null;
  total_expected_cost: number | null;
  price_checked_at: string | null;
  collection_route_pricing?: Partial<
    Record<"home_kit" | "clinic", RoutePricing>
  >;
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

export function toViewPricing(
  row: Record<string, unknown>,
  rules: readonly CollectionFeeRule[] = [],
): ViewPricing {
  const price = toNum(row.price);
  const selectedRoute = row.home_kit_available === true ? "home_kit" : "clinic";
  const selectedFee =
    viewCollectionFee({
      collection_fee_type: toFeeType(row.collection_fee_type),
      collection_fee_amount: toNum(row.collection_fee_amount),
    }) ?? 0;
  const reviewFee =
    typeof row.clinical_review_type === "string" &&
    !["optional", "not_included", "not_available"].includes(
      row.clinical_review_type,
    )
      ? (toNum(row.clinical_review_fee) ?? 0)
      : 0;
  const routes: ViewPricing["collection_route_pricing"] = {};
  for (const route of ["home_kit", "clinic"] as const) {
    const available =
      route === "home_kit"
        ? row.home_kit_available
        : row.clinic_visit_available;
    if (available !== true || price == null) continue;
    if (route === selectedRoute) {
      routes[route] = {
        fee: selectedFee,
        feeLabel: viewFeeLabel({
          collection_fee_type: toFeeType(row.collection_fee_type),
          collection_fee_amount: toNum(row.collection_fee_amount),
        }),
        total:
          toNum(row.total_expected_cost) ?? price + selectedFee + reviewFee,
      };
      continue;
    }
    // The view exposes its cheapest route only. Resolve an additional blood
    // route from the same public rules, never from stale scraper fee columns.
    if (
      row.sample_type != null &&
      !["venous", "finger_prick", "multiple"].includes(String(row.sample_type))
    )
      continue;
    const providerRules = rules.filter(
      (rule) => rule.provider_id === row.provider_id,
    );
    const rule =
      providerRules.find(
        (entry) =>
          entry.route === (route === "clinic" ? "clinic_only" : "home_kit"),
      ) ?? providerRules.find((entry) => entry.route === "any");
    if (!rule) continue;
    const fee =
      viewCollectionFee({
        collection_fee_type: rule.fee_type,
        collection_fee_amount: rule.fee_amount,
      }) ?? 0;
    routes[route] = {
      fee,
      feeLabel: viewFeeLabel({
        collection_fee_type: rule.fee_type,
        collection_fee_amount: rule.fee_amount,
      }),
      total: Math.round((price + fee + reviewFee) * 100) / 100,
    };
  }
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
    collection_route_pricing: routes,
  };
}

/** One request per 200 ids; returns view pricing keyed by provider_tests.id. */
export async function fetchViewPricing(
  ids: readonly string[],
): Promise<Map<string, ViewPricing>> {
  const unique = Array.from(new Set(ids.filter(Boolean)));
  const out = new Map<string, ViewPricing>();
  const rawRows: Record<string, unknown>[] = [];
  for (let i = 0; i < unique.length; i += IN_CHUNK) {
    const chunk = unique.slice(i, i + IN_CHUNK);
    const { data, error } = await supabase
      .from("unified_provider_tests")
      .select(VIEW_PRICING_COLUMNS)
      .in("id", chunk);
    if (error) throw error;
    rawRows.push(...((data ?? []) as unknown as Record<string, unknown>[]));
  }
  const providers = Array.from(
    new Set(
      rawRows
        .filter(
          (row) =>
            row.home_kit_available === true &&
            row.clinic_visit_available === true,
        )
        .map((row) => String(row.provider_id)),
    ),
  );
  const rules: CollectionFeeRule[] = [];
  if (providers.length > 0) {
    const { data, error } = await supabase
      .from("provider_collection_fee_rules")
      .select("provider_id, route, fee_type, fee_amount")
      .in("provider_id", providers);
    if (error) throw error;
    for (const row of data ?? []) {
      const feeType = toFeeType(row.fee_type);
      if (!feeType || !["any", "home_kit", "clinic_only"].includes(row.route))
        continue;
      rules.push({
        provider_id: row.provider_id,
        route: row.route as CollectionFeeRule["route"],
        fee_type: feeType,
        fee_amount: toNum(row.fee_amount),
      });
    }
  }
  for (const raw of rawRows) {
    const p = toViewPricing(raw, rules);
    out.set(p.id, p);
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
      collection_route_pricing: pricing.collection_route_pricing,
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
    collection_route_pricing: {},
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

/** Mandatory collection charge only; the total can also contain clinical review. */
export function viewCollectionFee(p: {
  collection_fee_type?: CollectionFeeType | null;
  collection_fee_amount?: number | null;
}): number | null {
  if (!p.collection_fee_type) return null;
  if (p.collection_fee_type !== "fixed" && p.collection_fee_type !== "from")
    return 0;
  return toNum(p.collection_fee_amount);
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
