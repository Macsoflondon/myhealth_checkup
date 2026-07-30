import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TotalVsFreeTestosteroneGuidePage = lazy(() => import("@/pages/TotalVsFreeTestosteroneGuidePage"));

export const Route = createFileRoute("/blog/total-vs-free-testosterone")({
  component: TotalVsFreeTestosteroneGuidePage,
});
