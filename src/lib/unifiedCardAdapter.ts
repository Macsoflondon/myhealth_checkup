import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";
import type { UnifiedTestCardProps } from "@/components/cards/UnifiedTestCard";

/** Strip trailing marketing noise from a provider test name. */
export const cleanTestName = (raw: string): string =>
  raw
    .replace(/\s*[-–|].*$/, "")
    .replace(/\s+Blood Test$/i, "")
    .replace(/\s+for Enhanced Health$/i, "")
    .replace(/\s*\| Book Online today$/i, "")
    .trim();

type AdapterOverrides = Partial<
  Pick<
    UnifiedTestCardProps,
    | "category"
    | "categoryColor"
    | "description"
    | "results"
    | "collection"
    | "provider"
    | "rating"
    | "reviews"
    | "badge"
    | "ctaLabel"
  >
>;

/**
 * Map a `ProviderTestCardData` into the canonical subset of
 * `UnifiedTestCardProps` (name, biomarkers, results, collection,
 * price, priceFrom, markers, url, category, testDetails).
 *
 * Callers spread the result and override anything caller-specific
 * (rating/reviews, provider display name, ctaLabel, badge, …).
 */
export function toUnifiedCardProps(
  test: ProviderTestCardData,
  overrides: AdapterOverrides = {}
): Pick<
  UnifiedTestCardProps,
  | "category"
  | "categoryColor"
  | "name"
  | "description"
  | "biomarkers"
  | "results"
  | "collection"
  | "price"
  | "priceFrom"
  | "markers"
  | "url"
  | "testDetails"
> &
  AdapterOverrides {
  return {
    category: test.category ?? "Health",
    categoryColor: test.categoryColor ?? undefined,
    name: cleanTestName(test.test_name),
    description: test.description ?? "",
    biomarkers: test.biomarker_count ?? 0,
    results: test.turnaround_days_text ?? "2–5 working days",
    collection: test.sample_type ?? "Blood sample",
    price: test.price ?? 0,
    priceFrom: !!test.price_from,
    markers: test.markers ?? [],
    url: test.url ?? undefined,
    testDetails: test,
    ...overrides,
  };
}
