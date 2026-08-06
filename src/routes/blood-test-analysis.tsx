import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BloodTestAnalysisPage = lazy(() => import("@/pages/BloodTestAnalysisPage"));

export const Route = createFileRoute("/blood-test-analysis")({
  head: () =>
    buildRouteHead({
      title: "Blood Test Analysis Tool | myhealth checkup",
      description: "Understand what your blood test biomarkers mean in plain English, with context on typical reference ranges.",
      path: "/blood-test-analysis",
    }),
  component: BloodTestAnalysisPage,
});
