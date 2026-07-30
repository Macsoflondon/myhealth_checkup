import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const GeneralHealthTestPage = lazy(() => import("@/pages/GeneralHealthTestPage"));

export const Route = createFileRoute("/test/general-health")({
  component: GeneralHealthTestPage,
});
