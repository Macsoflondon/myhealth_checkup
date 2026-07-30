import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryTestItem } from "@/components/category/CategoryPageLayout";
import {
  CATEGORY_TEST_COLUMNS,
  mapProviderTestRow,
  type ProviderTestRow,
} from "@/lib/categoryTestMapper";

/** Resolves provider_test_ids for one or more category slugs. */
async function fetchMappedTestIds(slugs: string[]): Promise<Record<string, string[]>> {
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
export function useMappedCategoryCounts(slugs: string[]) {
  const key = [...slugs].sort().join(",");
  return useQuery({
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
        .not("image_url", "is", null)
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
export function useMappedCategoryTests(slug: string | null, badgeColor: string) {
  return useQuery({
    queryKey: ["mapped-category-tests", slug],
    enabled: !!slug,
    queryFn: async (): Promise<CategoryTestItem[]> => {
      if (!slug) return [];
      const idsBySlug = await fetchMappedTestIds([slug]);
      const ids = idsBySlug[slug] ?? [];
      if (ids.length === 0) return [];

      const { data, error } = await supabase
        .from("provider_tests")
        .select(CATEGORY_TEST_COLUMNS)
        .in("id", ids)
        .eq("is_active", true)
        .not("image_url", "is", null)
        .not("url", "is", null)
        .order("is_popular", { ascending: false })
        .order("popularity_rank", { ascending: true, nullsFirst: false })
        .order("price", { ascending: true });
      if (error) throw error;

      return ((data ?? []) as unknown as ProviderTestRow[]).map((row) =>
        mapProviderTestRow(row, badgeColor)
      );
    },
    staleTime: 5 * 60 * 1000,
  });
}
