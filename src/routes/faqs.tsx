import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const FAQsPage = lazy(() => import("@/pages/FAQsPage"));

export const Route = createFileRoute("/faqs")({
  head: () =>
    buildRouteHead({
      title: "Private Blood Test FAQs | myhealth checkup",
      description: "Answers to common questions about private blood testing in the UK: accuracy, accreditation, pricing, turnaround times and how results work.",
      path: "/faqs",
    }),
  component: FAQsPage,
});
