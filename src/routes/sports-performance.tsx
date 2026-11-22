import { createFileRoute } from "@tanstack/react-router";
import {
  prefetchPublicListing,
  listingSubcategory,
} from "@/services/public-listing-prefetch";
import {
  CatalogueRouteError,
  CatalogueRouteNotFound,
} from "@/components/common/catalogue-route-status";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const SportsPerformancePage = lazy(
  () => import("@/pages/SportsPerformancePage"),
);

export const Route = createFileRoute("/sports-performance")({
  loaderDeps: ({ search }) => ({ subcategory: listingSubcategory(search) }),
  loader: ({ context, deps, location }) =>
    prefetchPublicListing(
      context.queryClient,
      location.pathname,
      deps.subcategory,
    ),
  errorComponent: CatalogueRouteError,
  notFoundComponent: CatalogueRouteNotFound,

  head: () =>
    buildRouteHead({
      title: "Sports and fitness blood tests UK",
      description:
        "Compare blood tests for training, recovery and performance, covering iron status, hormones, inflammation and energy markers.",
      path: "/sports-performance",
    }),
  component: SportsPerformancePage,
});
