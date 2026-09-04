import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HiddenGapDetectorPage = lazy(() => import("@/pages/HiddenGapDetectorPage"));

export const Route = createFileRoute("/hidden-gap-detector")({
  head: () =>
    buildRouteHead({
      title: "Hidden Gap Detector | myhealth checkup",
      description: "Find the biomarkers your current blood test panel leaves out, and see which UK tests cover them.",
      path: "/hidden-gap-detector",
    }),
  component: HiddenGapDetectorPage,
});
