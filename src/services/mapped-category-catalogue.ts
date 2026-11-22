import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { publicCatalogueRead } from "./public-catalogue-memo";
import { loadViewPricing, mergeActiveRows } from "@/lib/viewPricing";
import { supabase } from "@/integrations/supabase/client";
import { CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { getCategoryEvidence } from "./category-evidence.functions";
import {
  CATEGORY_TEST_COLUMNS,
  mapProviderTestRowVariants,
  type ProviderTestRow,
} from "@/lib/categoryTestMapper";

/** Resolves provider_test_ids for one or more category slugs. */
async function fetchMappedTestIds(
  slugs: string[],
): Promise<Record<string, string[]>> {
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id,slug")
    .in("slug", slugs);
  if (catErr) throw catErr;

  const slugById = new Map((cats ?? []).map((c) => [c.id, c.slug]));
  if (slugById.size === 0) return {};

  const { data: mappings, error: mapErr } = await supabase
    .from("category_test_mapping")
    .select("category_id,provider_test_id")
    .in("category_id", Array.from(slugById.keys()));
  if (mapErr) throw mapErr;

  const result: Record<string, string[]> = {};
  for (const slug of slugById.values()) result[slug] = [];
  for (const row of mappings ?? []) {
    const slug = slugById.get(row.category_id);
    if (slug) result[slug].push(row.provider_test_id);
  }
  return result;
}

/** Live test counts per mapped category slug, restricted to listable tests. */
export function mappedCategoryCountsQueryOptions(slugs: string[]) {
  const key = [...slugs].sort().join(",");
  return queryOptions({
    queryKey: ["mapped-category-counts", key],
    queryFn: async (): Promise<Record<string, number>> => {
      const idsBySlug = await fetchMappedTestIds(slugs);
      const allIds = Array.from(new Set(Object.values(idsBySlug).flat()));
      if (allIds.length === 0) return {};

      const { data, error } = await supabase
        .from("provider_tests")
        .select("id")
        .in("id", allIds)
        .eq("is_active", true)
        .not("url", "is", null);
      if (error) throw error;

      const listable = new Set((data ?? []).map((r) => r.id));
      const counts: Record<string, number> = {};
      for (const [slug, ids] of Object.entries(idsBySlug)) {
        counts[slug] = ids.filter((id) => listable.has(id)).length;
      }
      return counts;
    },
    staleTime: 5 * 60 * 1000,
  });
}

/** Full test list for one mapped category slug, as category card items. */
export function mappedCategoryTestsQueryOptions(
  queryClient: QueryClient,
  slug: string | null,
  badgeColor: string,
) {
  return queryOptions({
    queryKey: ["mapped-category-tests", slug],
    enabled: !!slug,
    queryFn: (): Promise<CategoryTestItem[]> =>
      publicCatalogueRead(
        JSON.stringify(["mapped", slug, badgeColor]),
        async () => {
          if (!slug) return [];
          const idsBySlug = await fetchMappedTestIds([slug]);
          const ids = idsBySlug[slug] ?? [];
          if (ids.length === 0) return [];

          const { data, error } = await supabase
            .from("provider_tests")
            .select(CATEGORY_TEST_COLUMNS)
            .in("id", ids)
            .eq("is_active", true)
            .not("url", "is", null)
            .order("is_addon", { ascending: true, nullsFirst: true })
            .order("is_popular", { ascending: false })
            .order("popularity_rank", { ascending: true, nullsFirst: false })
            .order("price", { ascending: true });
          if (error) throw error;

          const rows = (data ?? []) as unknown as ProviderTestRow[];
          const evidenceIds = rows
            .filter(
              (row) =>
                !row.biomarker_count ||
                (row.provider_id === "lola-health" && !row.is_addon),
            )
            .map((row) => row.id);
          const evidence = await getCategoryEvidence({
            data: { ids: evidenceIds, category: "", subcategory: null },
          });
          const enriched = rows.map((row) => ({
            ...row,
            is_addon: row.is_addon || evidence[row.id]?.isAddon || false,
            biomarker_count:
              evidence[row.id]?.biomarkerCount ?? row.biomarker_count,
          }));
          return mergeActiveRows(
            enriched,
            await loadViewPricing(
              queryClient,
              ((data ?? []) as unknown as ProviderTestRow[]).map((r) => r.id),
            ),
          ).flatMap((row) => mapProviderTestRowVariants(row, badgeColor));
        },
      ),
    staleTime: 5 * 60 * 1000,
  });
}
