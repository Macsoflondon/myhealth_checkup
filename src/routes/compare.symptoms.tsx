import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareBySymptomPage = lazy(() => import("@/pages/CompareBySymptomPage"));

export const Route = createFileRoute("/compare/symptoms")({
  head: () =>
    buildRouteHead({
      title: "Compare Blood Tests by Symptom",
      description: "Find private blood tests matched to symptoms such as fatigue, hair loss or low mood, then compare price and biomarkers across UK providers.",
      path: "/compare/symptoms",
    }),
  component: CompareBySymptomPage,
});
