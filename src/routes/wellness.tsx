import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellnessPage = lazy(() => import("@/pages/WellnessPage"));

export const Route = createFileRoute("/wellness")({
  component: WellnessPage,
});
