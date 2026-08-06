import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TestCategoriesPage = lazy(() => import("@/pages/TestCategoriesPage"));

export const Route = createFileRoute("/test-categories")({
  head: () =>
    buildRouteHead({
      title: "Blood Test Categories | myhealth checkup",
      description: "Browse every private blood test category we compare, from general health and hormones to cancer screening and vitamins.",
      path: "/test-categories",
    }),
  component: TestCategoriesPage,
});
