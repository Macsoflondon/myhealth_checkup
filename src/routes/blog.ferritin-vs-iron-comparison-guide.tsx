import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FerritinVsIronComparisonGuidePage = lazy(() => import("@/pages/FerritinVsIronComparisonGuidePage"));

export const Route = createFileRoute("/blog/ferritin-vs-iron-comparison-guide")({
  component: FerritinVsIronComparisonGuidePage,
});
