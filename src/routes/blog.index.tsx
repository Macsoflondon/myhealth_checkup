import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { providerArticlesQuery } from "@/lib/blog/article-query";

const HealthBlogPage = lazy(() => import("@/pages/HealthBlogPage"));

export const Route = createFileRoute("/blog/")({
  loader: ({ context }) =>
    context.queryClient.ensureQueryData(providerArticlesQuery),
  head: () =>
    buildRouteHead({
      title: "Health Resource Hub | myhealth checkup",
      description:
        "Evidence-led articles on private diagnostics in the UK: what to test, how testing works and how to read your results.",
      path: "/blog",
    }),
  component: HealthBlogPage,
});
