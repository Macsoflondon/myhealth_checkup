import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareBySymptomPage = lazy(() => import("@/pages/CompareBySymptomPage"));

export const Route = createFileRoute("/compare/symptoms/")({
  head: () =>
    buildRouteHead({
      title: "Compare blood tests by symptom | myhealth checkup",
      description:
        "Compare private blood tests by symptom — fatigue, hair loss, low mood and more — on price in GBP, biomarkers included and typical turnaround.",
      path: "/compare/symptoms",
    }),
  component: CompareBySymptomPage,
});
