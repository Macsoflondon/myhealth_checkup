import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TestFinderComparePage = lazy(() => import("@/pages/TestFinderComparePage"));

export const Route = createFileRoute("/find-test/compare")({
  component: TestFinderComparePage,
});
