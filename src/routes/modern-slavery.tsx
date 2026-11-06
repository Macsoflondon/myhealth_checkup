import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ModernSlaveryPage = lazy(() => import("@/pages/ModernSlaveryPage"));

export const Route = createFileRoute("/modern-slavery")({
  head: () =>
    buildRouteHead({
      title: "Modern slavery statement | myhealth checkup",
      description:
        "MYHEALTHCHECKUP LTD's statement on modern slavery and ethical supply chain practices.",
      path: "/modern-slavery",
    }),
  component: ModernSlaveryPage,
});
