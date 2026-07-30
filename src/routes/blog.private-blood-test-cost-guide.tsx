import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const PrivateBloodTestCostGuidePage = lazy(() => import("@/pages/PrivateBloodTestCostGuidePage"));

export const Route = createFileRoute("/blog/private-blood-test-cost-guide")({
  component: PrivateBloodTestCostGuidePage,
});
