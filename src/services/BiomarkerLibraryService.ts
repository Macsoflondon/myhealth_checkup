import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

/**
 * Read-only access to the live biomarker library
 * (`public.biomarker_library_public`) and the provider-test → biomarker links
 * (`public.provider_test_biomarkers`). The database is the single source of
 * truth; the static files in src/components/biomarker-library are unused.
 */

export type BiomarkerLibraryRow = Omit<
  Database["public"]["Views"]["biomarker_library_public"]["Row"],
  "related_articles" | "reviewed_by" | "updated_at"
>;

export interface LibraryEntry {
  id: string;
  slug: string;
  name: string;
  category: string | null;
  abbreviation: string | null;
  description: string | null;
  whatItMeasures: string | null;
  whyItMatters: string | null;
  whatAffectsIt: string | null;
  whenToRetest: string | null;
  clinicalSignificance: string | null;
  unit: string | null;
  normalRangeMale: string | null;
  normalRangeFemale: string | null;
  referenceRanges: unknown;
  synonyms: string[];
  biomaterial: string | null;
  bodySystem: string | null;
  lastReviewedAt: string | null;
  testCount: number;
  providerCount: number;
}

export const BIOMARKER_PAGE_SIZE = 48;

const LIBRARY_COLUMNS =
  "id, slug, biomarker_name, category, abbreviation, description, what_it_measures, why_it_matters, what_affects_it, when_to_retest, clinical_significance, unit_of_measurement, normal_range_male, normal_range_female, reference_ranges, synonyms, biomaterial, body_system, last_reviewed_at, test_count, provider_count";

const clean = (value: string | null | undefined): string | null => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
};

export function toLibraryEntry(row: BiomarkerLibraryRow): LibraryEntry | null {
  if (!row.id || !row.slug || !row.biomarker_name) return null;
  return {
    id: row.id,
    slug: row.slug,
    name: row.biomarker_name,
    category: clean(row.category),
    abbreviation: clean(row.abbreviation),
    description: clean(row.description),
    whatItMeasures: clean(row.what_it_measures),
    whyItMatters: clean(row.why_it_matters),
    whatAffectsIt: clean(row.what_affects_it),
    whenToRetest: clean(row.when_to_retest),
    clinicalSignificance: clean(row.clinical_significance),
    unit: clean(row.unit_of_measurement),
    normalRangeMale: clean(row.normal_range_male),
    normalRangeFemale: clean(row.normal_range_female),
    referenceRanges: row.reference_ranges,
    synonyms: (row.synonyms ?? []).filter((s) => s.trim().length > 0),
    biomaterial: clean(row.biomaterial),
    bodySystem: clean(row.body_system),
    lastReviewedAt: row.last_reviewed_at,
    testCount: row.test_count ?? 0,
    providerCount: row.provider_count ?? 0,
  };
}

