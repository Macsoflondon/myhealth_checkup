import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MaleHormoneTestPage = lazy(() => import("@/pages/MaleHormoneTestPage"));

export const Route = createFileRoute("/test/male-hormones")({
  head: () =>
    buildRouteHead({
      title: "Male Hormone Blood Tests Compared | myhealth checkup",
      description: "Compare male hormone blood tests across UK providers: biomarkers, sample methods, turnaround times and prices in GBP.",
      path: "/test/male-hormones",
    }),
  component: MaleHormoneTestPage,
});
