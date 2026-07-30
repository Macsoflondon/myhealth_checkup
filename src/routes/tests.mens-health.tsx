import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MensHealthPage = lazy(() => import("@/pages/MensHealthPage"));

export const Route = createFileRoute("/tests/mens-health")({
  component: MensHealthPage,
});
