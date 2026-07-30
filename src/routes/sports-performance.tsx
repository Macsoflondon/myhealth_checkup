import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const SportsPerformancePage = lazy(() => import("@/pages/SportsPerformancePage"));

export const Route = createFileRoute("/sports-performance")({
  component: SportsPerformancePage,
});
