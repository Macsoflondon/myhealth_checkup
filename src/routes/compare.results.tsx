import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ComparisonResultsPage = lazy(() => import("@/pages/ComparisonResultsPage"));

export const Route = createFileRoute("/compare/results")({
  component: ComparisonResultsPage,
});
