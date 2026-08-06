import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BiomarkerDatabasePage = lazy(() => import("@/pages/BiomarkerDatabasePage"));

export const Route = createFileRoute("/biomarker-database")({
  head: () =>
    buildRouteHead({
      title: "Biomarker Library | myhealth checkup",
      description: "A reference library of the biomarkers measured by UK private blood tests, what each one indicates and which panels include it.",
      path: "/biomarker-database",
    }),
  component: BiomarkerDatabasePage,
});
