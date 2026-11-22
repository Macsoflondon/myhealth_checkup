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

const MensHealthPage = lazy(() => import("@/pages/MensHealthPage"));

export const Route = createFileRoute("/tests/mens-health")({
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
      title: "Men's health blood tests UK | myhealth checkup",
      description:
        "Compare private men's health panels covering testosterone, PSA, cholesterol and general wellbeing markers.",
      path: "/tests/mens-health",
      subLabel: findSubcategory("mens-health", match.search.subcategory)?.label,
    }),
  component: MensHealthPage,
});
