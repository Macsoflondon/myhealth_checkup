import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AboutUsPage = lazy(() => import("@/pages/AboutUsPage"));

export const Route = createFileRoute("/about")({
  component: AboutUsPage,
});
