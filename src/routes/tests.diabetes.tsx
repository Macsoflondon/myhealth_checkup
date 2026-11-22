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

const DiabetesTestingPage = lazy(() => import("@/pages/DiabetesTestingPage"));

export const Route = createFileRoute("/tests/diabetes")({
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
      title: "Diabetes blood tests UK | myhealth checkup",
      description:
        "Compare private diabetes and blood sugar tests including HbA1c, fasting glucose and insulin, with clear UK pricing.",
      path: "/tests/diabetes",
    }),
  component: DiabetesTestingPage,
});
