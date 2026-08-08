import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { goalPages } from "@/data/goalPages";

const GoalDetailPage = lazy(() => import("@/pages/GoalDetailPage"));

export const Route = createFileRoute("/compare/goals/$goalSlug")({
  head: ({ params }) => {
    const goal = goalPages.find((g) => g.slug === params.goalSlug);
    const name = goal?.name ?? "your goal";

    return buildRouteHead({
      title: `Compare tests for ${name} | myhealth checkup`,
      description: goal
        ? `Compare private blood tests for ${name.toLowerCase()}: price in GBP, biomarkers included, sample method and typical turnaround across UKAS-accredited UK providers.`
        : "Compare private blood tests by health goal: price in GBP, biomarkers included, sample method and typical turnaround across UKAS-accredited UK providers.",
      path: `/compare/goals/${params.goalSlug}`,
    });
  },
  component: GoalDetailPage,
});
