import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const GutHealthPage = lazy(() => import("@/pages/GutHealthPage"));

export const Route = createFileRoute("/tests/gut")({
  component: GutHealthPage,
});
