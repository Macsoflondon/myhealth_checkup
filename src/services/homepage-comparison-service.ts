import { supabase } from "@/integrations/supabase/client";
import { PROVIDER_NAMES, getSupportedProviderIds } from "@/constants/providers";
import type { CatalogueComparisonPanel } from "@/design-system/live-catalogue-comparison";
import { COMPARE_PANELS } from "@/lib/comparePanels";
import { matchesComparisonName } from "@/lib/homepage-comparisons";
import { describeBiomarkers } from "@/lib/resolve-test-fields";
import {
  formatCollectionFee,
  type CollectionFeeType,
} from "@/lib/comparisonFormat";

interface HomepageComparisonRow {
  id: string | null;
  provider_id: string | null;
  test_name: string | null;
  price: number | null;
  total_expected_cost: number | null;
  biomarker_count: number | null;
  biomarkers_list: unknown;
  turnaround_days_text: string | null;
  updated_at: string | null;
  price_checked_at: string | null;
  clinic_visit_available: boolean | null;
  home_kit_available: boolean | null;
  collection_method: string | null;
  collection_fee_type: string | null;
  collection_fee_amount: number | null;
}

const FEE_TYPES: readonly CollectionFeeType[] = [
  "none",
  "fixed",
  "from",
  "varies",
  "self_arranged",
];

/** Short fee line under each homepage price, from the row's fee rule. */
export function homepageFeeLabel(
  type: string | null,
  amount: number | null,
): string | null {
  const feeType = FEE_TYPES.find((t) => t === type);
  if (!feeType || feeType === "none") return null;
  const { label } = formatCollectionFee(feeType, amount);
  if (feeType === "fixed" || feeType === "from")
    return `Includes blood draw ${label.replace(/^\+/, "")}`;
  return label;
}

/**
 * Server-side pre-filter: only rows whose name contains a panel fragment.
 * The exact word-boundary match still runs below; this just stops the
 * homepage downloading the whole catalogue (about 100 KB) to keep a few rows.
 */
const PANEL_NAME_FILTER = [
  ...new Set(
    Object.values(COMPARE_PANELS).flatMap((config) => config.includeNames),
  ),
]
  .map((fragment) => `test_name.ilike.%${fragment}%`)
  .join(",");

export async function getHomepageComparisonPanels(): Promise<
  CatalogueComparisonPanel[]
> {
  const { data, error } = await supabase
    .from("unified_provider_tests")
    .select(
      "id, provider_id, test_name, price, total_expected_cost, biomarker_count, biomarkers_list, turnaround_days_text, updated_at, price_checked_at, clinic_visit_available, home_kit_available, collection_method, collection_fee_type, collection_fee_amount",
    )
    .eq("is_addon", false)
    .not("test_name", "ilike", "blood draw appointment")
    .in("provider_id", getSupportedProviderIds())
    .gt("price", 0)
    .or(PANEL_NAME_FILTER)
    .limit(2000)
    .returns<HomepageComparisonRow[]>();
  if (error) throw error;
  return Object.entries(COMPARE_PANELS).flatMap(([slug, config]) => {
    const matches = (data ?? []).filter((row) => {
      const name = (row.test_name ?? "").toLowerCase();
      return (
        config.includeNames.some((fragment) =>
          matchesComparisonName(name, fragment),
        ) &&
        !(config.excludeNames ?? []).some((fragment) => name.includes(fragment))
      );
    });
    const clinic = matches.filter(
      (row) =>
        row.clinic_visit_available ||
        /clinic/.test(row.collection_method ?? ""),
    );
    const home = matches.filter(
      (row) => row.home_kit_available || row.collection_method === "home_kit",
    );
    const providerCount = (rows: typeof matches) =>
      new Set(rows.map((row) => row.provider_id)).size;
    const chosen =
      providerCount(clinic) >= 2
        ? clinic
        : providerCount(home) >= 2
          ? home
          : [];
    const rows = chosen
      .flatMap((row) => {
        const price = row.total_expected_cost;
        if (
          !row.id ||
          !row.provider_id ||
          !row.test_name ||
          price === null ||
          !Number.isFinite(price) ||
          price <= 0
        )
          return [];
        const markers = describeBiomarkers(row);
        return [
          {
            id: row.id,
            provider: PROVIDER_NAMES[row.provider_id] ?? row.provider_id,
            testName: row.test_name,
            price,
            biomarkers: markers.count,
            biomarkerLabel: markers.label,
            turnaround: row.turnaround_days_text,
            priceCheckedAt: row.price_checked_at,
            feeLabel: homepageFeeLabel(
              row.collection_fee_type,
              row.collection_fee_amount,
            ),
          },
        ];
      })
      .sort((a, b) => a.price - b.price);
    const cheapest = [
      ...new Map(
        rows
          .slice()
          .reverse()
          .map((row) => [row.provider, row]),
      ).values(),
    ]
      .sort((a, b) => a.price - b.price)
      .slice(0, 4);
    if (cheapest.length < 2) return [];
    return [
      {
        slug,
        name: config.label
          .replace("Function", "function")
          .replace("Full Blood Count", "Full blood count")
          .replace("Male Hormone Panel", "Male hormones")
          .replace("Female Hormone Panel", "Female hormones"),
        methodLabel:
          chosen === clinic ? "Clinic blood draw" : "At-home test kit",
        rows: cheapest,
      },
    ];
  });
}
