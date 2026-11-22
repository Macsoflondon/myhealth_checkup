import { queryOptions, type QueryClient } from "@tanstack/react-query";
import { publicCatalogueRead } from "./public-catalogue-memo";
import { loadViewPricing, mergeActiveRows } from "@/lib/viewPricing";
import { supabase } from "@/integrations/supabase/client";
import { CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { findSubcategory } from "@/config/subcategoryMap";
import { getCategoryEvidence } from "./category-evidence.functions";
import {
  BADGE_COLOR_BY_CATEGORY,
  CATEGORY_TEST_COLUMNS,
  mapProviderTestRowVariants,
  type ProviderTestRow,
} from "@/lib/categoryTestMapper";

export function categoryTestsQueryOptions(
  queryClient: QueryClient,
  canonicalCategory: string,
  subcategory?: string | null,
) {
  const sub = findSubcategory(canonicalCategory, subcategory ?? null);
  return queryOptions({
    queryKey: ["category-tests-db", canonicalCategory, sub?.slug ?? null],
    queryFn: (): Promise<CategoryTestItem[]> =>
      publicCatalogueRead(
        JSON.stringify(["category", canonicalCategory, sub?.slug ?? null]),
        async () => {
          // DHT applies to both sexes — surface it on Men's and Women's pages
          // while keeping its canonical_category as 'hormones'.
          const includeDht =
            canonicalCategory === "mens-health" ||
            canonicalCategory === "womens-health";

          let query = supabase
            .from("provider_tests")
            .select(CATEGORY_TEST_COLUMNS)
            .eq("is_active", true)
            .not("url", "is", null);

          const siblings = sub?.siblingCategories ?? [];
          const cats = Array.from(new Set([canonicalCategory, ...siblings]));
          const inList = cats.map((c) => `"${c}"`).join(",");

          if (includeDht) {
            query = query.or(
              `canonical_category.in.(${inList}),and(canonical_category.eq.hormones,test_name.ilike.%dihydrotestosterone%)`,
            );
          } else {
            query = query.in("canonical_category", cats);
          }

          const { data, error } = await query
            .order("is_addon", { ascending: true, nullsFirst: true })
            .order("is_popular", { ascending: false })
            .order("popularity_rank", { ascending: true, nullsFirst: false })
            .order("price", { ascending: true });

          if (error) throw error;
          if (!data) return [];

          const badgeColor =
            BADGE_COLOR_BY_CATEGORY[canonicalCategory] || "#3B82F6";
          const rows = data as unknown as ProviderTestRow[];
          const evidenceIds = rows
            .filter(
              (row) =>
                sub ||
                !row.biomarker_count ||
                (row.provider_id === "lola-health" && !row.is_addon),
            )
            .map((row) => row.id);
          const evidence = await getCategoryEvidence({
            data: {
              ids: evidenceIds,
              category: canonicalCategory,
              subcategory: sub?.slug ?? null,
            },
          });
          const matched = rows
            .filter((row) => !sub || evidence[row.id]?.matches)
            .map((row) => ({
              ...row,
              is_addon: row.is_addon || evidence[row.id]?.isAddon || false,
              biomarker_count:
                evidence[row.id]?.biomarkerCount ?? row.biomarker_count,
            }));
          return mergeActiveRows(
            matched,
            await loadViewPricing(
              queryClient,
              (data as unknown as ProviderTestRow[]).map((r) => r.id),
            ),
          ).flatMap((row) => mapProviderTestRowVariants(row, badgeColor));
        },
      ),
    staleTime: 5 * 60 * 1000,
  });
}
