import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const SymptomDetailPage = lazy(() => import("@/pages/SymptomDetailPage"));

export const Route = createFileRoute("/compare/symptoms/$symptomSlug")({
  component: SymptomDetailPage,
});
