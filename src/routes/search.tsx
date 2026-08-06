import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const IntelligentSearchPage = lazy(() => import("@/pages/IntelligentSearchPage"));

export const Route = createFileRoute("/search")({
  head: () =>
    buildRouteHead({
      title: "Search UK Blood Tests",
      description: "Search hundreds of private blood tests from UK providers by name, biomarker or category.",
      path: "/search",
    }),
  component: IntelligentSearchPage,
});
