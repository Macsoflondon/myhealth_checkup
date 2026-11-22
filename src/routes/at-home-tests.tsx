import { createFileRoute } from "@tanstack/react-router";
import {
  prefetchPublicListing,
  listingSubcategory,
} from "@/services/public-listing-prefetch";
import {
  CatalogueRouteError,
  CatalogueRouteNotFound,
} from "@/components/common/catalogue-route-status";
import { findAtHomeSection } from "@/config/atHomeSections";
import {
  buildSubcategoryHead,
  validateSubcategorySearch,
} from "@/lib/seo/subcategory-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AtHomeTestsPage = lazy(() => import("@/pages/AtHomeTestsPage"));

export const Route = createFileRoute("/at-home-tests")({
  loaderDeps: ({ search }) => ({ subcategory: listingSubcategory(search) }),
  loader: ({ context, deps, location }) =>
    prefetchPublicListing(
      context.queryClient,
      location.pathname,
      deps.subcategory,
    ),
  errorComponent: CatalogueRouteError,
  notFoundComponent: CatalogueRouteNotFound,

  validateSearch: validateSubcategorySearch,
  head: ({ match }) =>
    buildSubcategoryHead({
      title: "Compare at-home blood test kits UK | myhealth checkup",
      description:
        "Compare at-home test kits from UK providers by price and biomarkers: finger-prick, QuickDraw, saliva, stool and urine samples, analysed by accredited laboratories.",
      path: "/at-home-tests",
      subLabel: ((label) => (label ? `${label} at-home test kits` : null))(
        findAtHomeSection(match.search.subcategory)?.label,
      ),
    }),
  component: AtHomeTestsPage,
});
