import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const RecommendationsPage = lazy(() => import("@/pages/RecommendationsPage"));

export const Route = createFileRoute("/recommendations")({
  component: RecommendationsPage,
});
