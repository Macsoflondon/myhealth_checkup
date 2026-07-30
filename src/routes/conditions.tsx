import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ConditionsPage = lazy(() => import("@/pages/ConditionsPage"));

export const Route = createFileRoute("/conditions")({
  component: ConditionsPage,
});
