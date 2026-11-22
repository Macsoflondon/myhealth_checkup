import { createFileRoute } from "@tanstack/react-router";
import {
  prefetchPublicListing,
  listingSubcategory,
} from "@/services/public-listing-prefetch";
import {
  CatalogueRouteError,
  CatalogueRouteNotFound,
} from "@/components/common/catalogue-route-status";
import { findSubcategory } from "@/config/subcategoryMap";
import {
  buildSubcategoryHead,
  validateSubcategorySearch,
} from "@/lib/seo/subcategory-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellnessPage = lazy(() => import("@/pages/WellnessPage"));

export const Route = createFileRoute("/wellness")({
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
      title: "General health blood tests UK | myhealth checkup",
      description:
        "Compare wellness blood test prices from UK providers. Check full biomarker lists, home and clinic collection options, fees and typical result times.",
      path: "/wellness",
      subLabel: findSubcategory("wellness", match.search.subcategory)?.label,
    }),
  component: WellnessPage,
});
