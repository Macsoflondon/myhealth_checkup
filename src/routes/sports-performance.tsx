import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const SportsPerformancePage = lazy(() => import("@/pages/SportsPerformancePage"));

export const Route = createFileRoute("/sports-performance")({
  head: () =>
    buildRouteHead({
      title: "Sports and Fitness Blood Tests UK",
      description: "Compare blood tests for training, recovery and performance, covering iron status, hormones, inflammation and energy markers.",
      path: "/sports-performance",
    }),
  component: SportsPerformancePage,
});
