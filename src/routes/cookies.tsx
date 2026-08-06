import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const CookiePolicyPage = lazy(() => import("@/pages/CookiePolicyPage"));

export const Route = createFileRoute("/cookies")({
  head: () =>
    buildRouteHead({
      title: "Cookie Policy | myhealth checkup",
      description: "The cookies myhealth checkup uses, what each one does and how to manage your preferences.",
      path: "/cookies",
    }),
  component: CookiePolicyPage,
});
