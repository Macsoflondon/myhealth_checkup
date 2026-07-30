import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MedicalDiagnosisPage = lazy(() => import("@/pages/MedicalDiagnosisPage"));

export const Route = createFileRoute("/medical-diagnosis")({
  component: MedicalDiagnosisPage,
});
