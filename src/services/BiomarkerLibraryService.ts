import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import {
  compareConsumerCategories,
  consumerCategoryFor,
  isSeparateSectionCategory,
  rawFilterFor,
  resolveConsumerCategory,
} from "@/components/biomarker-library/biomarker-categories";
import { CompareService } from "@/services/CompareService";
import { biomarkerCompareHref } from "@/services/compareFilters";

/**
 * Read-only access to the live biomarker library
 * (`public.biomarker_library_public`) and the provider-test → biomarker links
 * (`public.provider_test_biomarkers`). The database is the single source of
 * truth. Raw category labels map to consumer categories in
 * src/components/biomarker-library/biomarker-categories.ts.
 */

export type BiomarkerLibraryRow = Omit<
  Database["public"]["Views"]["biomarker_library_public"]["Row"],
  "related_articles" | "reviewed_by" | "updated_at"
>;

export interface LibraryEntry {
  id: string;
  slug: string;
  name: string;
  /** Raw label from the view. */
  category: string | null;
  /** Consumer category the library groups and labels the entry under. */
  consumerCategory: string;
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
    consumerCategory: consumerCategoryFor(row.category, row.slug),
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

/** "biomarkers" is the main list; "other" holds allergens and infection markers. */
export type LibraryScope = "biomarkers" | "other";

/** One row of the library index: enough to order, group, count and page. */
export interface LibraryIndexRow {
  slug: string;
  rawCategory: string | null;
  category: string;
  separate: boolean;
}

/** PostgREST returns at most 1,000 rows per request (Supabase max-rows). */
export const POSTGREST_MAX_ROWS = 1000;

const quoteList = (values: readonly string[]): string =>
  `(${values.map((v) => `"${v.replace(/["\\]/g, "")}"`).join(",")})`;

/**
 * PostgREST filters for one consumer category, run against the raw labels
 * that map to it (see biomarker-categories.ts) plus slug overrides.
 */
export function categoryFilterParts(consumerLabel: string): {
  or: string | null;
  inRaw: string[] | null;
  notSlugs: string | null;
} {
  const f = rawFilterFor(consumerLabel);
  const notSlugs = f.excludeSlugs.length ? quoteList(f.excludeSlugs) : null;
  if (f.includeSlugs.length === 0) {
    return { or: null, inRaw: f.rawLabels, notSlugs };
  }
  return {
    or: `category.in.${quoteList(f.rawLabels)},slug.in.${quoteList(f.includeSlugs)}`,
    inRaw: null,
    notSlugs,
  };
}

/** Order consumer categories, keeping the server's name order inside each. */
export function orderLibraryIndex(
  rows: { slug: string | null; category: string | null }[],
  consumerCategory?: string,
): LibraryIndexRow[] {
  const out = rows.flatMap((r): LibraryIndexRow[] => {
    if (!r.slug) return [];
    const category = consumerCategoryFor(r.category, r.slug);
    if (consumerCategory && category !== consumerCategory) return [];
    return [
      {
        slug: r.slug,
        rawCategory: clean(r.category),
        category,
        separate: isSeparateSectionCategory(category),
      },
    ];
  });
  return out.sort((a, b) => compareConsumerCategories(a.category, b.category));
}

/**
 * Every library row matching the search and category, as slugs in display
 * order. Reads past the 1,000-row cap in chunks: a single request used to
 * stop at 1,000 rows and under-count the categories.
 */
export async function fetchLibraryIndex(params: {
  search: string;
  category: string;
}): Promise<LibraryIndexRow[]> {
  const consumer = resolveConsumerCategory(params.category);
  const searchFilter = buildSearchFilter(params.search);
  const rows: { slug: string | null; category: string | null }[] = [];
  for (let offset = 0; ; offset += POSTGREST_MAX_ROWS) {
    let query = supabase
      .from("biomarker_library_public")
      .select("slug, category")
      .order("biomarker_name", { ascending: true })
      .order("id", { ascending: true })
      .range(offset, offset + POSTGREST_MAX_ROWS - 1);
    if (consumer) {
      const parts = categoryFilterParts(consumer);
      if (parts.inRaw) query = query.in("category", parts.inRaw);
      if (parts.or) query = query.or(parts.or);
      if (parts.notSlugs) query = query.not("slug", "in", parts.notSlugs);
    }
    if (searchFilter) query = query.or(searchFilter);
    const { data, error } = await query;
    if (error) throw error;
    rows.push(...(data ?? []));
    if ((data ?? []).length < POSTGREST_MAX_ROWS) break;
  }
  return orderLibraryIndex(rows, consumer ?? undefined);
}

export interface LibraryCategoryCount {
  label: string;
  count: number;
}
export interface LibrarySummary {
  /** Entries in the main list (allergens and infection markers excluded). */
  biomarkerTotal: number;
  /** Entries in the allergens and infection markers section. */
  otherTotal: number;
  /** Main-list consumer categories with entries, in display order. */
  categories: LibraryCategoryCount[];
}

export function summariseLibraryIndex(rows: LibraryIndexRow[]): LibrarySummary {
  const counts = new Map<string, number>();
  let otherTotal = 0;
  rows.forEach((r) => {
    if (r.separate) {
      otherTotal += 1;
      return;
    }
    counts.set(r.category, (counts.get(r.category) ?? 0) + 1);
  });
  const categories = Array.from(counts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => compareConsumerCategories(a.label, b.label));
  return {
    biomarkerTotal: rows.length - otherTotal,
    otherTotal,
    categories,
  };
}

