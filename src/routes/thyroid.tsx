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

const ThyroidPage = lazy(() => import("@/pages/ThyroidPage"));

export const Route = createFileRoute("/thyroid")({
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
      title: "Compare thyroid blood tests UK | myhealth checkup",
      description:
        "Compare UK thyroid blood test prices and panels measuring TSH, FT4, FT3 and antibodies. Check biomarkers, sample collection options and typical result times.",
      path: "/thyroid",
    }),
  component: ThyroidPage,
});
