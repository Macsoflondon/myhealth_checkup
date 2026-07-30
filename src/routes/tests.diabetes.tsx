import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const DiabetesTestingPage = lazy(() => import("@/pages/DiabetesTestingPage"));

export const Route = createFileRoute("/tests/diabetes")({
  component: DiabetesTestingPage,
});
