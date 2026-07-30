import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TestosteroneLevelsByAgePage = lazy(() => import("@/pages/TestosteroneLevelsByAgePage"));

export const Route = createFileRoute("/blog/testosterone-levels-by-age")({
  component: TestosteroneLevelsByAgePage,
});
