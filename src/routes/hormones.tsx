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

const HormonesPage = lazy(() => import("@/pages/HormonesPage"));

export const Route = createFileRoute("/hormones")({
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
      title: "Hormone blood tests UK | myhealth checkup",
      description:
        "Compare private hormone panels covering testosterone, oestradiol, cortisol and more, with full biomarker detail and UK pricing.",
      path: "/hormones",
    }),
  component: HormonesPage,
});
