import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { findSubcategory } from "@/config/subcategoryMap";
import {
  MAPPED_WELLNESS_CATEGORIES,
  MAPPED_WELLNESS_SLUGS,
} from "@/config/mappedCategories";
import { useMappedCategoryCounts } from "@/hooks/queries/useMappedCategoryTests";


/** One card's live-count definition. */
export interface WellnessCountSpec {
  /** Card id (also the key in the returned record). */
  id: string;
  /** canonical_category values that contribute to this card. */
  categories: string[];
  /** Optional wellness subcategory slug used to narrow the match. */
  subSlug?: string;
  /** Optional extra name/biomarker patterns when no subcategory applies. */
  matchAny?: RegExp[];
}

interface CountRow {
  test_name: string | null;
  description: string | null;
  biomarkers_list: unknown;
  canonical_category: string | null;
}

/**
 * Live per-card test counts for the Wellness landing grid. Cards that have a
 * real taxonomy row are counted from `category_test_mapping`; the remainder
 * are counted client-side against their category/pattern spec.
 */
export function useWellnessCategoryCounts(specs: WellnessCountSpec[]) {
  const specKey = specs.map((s) => s.id).join(",");
  const { data: mappedCounts } = useMappedCategoryCounts(MAPPED_WELLNESS_SLUGS);

  const legacy = useQuery({
    queryKey: ["wellness-category-counts", specKey],

    queryFn: async (): Promise<Record<string, number>> => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("test_name,description,biomarkers_list,canonical_category")
        .eq("is_active", true)
        .not("image_url", "is", null)
        .not("url", "is", null);

      if (error) throw error;
      const rows = (data ?? []) as CountRow[];

      const counts: Record<string, number> = {};
      for (const spec of specs) {
        const sub = spec.subSlug ? findSubcategory("wellness", spec.subSlug) : null;
        const patterns = sub?.matchAny ?? spec.matchAny ?? null;
        const categories = new Set(sub?.siblingCategories ?? spec.categories);
        for (const c of spec.categories) categories.add(c);

        counts[spec.id] = rows.filter((row) => {
          if (!row.canonical_category || !categories.has(row.canonical_category)) return false;
          if (!patterns) return true;
          const biomarkers = Array.isArray(row.biomarkers_list)
            ? (row.biomarkers_list as unknown[]).map(String)
            : [];
          return patterns.some((rx) =>
            rx.test([row.test_name ?? "", row.description ?? "", ...biomarkers].join(" \u0001 "))
          );
        }).length;
      }
      return counts;
    },
    staleTime: 5 * 60 * 1000,
  });

  // Overlay taxonomy-backed counts on top of the pattern-derived ones.
  const merged: Record<string, number> | undefined = legacy.data || mappedCounts
    ? {
        ...(legacy.data ?? {}),
        ...Object.fromEntries(
          Object.entries(MAPPED_WELLNESS_CATEGORIES)
            .map(([cardId, def]) => [cardId, mappedCounts?.[def.slug]] as const)
            .filter((entry): entry is readonly [string, number] => entry[1] !== undefined)
        ),
      }
    : undefined;

  return { ...legacy, data: merged };
}

