import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareByGoalPage = lazy(() => import("@/pages/CompareByGoalPage"));

export const Route = createFileRoute("/compare/goals/")({
  head: () =>
    buildRouteHead({
      title: "Compare Blood Tests by Health Goal",
      description: "Compare private tests by goal: energy, fertility, heart health, hormone balance, longevity and sports performance.",
      path: "/compare/goals",
    }),
  component: CompareByGoalPage,
});
