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

const CategoryLandingPage = lazy(() => import("@/pages/CategoryLandingPage"));

// Sentence case: capitalise only the first word of the slug.
const toLabel = (slug: string): string => {
  const words = slug.split("-").filter(Boolean).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
};

export const Route = createFileRoute("/tests/$category")({
  loaderDeps: ({ search }) => ({ subcategory: listingSubcategory(search) }),
  loader: ({ context, deps, location, params }) =>
    prefetchPublicListing(
      context.queryClient,
      location.pathname,
      deps.subcategory,
      params.category,
    ),
  errorComponent: CatalogueRouteError,
  notFoundComponent: CatalogueRouteNotFound,

  head: ({ params }) => {
    const label = toLabel(params.category);
    return buildRouteHead({
      title: `${label} blood tests compared | myhealth checkup`,
      description: `Compare ${label.toLowerCase()} blood tests from UK providers: biomarkers included, sample methods, turnaround times and prices in GBP.`,
      path: `/tests/${params.category}`,
    });
  },
  component: CategoryLandingPage,
});
