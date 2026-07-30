import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareTests = lazy(() => import("@/pages/CompareTests"));

export const Route = createFileRoute("/compare")({
  component: CompareTests,
});
