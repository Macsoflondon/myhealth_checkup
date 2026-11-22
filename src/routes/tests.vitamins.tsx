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

const VitaminDeficiencyPage = lazy(
  () => import("@/pages/VitaminDeficiencyPage"),
);

export const Route = createFileRoute("/tests/vitamins")({
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
      title: "Vitamin and mineral blood tests UK | myhealth checkup",
      description:
        "Compare private vitamin and mineral tests covering vitamin D, B12, folate, ferritin and more from accredited UK laboratories.",
      path: "/tests/vitamins",
    }),
  component: VitaminDeficiencyPage,
});
