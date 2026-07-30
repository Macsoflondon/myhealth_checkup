import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const GoalDetailPage = lazy(() => import("@/pages/GoalDetailPage"));

export const Route = createFileRoute("/compare/goals/$goalSlug")({
  component: GoalDetailPage,
});
