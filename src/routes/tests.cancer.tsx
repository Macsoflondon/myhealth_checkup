import { createFileRoute } from "@tanstack/react-router";
import {
  prefetchPublicListing,
  listingSubcategory,
} from "@/services/public-listing-prefetch";
import {
  CatalogueRouteError,
  CatalogueRouteNotFound,
} from "@/components/common/catalogue-route-status";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CancerScreeningPage = lazy(() => import("@/pages/CancerScreeningPage"));

export const Route = createFileRoute("/tests/cancer")({
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
    buildCollectionHead({
      title: "Cancer screening tests UK | myhealth checkup",
      description:
        "Compare private cancer screening tests from accredited UK providers by biomarkers, price and turnaround time.",
      path: "/tests/cancer",
    }),
  component: CancerScreeningPage,
});
