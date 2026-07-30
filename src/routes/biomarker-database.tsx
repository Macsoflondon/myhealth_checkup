import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const BiomarkerDatabasePage = lazy(() => import("@/pages/BiomarkerDatabasePage"));

export const Route = createFileRoute("/biomarker-database")({
  component: BiomarkerDatabasePage,
});
