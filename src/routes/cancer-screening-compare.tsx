import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CancerComparisonPage = lazy(() => import("@/pages/CancerComparisonPage"));

export const Route = createFileRoute("/cancer-screening-compare")({
  head: () =>
    buildRouteHead({
      title: "Compare Private Cancer Screening UK",
      description: "Compare private cancer screening panels from accredited UK providers by biomarkers covered, price and turnaround time.",
      path: "/cancer-screening-compare",
    }),
  component: CancerComparisonPage,
});
