import { useSearchParams } from "react-router-dom";
import { CategoryPageLayout, CategoryPageLayoutProps, CategoryTestItem } from "./CategoryPageLayout";
import { useCategoryTests } from "@/hooks/queries/useCategoryTests";
import { findSubcategory } from "@/config/subcategoryMap";

interface Props extends Omit<CategoryPageLayoutProps, "tests"> {
  canonicalCategory: string;
  /** Optional fallback tests shown if DB returns zero rows for this category */
  fallbackTests?: CategoryTestItem[];
}

/**
 * Database-driven wrapper around CategoryPageLayout.
 * Pulls live provider_tests filtered by canonical_category, mapped to the
 * card item shape. Falls back to provided hardcoded list only if DB empty
 * (e.g. category not yet scraped). Reads ?subcategory= from the URL and
 * narrows both the DB query and the client-side result set.
 */
export function DbCategoryPage({ canonicalCategory, fallbackTests = [], ...rest }: Props) {
  const [params] = useSearchParams();
  const subSlug = params.get("subcategory");
  const sub = findSubcategory(canonicalCategory, subSlug);

  const { data, isLoading } = useCategoryTests(canonicalCategory, sub?.slug ?? null);
  const tests = (data && data.length > 0) ? data : (isLoading ? [] : fallbackTests);

  const layoutProps: CategoryPageLayoutProps = sub
    ? (() => {
        // Derive parent path from the provided canonicalUrl (strip host + query).
        const parentPath = (() => {
          try {
            return new URL(rest.canonicalUrl).pathname.replace(/\/$/, "") || "/";
          } catch {
            return rest.canonicalUrl;
          }
        })();
        const canonicalUrl = `https://myhealthcheckup.co.uk${parentPath}?subcategory=${sub.slug}`;
        const parentTitleRoot = rest.seoTitle.split("|")[0].trim();
        return {
          ...rest,
          seoTitle: `${sub.label} — ${parentTitleRoot} | myhealth checkup`,
          seoDescription: `Compare ${sub.label.toLowerCase()} from UKAS-accredited UK providers. ${rest.seoDescription}`,
          canonicalUrl,
          pillLabel: sub.label,
          headline: sub.label,
          breadcrumbs: [
            ...rest.breadcrumbs.filter((b) => b.label !== sub.label).map((b) =>
              b.href === undefined && b.label !== "Home"
                ? { ...b, href: parentPath }
                : b
            ),
            { label: sub.label },
          ],
          tests,
        };
      })()
    : { ...rest, tests };

  return <CategoryPageLayout {...layoutProps} />;
}
