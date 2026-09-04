import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MedicalDiagnosisPage = lazy(() => import("@/pages/MedicalDiagnosisPage"));

export const Route = createFileRoute("/medical-diagnosis/")({
  head: () =>
    buildRouteHead({
      title: "Medical Diagnosis Blood Tests & Prices | myhealth checkup",
      description: "Compare Medical Diagnosis blood tests, biomarkers, turnaround times and prices in GBP.",
      path: "/medical-diagnosis",
    }),
  component: MedicalDiagnosisPage,
});
