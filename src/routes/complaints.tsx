import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ComplaintsPage = lazy(() => import("@/pages/ComplaintsPage"));

export const Route = createFileRoute("/complaints")({
  head: () =>
    buildRouteHead({
      title: "Complaints and Feedback | myhealth checkup",
      description: "How to raise a complaint or send feedback about myhealth checkup, and what happens after you contact us.",
      path: "/complaints",
    }),
  component: ComplaintsPage,
});
