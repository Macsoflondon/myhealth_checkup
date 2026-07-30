import { CategoryPageLayout, CategoryPageLayoutProps } from "./CategoryPageLayout";
import { useMappedCategoryTests } from "@/hooks/queries/useMappedCategoryTests";
import type { MappedCategoryDef } from "@/config/mappedCategories";

interface Props extends Omit<CategoryPageLayoutProps, "tests"> {
  category: MappedCategoryDef;
}

/**
 * Category page sourced from the `category_test_mapping` taxonomy rather than
 * canonical_category/regex matching. Used by wellness cards that now have
 * their own clean category rows in Supabase.
 */
export function MappedCategoryPage({ category, ...rest }: Props) {
  const { data } = useMappedCategoryTests(category.slug, category.badgeColor);
  return <CategoryPageLayout {...rest} tests={data ?? []} />;
}
