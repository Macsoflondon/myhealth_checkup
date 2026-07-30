import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HeartHealthPage = lazy(() => import("@/pages/HeartHealthPage"));

export const Route = createFileRoute("/tests/heart")({
  component: HeartHealthPage,
});
