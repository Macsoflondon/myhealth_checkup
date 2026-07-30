import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { findSubcategory, testMatchesSubcategory } from "@/config/subcategoryMap";
import {
  BADGE_COLOR_BY_CATEGORY,
  CATEGORY_TEST_COLUMNS,
  mapProviderTestRow,
  type ProviderTestRow,
} from "@/lib/categoryTestMapper";

export function useCategoryTests(canonicalCategory: string, subcategory?: string | null) {
  const sub = findSubcategory(canonicalCategory, subcategory ?? null);
  return useQuery({
    queryKey: ["category-tests-db", canonicalCategory, sub?.slug ?? null],
    queryFn: async (): Promise<CategoryTestItem[]> => {
      // DHT applies to both sexes — surface it on Men's and Women's pages
      // while keeping its canonical_category as 'hormones'.
      const includeDht =
        canonicalCategory === "mens-health" || canonicalCategory === "womens-health";

      let query = supabase
        .from("provider_tests")
        .select(CATEGORY_TEST_COLUMNS)
        .eq("is_active", true)
        .not("image_url", "is", null)
        .not("url", "is", null);

      const siblings = sub?.siblingCategories ?? [];
      const cats = Array.from(new Set([canonicalCategory, ...siblings]));
      const inList = cats.map((c) => `"${c}"`).join(",");

      if (includeDht) {
        query = query.or(
          `canonical_category.in.(${inList}),and(canonical_category.eq.hormones,test_name.ilike.%dihydrotestosterone%)`
        );
      } else {
        query = query.in("canonical_category", cats);
      }

      const { data, error } = await query
        .order("is_popular", { ascending: false })
        .order("popularity_rank", { ascending: true, nullsFirst: false })
        .order("price", { ascending: true });

      if (error) throw error;
      if (!data) return [];

      const badgeColor = BADGE_COLOR_BY_CATEGORY[canonicalCategory] || "#3B82F6";
      const mapped = (data as unknown as ProviderTestRow[]).map((row) =>
        mapProviderTestRow(row, badgeColor)
      );

      if (!sub) return mapped;
      return mapped.filter((t) =>
        testMatchesSubcategory(sub, {
          title: t.title,
          biomarkers: t.biomarkers,
          tag: t.tag,
          desc: t.desc,
        })
      );
    },
    staleTime: 5 * 60 * 1000,
  });
}
