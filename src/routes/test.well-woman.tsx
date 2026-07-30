import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellWomanTestPage = lazy(() => import("@/pages/WellWomanTestPage"));

export const Route = createFileRoute("/test/well-woman")({
  component: WellWomanTestPage,
});
