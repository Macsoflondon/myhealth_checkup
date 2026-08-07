import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ClinilabsPage = lazy(() => import("@/pages/ClinilabsPage"));

export const Route = createFileRoute("/clinilabs/")({
  component: ClinilabsPage,
});
