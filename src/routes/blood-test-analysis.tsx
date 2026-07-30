import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BloodTestAnalysisPage = lazy(() => import("@/pages/BloodTestAnalysisPage"));

export const Route = createFileRoute("/blood-test-analysis")({
  component: BloodTestAnalysisPage,
});
