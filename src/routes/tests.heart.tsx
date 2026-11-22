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

const HeartHealthPage = lazy(() => import("@/pages/HeartHealthPage"));

export const Route = createFileRoute("/tests/heart")({
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
      title: "Heart health blood tests UK | myhealth checkup",
      description:
        "Compare cardiovascular blood tests covering cholesterol, lipoprotein(a), ApoB and inflammation markers from UK providers.",
      path: "/tests/heart",
    }),
  component: HeartHealthPage,
});
