import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MensHealthPage = lazy(() => import("@/pages/MensHealthPage"));

export const Route = createFileRoute("/tests/mens-health")({
  head: () =>
    buildRouteHead({
      title: "Men's Health Blood Tests UK | Compare",
      description: "Compare private men's health panels covering testosterone, PSA, cholesterol and general wellbeing markers.",
      path: "/tests/mens-health",
    }),
  component: MensHealthPage,
});
