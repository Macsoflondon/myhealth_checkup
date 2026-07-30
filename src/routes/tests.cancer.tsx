import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CancerScreeningPage = lazy(() => import("@/pages/CancerScreeningPage"));

export const Route = createFileRoute("/tests/cancer")({
  component: CancerScreeningPage,
});
