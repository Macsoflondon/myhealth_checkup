import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TestDetailPage = lazy(() => import("@/pages/TestDetailPage"));

export const Route = createFileRoute("/provider/$providerId/tests/$testId")({
  component: TestDetailPage,
});
