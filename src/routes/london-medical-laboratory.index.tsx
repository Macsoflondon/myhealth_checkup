import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const LondonMedicalLaboratoryPage = lazy(() => import("@/pages/LondonMedicalLaboratoryPage"));

export const Route = createFileRoute("/london-medical-laboratory/")({
  head: () =>
    buildRouteHead({
      title: "London Medical Laboratory Tests | myhealth checkup",
      description: "Compare London Medical Laboratory blood tests, biomarkers, sample methods and prices in GBP.",
      path: "/london-medical-laboratory",
    }),
  component: LondonMedicalLaboratoryPage,
});
