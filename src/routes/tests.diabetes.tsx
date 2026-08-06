import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const DiabetesTestingPage = lazy(() => import("@/pages/DiabetesTestingPage"));

export const Route = createFileRoute("/tests/diabetes")({
  head: () =>
    buildRouteHead({
      title: "Diabetes Blood Tests UK | Compare",
      description: "Compare private diabetes and blood sugar tests including HbA1c, fasting glucose and insulin, with clear UK pricing.",
      path: "/tests/diabetes",
    }),
  component: DiabetesTestingPage,
});
