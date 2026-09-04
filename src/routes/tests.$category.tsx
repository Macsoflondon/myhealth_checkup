import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CategoryLandingPage = lazy(() => import("@/pages/CategoryLandingPage"));

const toLabel = (slug: string): string =>
  slug
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const Route = createFileRoute("/tests/$category")({
  head: ({ params }) => {
    const label = toLabel(params.category);
    return buildRouteHead({
      title: `${label} Blood Tests Compared | myhealth checkup`,
      description: `Compare ${label.toLowerCase()} blood tests from UK providers: biomarkers included, sample methods, turnaround times and prices in GBP.`,
      path: `/tests/${params.category}`,
    });
  },
  component: CategoryLandingPage,
});
