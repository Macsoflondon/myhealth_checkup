import { createFileRoute } from "@tanstack/react-router";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const MensHealthPage = lazy(() => import("@/pages/MensHealthPage"));

export const Route = createFileRoute("/tests/mens-health")({
  head: () =>
    buildCollectionHead({
      title: "Men's health blood tests UK | myhealth checkup",
      description:
        "Compare private men's health panels covering testosterone, PSA, cholesterol and general wellbeing markers.",
      path: "/tests/mens-health",
    }),
  component: MensHealthPage,
});
