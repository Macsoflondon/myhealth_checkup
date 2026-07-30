import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LondonMedicalLaboratoryPage = lazy(() => import("@/pages/LondonMedicalLaboratoryPage"));

export const Route = createFileRoute("/london-medical-laboratory")({
  component: LondonMedicalLaboratoryPage,
});
