import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CancerBiomarkersReferencePage = lazy(() => import("@/pages/CancerBiomarkersReferencePage"));

export const Route = createFileRoute("/cancer-biomarkers-reference")({
  head: () =>
    buildRouteHead({
      title: "Cancer Biomarkers Reference Guide",
      description: "A plain-English reference to tumour markers and screening biomarkers used in private cancer screening in the UK.",
      path: "/cancer-biomarkers-reference",
    }),
  component: CancerBiomarkersReferencePage,
});
