import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ModernSlaveryPage = lazy(() => import("@/pages/ModernSlaveryPage"));

export const Route = createFileRoute("/modern-slavery")({
  component: ModernSlaveryPage,
});
