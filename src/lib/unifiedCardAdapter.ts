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

/** Caller-supplied fields that aren't derivable from `ProviderTestCardData`. */
export interface UnifiedCardOverrides {
  provider: string;
  rating: number;
  reviews: number;
  category?: string;
  categoryColor?: string;
  description?: string;
  results?: string;
  collection?: string;
  badge?: string;
  ctaLabel?: string;
  onCtaClick?: UnifiedTestCardProps["onCtaClick"];
  compareSelected?: boolean;
  onCompareToggle?: UnifiedTestCardProps["onCompareToggle"];
  className?: string;
}

/**
 * Map a `ProviderTestCardData` into a fully-formed `UnifiedTestCardProps`.
 * Caller supplies what can't be derived (provider name + rating/reviews)
 * and may override any derived field.
 */
export function toUnifiedCardProps(
  test: ProviderTestCardData,
  overrides: UnifiedCardOverrides
): UnifiedTestCardProps {
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
