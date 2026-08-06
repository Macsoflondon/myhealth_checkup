import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MedicalReviewPage = lazy(() => import("@/pages/MedicalReviewPage"));

export const Route = createFileRoute("/about/medical-review")({
  head: () =>
    buildRouteHead({
      title: "Medical Review Process | myhealth checkup",
      description: "How our clinical content is reviewed, who reviews it and the evidence standards we apply to every health test guide we publish.",
      path: "/about/medical-review",
    }),
  component: MedicalReviewPage,
});
