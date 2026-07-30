import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareByGoalPage = lazy(() => import("@/pages/CompareByGoalPage"));

export const Route = createFileRoute("/compare/goals")({
  component: CompareByGoalPage,
});
