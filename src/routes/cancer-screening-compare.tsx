import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CancerComparisonPage = lazy(() => import("@/pages/CancerComparisonPage"));

export const Route = createFileRoute("/cancer-screening-compare")({
  component: CancerComparisonPage,
});
