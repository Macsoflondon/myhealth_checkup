import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WomensHealthPage = lazy(() => import("@/pages/WomensHealthPage"));

export const Route = createFileRoute("/tests/womens-health")({
  component: WomensHealthPage,
});
