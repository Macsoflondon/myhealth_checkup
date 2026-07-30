import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FertilityTestsPage = lazy(() => import("@/pages/FertilityTestsPage"));

export const Route = createFileRoute("/fertility-tests")({
  component: FertilityTestsPage,
});
