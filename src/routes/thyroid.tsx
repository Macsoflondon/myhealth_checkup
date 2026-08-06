import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ThyroidPage = lazy(() => import("@/pages/ThyroidPage"));

export const Route = createFileRoute("/thyroid")({
  head: () =>
    buildRouteHead({
      title: "Thyroid Blood Tests UK | Compare Prices",
      description: "Compare private thyroid tests measuring TSH, FT4, FT3 and thyroid antibodies, with pricing and turnaround from accredited UK laboratories.",
      path: "/thyroid",
    }),
  component: ThyroidPage,
});
