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

const MostPopularTestsPage = lazy(() => import("@/pages/MostPopularTestsPage"));

export const Route = createFileRoute("/popular-tests")({
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
      title: "Most popular UK blood tests",
      description:
        "The private blood tests UK consumers compare most often, with pricing, biomarkers and typical turnaround times.",
      path: "/popular-tests",
    }),
  component: MostPopularTestsPage,
});
