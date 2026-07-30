import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HiddenGapDetectorPage = lazy(() => import("@/pages/HiddenGapDetectorPage"));

export const Route = createFileRoute("/hidden-gap-detector")({
  component: HiddenGapDetectorPage,
});
