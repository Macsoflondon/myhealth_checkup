import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AtHomeTestsPage = lazy(() => import("@/pages/AtHomeTestsPage"));

export const Route = createFileRoute("/at-home-tests")({
  head: () =>
    buildRouteHead({
      title: "At Home Test Kits UK | Compare Prices",
      description: "Compare at home test kits from UK providers by category, price and biomarkers, with finger-prick collection and accredited laboratory analysis.",
      path: "/at-home-tests",
    }),
  component: AtHomeTestsPage,
});
