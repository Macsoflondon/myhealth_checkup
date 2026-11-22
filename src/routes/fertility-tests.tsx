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

const FertilityTestsPage = lazy(() => import("@/pages/FertilityTestsPage"));

export const Route = createFileRoute("/fertility-tests")({
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
      title: "Fertility blood tests UK | myhealth checkup",
      description:
        "Compare private fertility tests including AMH, FSH, LH and progesterone from accredited UK providers, with clear pricing.",
      path: "/fertility-tests",
    }),
  component: FertilityTestsPage,
});
