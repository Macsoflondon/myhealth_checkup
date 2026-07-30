import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AccessibilityPage = lazy(() => import("@/pages/AccessibilityPage"));

export const Route = createFileRoute("/accessibility")({
  component: AccessibilityPage,
});
