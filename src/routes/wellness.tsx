import { createFileRoute } from "@tanstack/react-router";
import { buildCollectionHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const WellnessPage = lazy(() => import("@/pages/WellnessPage"));

export const Route = createFileRoute("/wellness")({
  head: () =>
    buildCollectionHead({
      title: "Wellness blood test comparison UK | myhealth checkup",
      description:
        "Compare wellness blood test prices from UK providers. Check full biomarker lists, home and clinic collection options, fees and typical result times.",
      path: "/wellness",
    }),
  component: WellnessPage,
});