/** Strip characters that carry meaning in a PostgREST `or=` filter. */
export function sanitiseSearchTerm(term: string): string {
  return term
    .replace(/[,()*%"{}\\:]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

/**
 * PostgREST `or` filter for name, abbreviation (partial, case-insensitive)
 * and synonyms (array element match in the typed, lower and title case).
 */
export function buildSearchFilter(term: string): string | null {
  const safe = sanitiseSearchTerm(term);
  if (!safe) return null;
  const titled = safe.charAt(0).toUpperCase() + safe.slice(1).toLowerCase();
  const variants = Array.from(new Set([safe, safe.toLowerCase(), titled]));
  return [
    `biomarker_name.ilike.*${safe}*`,
    `abbreviation.ilike.*${safe}*`,
    ...variants.map((v) => `synonyms.cs.{"${v}"}`),
  ].join(",");
}

export interface LibraryPage {
  entries: LibraryEntry[];
  total: number;
  nextOffset: number | null;
}

export async function fetchLibraryPage(params: {
  search: string;
  category: string;
  offset: number;
}): Promise<LibraryPage> {
  let query = supabase
    .from("biomarker_library_public")
    .select(LIBRARY_COLUMNS, { count: "exact" })
    .order("category", { ascending: true, nullsFirst: false })
    .order("biomarker_name", { ascending: true })
    .range(params.offset, params.offset + BIOMARKER_PAGE_SIZE - 1);
  if (params.category) query = query.eq("category", params.category);
  const filter = buildSearchFilter(params.search);
  if (filter) query = query.or(filter);
  const { data, error, count } = await query;
  if (error) throw error;
  const entries = (data ?? []).flatMap((row) => {
    const entry = toLibraryEntry(row);
    return entry ? [entry] : [];
  });
  const total = count ?? entries.length;
  const next = params.offset + BIOMARKER_PAGE_SIZE;
  return { entries, total, nextOffset: next < total ? next : null };
}

export async function fetchLibraryCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from("biomarker_library_public")
    .select("category")
    .not("category", "is", null)
    .range(0, 4999);
  if (error) throw error;
  const set = new Set<string>();
  (data ?? []).forEach((r) => {
    const c = clean(r.category);
    if (c) set.add(c);
  });
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function fetchLibraryEntryBySlug(
  slug: string,
): Promise<LibraryEntry | null> {
  const { data, error } = await supabase
    .from("biomarker_library_public")
    .select(LIBRARY_COLUMNS)
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return data ? toLibraryEntry(data) : null;
}

export const libraryPagesQuery = (search: string, category: string) =>
  infiniteQueryOptions({
    queryKey: ["biomarker-library", "pages", search, category],
    queryFn: ({ pageParam }) =>
      fetchLibraryPage({ search, category, offset: pageParam }),
    initialPageParam: 0,
    getNextPageParam: (last: LibraryPage) => last.nextOffset ?? undefined,
  });

export const libraryCategoriesQuery = () =>
  queryOptions({
    queryKey: ["biomarker-library", "categories"],
    queryFn: fetchLibraryCategories,
  });

export const libraryEntryQuery = (slug: string) =>
  queryOptions({
    queryKey: ["biomarker-library", "entry", slug],
    queryFn: () => fetchLibraryEntryBySlug(slug),
  });

export const biomarkerLibraryHref = (slug: string): string =>
  `/biomarker-database?biomarker=${encodeURIComponent(slug)}`;

// ---------- provider test chips ----------

export interface TestBiomarkerChip {
  label: string;
  entry: Pick<
    LibraryEntry,
    "slug" | "name" | "description" | "category"
  > | null;
}

export async function fetchTestBiomarkerChips(
  providerTestId: string,
): Promise<TestBiomarkerChip[]> {
  const { data: links, error } = await supabase
    .from("provider_test_biomarkers")
    .select("raw_label, biomarker_id")
    .eq("provider_test_id", providerTestId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });
  if (error) throw error;
  const rows = links ?? [];
  const ids = Array.from(
    new Set(rows.flatMap((r) => (r.biomarker_id ? [r.biomarker_id] : []))),
  );
  const byId = new Map<string, TestBiomarkerChip["entry"]>();
  if (ids.length > 0) {
    const { data: lib, error: libError } = await supabase
      .from("biomarker_library_public")
      .select("id, slug, biomarker_name, description, category")
      .in("id", ids);
    if (libError) throw libError;
    (lib ?? []).forEach((r) => {
      if (!r.id || !r.slug || !r.biomarker_name) return;
      byId.set(r.id, {
        slug: r.slug,
        name: r.biomarker_name,
        description: clean(r.description),
        category: clean(r.category),
      });
    });
  }
  return rows.map((r) => ({
    label: r.raw_label,
    entry: r.biomarker_id ? (byId.get(r.biomarker_id) ?? null) : null,
  }));
}

export const testBiomarkerChipsQuery = (providerTestId: string) =>
  queryOptions({
    queryKey: ["provider-test-biomarkers", providerTestId],
    queryFn: () => fetchTestBiomarkerChips(providerTestId),
    enabled: providerTestId.length > 0,
  });
