import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CompareBySymptomPage = lazy(() => import("@/pages/CompareBySymptomPage"));

export const Route = createFileRoute("/compare/symptoms")({
  component: CompareBySymptomPage,
});
