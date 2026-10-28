import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AtHomeTestsPage = lazy(() => import("@/pages/AtHomeTestsPage"));

export const Route = createFileRoute("/at-home-tests")({
  head: () =>
    buildRouteHead({
      title: "Compare UK At-Home Health Test Kits",
      description:
        "Compare at-home test kits from UK providers by price and biomarkers: finger-prick, QuickDraw, saliva, stool and urine samples, analysed by accredited laboratories.",
      path: "/at-home-tests",
    }),
  component: AtHomeTestsPage,
});
