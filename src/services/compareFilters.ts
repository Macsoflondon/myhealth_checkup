import type { SymptomPageData } from "@/data/symptomPages";

/**
 * URL filters for /compare that select an exact set of tests rather than a
 * text search:
 *   ?biomarker=<biomarker_library_public.id>[&provider=<provider_id>]
 *   ?symptom=<symptomPages slug>[&provider=<provider_id>]
 * Biomarker mode reads provider_test_biomarkers, the same links the biomarker
 * library counts, so a card's "N tests" equals the tests the page lists.
 */

export interface CompareUrlFilters {
  biomarkerId: string | null;
  symptomSlug: string | null;
  provider: string | null;
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const slugParam = (value: string | null): string | null => {
  const v = value?.trim().toLowerCase() ?? "";
  return v.length > 0 && v.length <= 80 && SLUG.test(v) ? v : null;
};

export function parseCompareUrlFilters(
  params: URLSearchParams,
): CompareUrlFilters {
  const rawBiomarker = params.get("biomarker")?.trim().toLowerCase() ?? "";
  const provider = slugParam(params.get("provider"));
  const biomarkerId = UUID.test(rawBiomarker) ? rawBiomarker : null;
  // A biomarker filter takes precedence; the two modes do not combine.
  const symptomSlug = biomarkerId ? null : slugParam(params.get("symptom"));
  return {
    biomarkerId,
    symptomSlug,
    provider: provider === "all" ? null : provider,
  };
}

/** True when the URL asked for a biomarker that is not a valid library id. */
export function hasInvalidBiomarkerParam(params: URLSearchParams): boolean {
  const raw = params.get("biomarker");
  return (
    raw !== null &&
    raw.trim() !== "" &&
    !parseCompareUrlFilters(params).biomarkerId
  );
}

/** URL parameters the "Clear filters" control removes. */
export const COMPARE_FILTER_PARAMS = [
  "biomarker",
  "symptom",
  "provider",
  "search",
] as const;

export function clearCompareFilterParams(
  params: URLSearchParams,
): URLSearchParams {
  const next = new URLSearchParams(params);
  COMPARE_FILTER_PARAMS.forEach((key) => next.delete(key));
  return next;
}

export function removeCompareParam(
  params: URLSearchParams,
  key: (typeof COMPARE_FILTER_PARAMS)[number],
): URLSearchParams {
  const next = new URLSearchParams(params);
  next.delete(key);
  return next;
}

export function biomarkerCompareHref(
  biomarkerId: string,
  providerId?: string | null,
): string {
  const params = new URLSearchParams({ biomarker: biomarkerId });
  if (providerId) params.set("provider", providerId);
  return `/compare?${params.toString()}`;
}

export function symptomCompareHref(slug: string): string {
  return `/compare?${new URLSearchParams({ symptom: slug }).toString()}`;
}

/** symptomPages searchQuery values use "+" for spaces ("full+blood+count"). */
export function searchQueryToTerm(searchQuery: string): string {
  let decoded = searchQuery.replace(/\+/g, " ");
  try {
    decoded = decodeURIComponent(decoded);
  } catch {
    // Keep the raw text when it holds a stray "%".
  }
  return decoded.replace(/\s+/g, " ").trim();
}

/** Distinct search terms behind a symptom's recommended tests, in order. */
export function symptomSearchTerms(symptom: SymptomPageData): string[] {
  const seen = new Set<string>();
  const terms: string[] = [];
  for (const test of symptom.recommendedTests) {
    const term = searchQueryToTerm(test.searchQuery);
    const key = term.toLowerCase();
    if (!term || seen.has(key)) continue;
    seen.add(key);
    terms.push(term);
  }
  return terms;
}
