import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareTests = lazy(() => import("@/pages/CompareTests"));

export const Route = createFileRoute("/compare/")({
  head: () =>
    buildRouteHead({
      title: "Compare UK Blood Tests Side by Side",
      description: "Compare private blood tests across UK providers by price, biomarkers included, sample method and typical turnaround time.",
      path: "/compare",
    }),
  component: CompareTests,
});
