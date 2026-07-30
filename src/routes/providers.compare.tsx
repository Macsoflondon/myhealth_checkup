import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ProviderComparisonPage = lazy(() => import("@/pages/ProviderComparisonPage"));

export const Route = createFileRoute("/providers/compare")({
  component: ProviderComparisonPage,
});
