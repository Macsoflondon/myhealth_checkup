import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MedichecksMensHealthPage = lazy(() => import("@/pages/MedichecksMensHealthPage"));

export const Route = createFileRoute("/medichecks/mens-health")({
  component: MedichecksMensHealthPage,
});
