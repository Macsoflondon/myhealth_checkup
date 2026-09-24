import { CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { getProviderRating } from "@/constants/providerRatings";
import { normalizeBiomarkers } from "@/utils/normalize-biomarkers";
import {
  deriveCollectionVariants,
  type CollectionVariant,
} from "@/lib/collectionVariants";
import { categoryMenuIconFor } from "@/components/header/menuIcons";

export const PROVIDER_NAMES: Record<string, string> = {
  medichecks: "Medichecks",
  "goodbody-clinic": "GoodBody Clinic",
  "lola-health": "Lola Health",
  randox: "Randox Health",
  "london-medical-laboratory": "London Medical Laboratory",
  "london-health-company": "London Health Company",
  clinilabs: "Clinilabs",
  "medical-diagnosis": "Medical Diagnosis",
};

export const BADGE_COLOR_BY_CATEGORY: Record<string, string> = {
  "womens-health": categoryMenuIconFor("Women's Health").color,
  "mens-health": categoryMenuIconFor("Men's Health").color,
  fertility: categoryMenuIconFor("Fertility - Prenatal").color,
  "sexual-health": categoryMenuIconFor("General Wellness").color,
  hormones: categoryMenuIconFor("General Wellness").color,
  thyroid: categoryMenuIconFor("General Wellness").color,
  heart: categoryMenuIconFor("General Wellness").color,
  gut: categoryMenuIconFor("General Wellness").color,
  vitamins: categoryMenuIconFor("General Wellness").color,
  "cancer-screening": categoryMenuIconFor("Cancer Screening").color,
  "sports-performance": categoryMenuIconFor("Sports & Fitness").color,
  "general-health": categoryMenuIconFor("General Wellness").color,
  "at-home": categoryMenuIconFor("At Home Test Kits").color,
};

/** Columns required to build a CategoryTestItem from provider_tests. */
export const CATEGORY_TEST_COLUMNS =
  "id,provider_id,test_name,description,price,base_price,url,image_url,biomarker_count,biomarkers_list,turnaround_days_text,is_popular,popularity_rank,sample_type,home_kit_available,clinic_visit_available,clinic_phlebotomy_cost,home_phlebotomy_cost,category,source_section_label,canonical_category,is_addon,purchase_notes";

export interface ProviderTestRow {
  id: string;
  provider_id: string;
  test_name: string;
  description: string | null;
  price: number | null;
  base_price: number | null;
  url: string | null;
  image_url: string | null;
  biomarker_count: number | null;
  biomarkers_list: unknown;
  turnaround_days_text: string | null;
  is_popular: boolean | null;
  popularity_rank: number | null;
  sample_type: string | null;
  home_kit_available: boolean | null;
  clinic_visit_available: boolean | null;
  clinic_phlebotomy_cost: number | null;
  home_phlebotomy_cost: number | null;
  category: string | null;
  source_section_label: string | null;
  canonical_category: string | null;
  is_addon?: boolean | null;
  purchase_notes?: string | null;
}

/** Maps a raw provider_tests row into the shared category card shape. */
export function mapProviderTestRow(
  row: ProviderTestRow,
  badgeColor: string,
): CategoryTestItem {
  const providerName = PROVIDER_NAMES[row.provider_id] || row.provider_id;
  const rating = getProviderRating(row.provider_id);
  const priceNum = Number(row.price ?? row.base_price ?? 0);
  const biomarkers = normalizeBiomarkers(row.biomarkers_list).slice(0, 6);
  const turnaround = row.turnaround_days_text || "Typical 3–5 days";
  const match = turnaround.match(/(\d+)/);
  const turnaroundDays = match ? parseInt(match[1], 10) : 5;
  const collection =
    row.home_kit_available && row.clinic_visit_available
      ? "Home Kit / Clinic"
      : row.clinic_visit_available
        ? "Clinic"
        : "Home Kit";

  return {
    id: row.id,
    providerId: row.provider_id,
    popular: !!row.is_popular,
    badge: row.source_section_label || row.category || undefined,
    badgeColor,
    provider: providerName,
    priceNum,
    price: `£${priceNum.toFixed(priceNum % 1 === 0 ? 0 : 2)}`,
    turnaround,
    turnaroundDays,
    biomarkerCount: row.biomarker_count ?? biomarkers.length ?? 0,
    rating: rating?.rating,
    reviews: rating?.reviews,
    title: row.test_name,
    desc: row.description || `${row.test_name} from ${providerName}.`,
    biomarkers,
    tag: "All",
    collection,
    url: row.url || undefined,
    imageUrl: row.image_url || undefined,
    isAddon: !!row.is_addon,
    purchaseNotes: row.purchase_notes ?? null,
  };
}

/**
 * Expands a row into one card per collection route, so an at-home finger-prick
 * kit and a clinic/nurse draw of the same test are listed (and priced) apart.
 */
export function mapProviderTestRowVariants(
  row: ProviderTestRow,
  badgeColor: string,
): CategoryTestItem[] {
  const base = mapProviderTestRow(row, badgeColor);
  const variants = deriveCollectionVariants(row);
  if (variants.length === 1 && variants[0].fee <= 0) return [base];

  return variants.map((variant: CollectionVariant) => ({
    ...base,
    id: variant.variantId,
    routeVariant: variant,
    priceNum: variant.total,
    price: `£${variant.total.toFixed(variant.total % 1 === 0 ? 0 : 2)}`,
    collection:
      variant.fee > 0
        ? `${variant.label} (+£${variant.fee.toFixed(variant.fee % 1 === 0 ? 0 : 2)})`
        : variant.label,
  }));
}
