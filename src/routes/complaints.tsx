import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ComplaintsPage = lazy(() => import("@/pages/ComplaintsPage"));

export const Route = createFileRoute("/complaints")({
  component: ComplaintsPage,
});
