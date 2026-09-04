import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MedichecksMensHealthPage = lazy(() => import("@/pages/MedichecksMensHealthPage"));

export const Route = createFileRoute("/medichecks/mens-health")({
  head: () =>
    buildRouteHead({
      title: "Medichecks Men's Health Blood Tests | myhealth checkup",
      description: "Compare Medichecks men's health blood tests: biomarkers covered, sample methods, turnaround times and prices in GBP.",
      path: "/medichecks/mens-health",
    }),
  component: MedichecksMensHealthPage,
});
