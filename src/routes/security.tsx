import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TrustCentrePage = lazy(() => import("@/pages/TrustCentrePage"));

export const Route = createFileRoute("/security")({
  component: TrustCentrePage,
});
