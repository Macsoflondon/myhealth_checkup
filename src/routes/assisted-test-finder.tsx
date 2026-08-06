import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AssistedTestFinderPage = lazy(() => import("@/pages/AssistedTestFinderPage"));

export const Route = createFileRoute("/assisted-test-finder")({
  head: () =>
    buildRouteHead({
      title: "Assisted Test Finder | myhealth checkup",
      description: "Guided help choosing a private blood test, matching your symptoms and health goals to relevant biomarkers and panels.",
      path: "/assisted-test-finder",
    }),
  component: AssistedTestFinderPage,
});
