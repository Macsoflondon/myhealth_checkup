/**
 * Wellness cards backed by real taxonomy rows in `categories` /
 * `category_test_mapping` rather than regex matching on provider_tests.
 * Keyed by the wellness card id.
 */
export interface MappedCategoryDef {
  /** Slug in the `categories` table (also the ?subcategory= value). */
  slug: string;
  label: string;
  badgeColor: string;
  subtitle: string;
}

export const MAPPED_WELLNESS_CATEGORIES: Record<string, MappedCategoryDef> = {
  "longevity-tests": {
    slug: "longevity",
    label: "Longevity Tests",
    badgeColor: "#00d4c8",
    subtitle:
      "Compare comprehensive longevity and healthy-ageing panels from accredited UK providers.",
  },
  "energy-tests": {
    slug: "energy-fatigue",
    label: "Energy & Fatigue Tests",
    badgeColor: "#f0a500",
    subtitle:
      "Compare tests that investigate tiredness, low energy and related deficiencies.",
  },
  "gp-monitoring": {
    slug: "gp-monitoring",
    label: "GP Monitoring Tests",
    badgeColor: "#00b4d8",
    subtitle:
      "Compare routine monitoring and general health check panels from accredited UK providers.",
  },
  "antibody-tests": {
    slug: "antibody",
    label: "Antibody Tests",
    badgeColor: "#e70d69",
    subtitle: "Compare antibody screening tests from accredited UK providers.",
  },
  "infection-tests": {
    slug: "infection",
    label: "Infection Tests",
    badgeColor: "#5b9bd5",
    subtitle:
      "Compare infection and infectious disease screening from accredited UK providers.",
  },
  "immunity-tests": {
    slug: "immunity",
    label: "Immunity Tests",
    badgeColor: "#f0b429",
    subtitle:
      "Compare tests assessing immune function and immunity status.",
  },
  "autoimmunity-tests": {
    slug: "autoimmunity",
    label: "Autoimmunity Tests",
    badgeColor: "#e70d69",
    subtitle:
      "Compare autoimmune screening and monitoring tests from accredited UK providers.",
  },
};

export const MAPPED_WELLNESS_SLUGS = Object.values(MAPPED_WELLNESS_CATEGORIES).map(
  (c) => c.slug
);

export function findMappedWellnessCategory(slug: string | null | undefined) {
  if (!slug) return null;
  return (
    Object.values(MAPPED_WELLNESS_CATEGORIES).find((c) => c.slug === slug) ?? null
  );
}
