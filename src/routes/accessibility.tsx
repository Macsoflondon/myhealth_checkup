import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AccessibilityPage = lazy(() => import("@/pages/AccessibilityPage"));

export const Route = createFileRoute("/accessibility")({
  head: () =>
    buildRouteHead({
      title: "Accessibility Statement | myhealth checkup",
      description: "Our commitment to accessible design, the standards we follow and how to report an accessibility problem.",
      path: "/accessibility",
    }),
  component: AccessibilityPage,
});
