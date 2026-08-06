import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ComparisonResultsPage = lazy(() => import("@/pages/ComparisonResultsPage"));

export const Route = createFileRoute("/compare/results")({
  head: () =>
    buildRouteHead({
      title: "Your Test Comparison | myhealth checkup",
      description: "Your selected private blood tests side by side: price in GBP, biomarkers included, sample method and typical turnaround.",
      path: "/compare/results",
    }),
  component: ComparisonResultsPage,
});
