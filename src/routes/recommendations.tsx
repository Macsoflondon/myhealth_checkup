import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const RecommendationsPage = lazy(() => import("@/pages/RecommendationsPage"));

export const Route = createFileRoute("/recommendations")({
  head: () =>
    buildRouteHead({
      title: "Your Test Recommendations | myhealth checkup",
      description: "Review private blood tests matched to your answers, with biomarkers, prices in GBP and turnaround times side by side.",
      path: "/recommendations",
    }),
  component: RecommendationsPage,
});
