import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const HowItWorksPage = lazy(() => import("@/pages/HowItWorksPage"));

export const Route = createFileRoute("/how-it-works")({
  component: HowItWorksPage,
});
