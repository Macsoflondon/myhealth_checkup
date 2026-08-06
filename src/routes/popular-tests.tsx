import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MostPopularTestsPage = lazy(() => import("@/pages/MostPopularTestsPage"));

export const Route = createFileRoute("/popular-tests")({
  head: () =>
    buildRouteHead({
      title: "Most Popular UK Blood Tests",
      description: "The private blood tests UK consumers compare most often, with pricing, biomarkers and typical turnaround times.",
      path: "/popular-tests",
    }),
  component: MostPopularTestsPage,
});
