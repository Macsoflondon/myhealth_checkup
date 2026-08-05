import { CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { getProviderRating } from "@/constants/providerRatings";
import { normalizeBiomarkers } from "@/utils/normalize-biomarkers";

export const PROVIDER_NAMES: Record<string, string> = {
  "medichecks": "Medichecks",
  "thriva": "Thriva",
  "goodbody-clinic": "GoodBody Clinic",
  "lola-health": "Lola Health",
  "randox": "Randox Health",
  "london-medical-laboratory": "London Medical Laboratory",
  "london-health-company": "London Health Company",
  "clinilabs": "Clinilabs",
  "medical-diagnosis": "Medical Diagnosis",
};

export const BADGE_COLOR_BY_CATEGORY: Record<string, string> = {
  "womens-health": "#E91E7A",
  "mens-health": "#3B82F6",
  "fertility": "#10B981",
  "sexual-health": "#8B5CF6",
  "hormones": "#E91E7A",
  "thyroid": "#22c0d4",
  "heart": "#EF4444",
  "gut": "#F59E0B",
  "vitamins": "#F97316",
  "cancer-screening": "#9333EA",
  "sports-performance": "#22c55e",
  "general-health": "#3B82F6",
  "at-home": "#22c0d4",
};

/** Columns required to build a CategoryTestItem from provider_tests. */
export const CATEGORY_TEST_COLUMNS =
  "id,provider_id,test_name,description,price,base_price,url,image_url,biomarker_count,biomarkers_list,turnaround_days_text,is_popular,popularity_rank,sample_type,home_kit_available,clinic_visit_available,category,source_section_label,canonical_category";

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
  category: string | null;
  source_section_label: string | null;
  canonical_category: string | null;
}

/** Maps a raw provider_tests row into the shared category card shape. */
export function mapProviderTestRow(row: ProviderTestRow, badgeColor: string): CategoryTestItem {
  const providerName = PROVIDER_NAMES[row.provider_id] || row.provider_id;
  const rating = getProviderRating(row.provider_id);
  const priceNum = Number(row.price ?? row.base_price ?? 0);
  const biomarkers = normalizeBiomarkers(row.biomarkers_list).slice(0, 6);
  const turnaround = row.turnaround_days_text || "Typical 3–5 days";
  const match = turnaround.match(/(\d+)/);
  const turnaroundDays = match ? parseInt(match[1], 10) : 5;
  const collection = row.home_kit_available && row.clinic_visit_available
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
    rating: rating.rating,
    reviews: rating.reviews,
    title: row.test_name,
    desc: row.description || `${row.test_name} from ${providerName}.`,
    biomarkers,
    tag: "All",
    collection,
    url: row.url || undefined,
  };
}
