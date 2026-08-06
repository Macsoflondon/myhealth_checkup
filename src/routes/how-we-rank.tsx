import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HowWeRankPage = lazy(() => import("@/pages/HowWeRankPage"));

export const Route = createFileRoute("/how-we-rank")({
  head: () =>
    buildRouteHead({
      title: "How We Rank Tests | myhealth checkup",
      description: "Our ranking method explained: no pay-to-rank, no provider marketing copy. See the factors behind every comparison we publish.",
      path: "/how-we-rank",
    }),
  component: HowWeRankPage,
});
