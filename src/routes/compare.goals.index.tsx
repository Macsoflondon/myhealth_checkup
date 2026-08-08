import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareByGoalPage = lazy(() => import("@/pages/CompareByGoalPage"));

export const Route = createFileRoute("/compare/goals/")({
  head: () =>
    buildRouteHead({
      title: "Compare blood tests by goal | myhealth checkup",
      description:
        "Compare private blood tests by health goal — energy, fertility, heart health, hormones, longevity and performance — on price, biomarkers and turnaround.",
      path: "/compare/goals",
    }),
  component: CompareByGoalPage,
});
