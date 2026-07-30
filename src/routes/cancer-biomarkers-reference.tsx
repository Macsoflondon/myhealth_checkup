import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CancerBiomarkersReferencePage = lazy(() => import("@/pages/CancerBiomarkersReferencePage"));

export const Route = createFileRoute("/cancer-biomarkers-reference")({
  component: CancerBiomarkersReferencePage,
});
