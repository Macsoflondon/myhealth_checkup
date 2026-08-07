import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AssistedTestFinderPage = lazy(() => import("@/pages/AssistedTestFinderPage"));

export const Route = createFileRoute("/find-test/")({
  head: () =>
    buildRouteHead({
      title: "AI Health Test Finder | myhealth checkup",
      description: "Answer a short set of questions and get private blood test suggestions matched to your symptoms, goals and budget.",
      path: "/find-test",
    }),
  component: AssistedTestFinderPage,
});
