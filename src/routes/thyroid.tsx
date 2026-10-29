import { createFileRoute } from "@tanstack/react-router";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ThyroidPage = lazy(() => import("@/pages/ThyroidPage"));

export const Route = createFileRoute("/thyroid")({
  head: () =>
    buildCollectionHead({
      title: "Compare thyroid blood tests UK | myhealth checkup",
      description:
        "Compare UK thyroid blood test prices and panels measuring TSH, FT4, FT3 and antibodies. Check biomarkers, sample collection options and typical result times.",
      path: "/thyroid",
    }),
  component: ThyroidPage,
});
