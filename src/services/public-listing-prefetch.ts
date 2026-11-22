import type { QueryClient } from "@tanstack/react-query";
import { categoryTestsQueryOptions } from "./category-catalogue";
import { mappedCategoryTestsQueryOptions } from "./mapped-category-catalogue";
import { findMappedWellnessCategory } from "@/config/mappedCategories";
import { testDetailsQueryOptions } from "@/hooks/queries/useTestDetailsByIds";

export const LISTING_CATEGORIES: Record<string, string> = {
  "/tests/heart": "heart",
  "/tests/diabetes": "diabetes",
  "/tests/vitamins": "vitamins",
  "/tests/womens-health": "womens-health",
  "/tests/mens-health": "mens-health",
  "/tests/cancer": "cancer-screening",
  "/tests/gut": "gut",
  "/hormones": "hormones",
  "/thyroid": "thyroid",
  "/fertility-tests": "fertility",
  "/wellness": "wellness",
  "/sports-performance": "sports-performance",
};

export function listingSubcategory(search: unknown): string | null {
  if (!search || typeof search !== "object" || !("subcategory" in search))
    return null;
  return typeof search.subcategory === "string" ? search.subcategory : null;
}

export async function prefetchPublicListing(
  queryClient: QueryClient,
  path: string,
  subcategory: string | null = null,
  dynamicCategory?: string,
) {
  if (path === "/at-home-tests") {
    const { atHomeTestsQueryOptions } =
      await import("@/hooks/queries/useAtHomeTests");
    await queryClient.ensureQueryData(atHomeTestsQueryOptions(queryClient));
    return;
  }
  if (path === "/popular-tests") {
    const { popularTestsQueryOptions } =
      await import("@/hooks/usePopularTestsFromDatabase");
    await queryClient.ensureQueryData(
      popularTestsQueryOptions(queryClient, 24),
    );
    return;
  }
  const canonical = LISTING_CATEGORIES[path];
  if (canonical) {
    const mapped =
      path === "/wellness" ? findMappedWellnessCategory(subcategory) : null;
    const tests = await queryClient.ensureQueryData(
      mapped
        ? mappedCategoryTestsQueryOptions(
            queryClient,
            mapped.slug,
            mapped.badgeColor,
          )
        : categoryTestsQueryOptions(queryClient, canonical, subcategory),
    );
    await queryClient.ensureQueryData(
      testDetailsQueryOptions(
        tests
          .filter((test) => test.detailsDeferred)
          .map((test) => String(test.id)),
      ),
    );
    return;
  }
  if (dynamicCategory) {
    const [
      { providersByCategoryQueryOptions },
      { recommendedTestsQueryOptions },
    ] = await Promise.all([
      import("@/hooks/queries/useProvidersByTestType"),
      import("@/hooks/queries/useRecommendedTests"),
    ]);
    await Promise.all([
      queryClient.ensureQueryData(
        providersByCategoryQueryOptions(dynamicCategory),
      ),
      queryClient.ensureQueryData(
        recommendedTestsQueryOptions(dynamicCategory, 8),
      ),
    ]);
  }
}
