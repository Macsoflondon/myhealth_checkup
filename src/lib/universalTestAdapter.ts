import type { UniversalTestData } from "@/components/cards/UniversalTestCard";
import type { AtHomeTest } from "@/hooks/queries/useAtHomeTests";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";
import type { CategoryTestItem } from "@/components/category/CategoryPageLayout";

/** Adapter: AtHomeTest (provider_tests row) → UniversalTestData */
export function fromAtHomeTest(t: AtHomeTest): UniversalTestData {
  return {
    id: t.id,
    provider_id: t.provider_id,
    test_name: t.test_name,
    category: t.category,
    description: t.description,
    price: t.price,
    turnaround_days_text: t.turnaround_days_text,
    sample_type: t.sample_type,
    biomarker_count: t.biomarker_count,
    biomarkers_list: t.biomarkers_list,
    symptoms: t.symptoms,
    who_should_test: t.who_should_test,
    url: t.url,
    is_popular: t.is_popular,
    home_kit_available: t.home_kit_available,
    clinic_visit_available: t.clinic_visit_available,
    collection_options: t.collection_options,
  };
}

/** Adapter: ProviderTestCardData → UniversalTestData */
export function fromProviderTest(t: ProviderTestCardData): UniversalTestData {
  return {
    id: t.id,
    provider_id: t.provider_id,
    test_name: t.test_name,
    category: t.category,
    description: t.description,
    price: t.price ?? t.base_price ?? null,
    turnaround_days_text: t.turnaround_days_text,
    sample_type: t.sample_type,
    biomarker_count: t.biomarker_count,
    biomarkers_list: t.biomarkers_list,
    url: t.url,
    is_popular: !!t.is_popular,
    home_kit_available: t.home_kit_available ?? undefined,
    clinic_visit_available: t.clinic_visit_available ?? undefined,
    collection_options: t.collection_options,
  };
}


/** Adapter: Medichecks card props → UniversalTestData */
export function fromMedichecksTest(t: {
  id: string;
  testName: string;
  description: string | null;
  tagline?: string | null;
  isNew?: boolean;
  turnaroundDays?: number | null;
  biomarkerCount: number | null;
  price: number | null;
  sampleType: string | null;
  slug: string;
}): UniversalTestData {
  return {
    id: t.id,
    provider_id: "medichecks",
    test_name: t.testName,
    description: t.description,
    price: t.price,
    turnaround_days_text: t.turnaroundDays ? `${t.turnaroundDays} working days` : null,
    sample_type: t.sampleType,
    biomarker_count: t.biomarkerCount,
    url: `/medichecks/${t.slug}`,
    is_popular: !!t.isNew,
    home_kit_available: true,
  };
}

/** Adapter: CategoryPageLayout's CategoryTestItem → UniversalTestData */
export function fromCategoryTestItem(t: CategoryTestItem): UniversalTestData {
  return {
    id: String(t.id),
    provider_id: t.providerId || (t.provider || "").toLowerCase().replace(/\s+/g, "-"),
    test_name: t.title,
    category: t.tag,
    description: t.desc,
    price: t.priceNum,
    turnaround_days_text: t.turnaround,
    sample_type: t.collection ?? null,
    biomarker_count: t.biomarkerCount,
    biomarkers_list: (t.biomarkers || []).map((v) => ({ value: v })),
    url: t.url,
    is_popular: !!t.popular,
    home_kit_available: /home|finger|kit/i.test(t.collection || ""),
    clinic_visit_available: /clinic|venous|in-person/i.test(t.collection || ""),
  };
}

/** Generic shim for the legacy UnifiedTestCard prop bag */
export interface LegacyUnifiedProps {
  category: string;
  name: string;
  description: string;
  biomarkers: number;
  results: string;
  collection: string;
  price: number;
  markers?: string[];
  provider: string;
  url?: string;
  testDetails?: ProviderTestCardData;
  badge?: string;
}

export function fromLegacyUnified(p: LegacyUnifiedProps): UniversalTestData {
  const fromDetails = p.testDetails ? fromProviderTest(p.testDetails) : null;
  return {
    id: fromDetails?.id ?? `${p.provider}-${p.name}`,
    provider_id: fromDetails?.provider_id ?? (p.provider || "").toLowerCase().replace(/\s+/g, "-"),
    test_name: p.name,
    category: p.category,
    description: p.description,
    price: p.price,
    turnaround_days_text: p.results,
    sample_type: p.collection,
    biomarker_count: p.biomarkers,
    biomarkers_list: (p.markers || []).map((v) => ({ value: v })),
    url: p.url ?? fromDetails?.url ?? null,
    is_popular: /popular/i.test(p.badge || ""),
    home_kit_available: /home|finger|kit/i.test(p.collection || ""),
    clinic_visit_available: /clinic|venous|in-person/i.test(p.collection || ""),
  };
}
