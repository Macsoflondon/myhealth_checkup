import { CategoryPageLayout, CategoryPageLayoutProps, CategoryTestItem } from "./CategoryPageLayout";
import { useCategoryTests } from "@/hooks/queries/useCategoryTests";

interface Props extends Omit<CategoryPageLayoutProps, "tests"> {
  canonicalCategory: string;
  /** Optional fallback tests shown if DB returns zero rows for this category */
  fallbackTests?: CategoryTestItem[];
}

/**
 * Database-driven wrapper around CategoryPageLayout.
 * Pulls live provider_tests filtered by canonical_category, mapped to the
 * card item shape. Falls back to provided hardcoded list only if DB empty
 * (e.g. category not yet scraped).
 */
export function DbCategoryPage({ canonicalCategory, fallbackTests = [], ...rest }: Props) {
  const { data, isLoading } = useCategoryTests(canonicalCategory);
  const tests = (data && data.length > 0) ? data : (isLoading ? [] : fallbackTests);
  return <CategoryPageLayout {...rest} tests={tests} />;
}
