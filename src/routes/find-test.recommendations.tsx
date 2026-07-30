import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TestFinderRecommendationsPage = lazy(() => import("@/pages/TestFinderRecommendationsPage"));

export const Route = createFileRoute("/find-test/recommendations")({
  component: TestFinderRecommendationsPage,
});