/** Rows for one list. A chosen category shows all its rows in the main list. */
export function scopeLibraryIndex(
  rows: LibraryIndexRow[],
  scope: LibraryScope,
  category: string,
): LibraryIndexRow[] {
  if (category) return scope === "biomarkers" ? rows : [];
  return rows.filter((r) => (scope === "other" ? r.separate : !r.separate));
}

export async function fetchLibraryEntriesBySlugs(
  slugs: string[],
): Promise<LibraryEntry[]> {
  if (slugs.length === 0) return [];
  const { data, error } = await supabase
    .from("biomarker_library_public")
    .select(LIBRARY_COLUMNS)
    .in("slug", slugs);
  if (error) throw error;
  const bySlug = new Map<string, LibraryEntry>();
  (data ?? []).forEach((row) => {
    const entry = toLibraryEntry(row);
    if (entry) bySlug.set(entry.slug, entry);
  });
  return slugs.flatMap((slug) => {
    const e = bySlug.get(slug);
    return e ? [e] : [];
  });
}

export function pageOfIndex(
  rows: LibraryIndexRow[],
  offset: number,
): { slugs: string[]; total: number; nextOffset: number | null } {
  const slugs = rows
    .slice(offset, offset + BIOMARKER_PAGE_SIZE)
    .map((r) => r.slug);
  const next = offset + BIOMARKER_PAGE_SIZE;
  return {
    slugs,
    total: rows.length,
    nextOffset: next < rows.length ? next : null,
  };
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

export const libraryIndexQuery = (search: string, category: string) =>
  queryOptions({
    queryKey: ["biomarker-library", "index", search, category],
    queryFn: () => fetchLibraryIndex({ search, category }),
  });

export const librarySummaryQuery = () =>
  queryOptions({
    ...libraryIndexQuery("", ""),
    select: summariseLibraryIndex,
  });

export const libraryPagesQuery = (
  search: string,
  category: string,
  scope: LibraryScope = "biomarkers",
) =>
  infiniteQueryOptions({
    queryKey: ["biomarker-library", "pages", search, category, scope],
    queryFn: async ({ pageParam, client }): Promise<LibraryPage> => {
      const index = await client.ensureQueryData(
        libraryIndexQuery(search, category),
      );
      const page = pageOfIndex(
        scopeLibraryIndex(index, scope, category),
        pageParam,
      );
      const entries = await fetchLibraryEntriesBySlugs(page.slugs);
      return { entries, total: page.total, nextOffset: page.nextOffset };
    },
    initialPageParam: 0,
    getNextPageParam: (last: LibraryPage) => last.nextOffset ?? undefined,
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

// ---------- providers offering a biomarker ----------

export interface BiomarkerProviderLink {
  providerId: string;
  testCount: number;
}

/**
 * Tests per provider for a biomarker, counted from the same rows the
 * /compare?biomarker= page lists (CompareService.getBiomarkerTestRows):
 * active tests from supported providers, junk rows removed.
 */
export async function fetchBiomarkerProviders(
  biomarkerId: string,
): Promise<BiomarkerProviderLink[]> {
  const rows = await CompareService.getBiomarkerTestRows(biomarkerId);
  return countTestsByProvider(rows);
}

export function countTestsByProvider(
  rows: { id: string; provider_id: string }[],
): BiomarkerProviderLink[] {
  const byProvider = new Map<string, Set<string>>();
  rows.forEach((r) => {
    if (!r.provider_id || !r.id) return;
    const set = byProvider.get(r.provider_id) ?? new Set<string>();
    set.add(r.id);
    byProvider.set(r.provider_id, set);
  });
  return Array.from(byProvider.entries())
    .map(([providerId, tests]) => ({ providerId, testCount: tests.size }))
    .sort(
      (a, b) =>
        b.testCount - a.testCount || a.providerId.localeCompare(b.providerId),
    );
}

export const biomarkerProvidersQuery = (biomarkerId: string) =>
  queryOptions({
    queryKey: ["biomarker-library", "providers", biomarkerId],
    queryFn: () => fetchBiomarkerProviders(biomarkerId),
    enabled: biomarkerId.length > 0,
  });

/** Link from a biomarker card to exactly the tests it counted. */
export const biomarkerProviderCompareHref = (
  biomarkerId: string,
  providerId?: string | null,
): string => biomarkerCompareHref(biomarkerId, providerId);

/** Name of a library entry, for the /compare?biomarker= heading. */
export async function fetchLibraryEntryNameById(
  id: string,
): Promise<{ id: string; slug: string; name: string } | null> {
  const { data, error } = await supabase
    .from("biomarker_library_public")
    .select("id, slug, biomarker_name")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data?.id || !data.slug || !data.biomarker_name) return null;
  return { id: data.id, slug: data.slug, name: data.biomarker_name };
}

export const libraryEntryNameQuery = (id: string) =>
  queryOptions({
    queryKey: ["biomarker-library", "name", id],
    queryFn: () => fetchLibraryEntryNameById(id),
    enabled: id.length > 0,
    staleTime: 30 * 60 * 1000,
  });
