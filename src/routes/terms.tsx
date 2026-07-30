import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const TermsConditionsPage = lazy(() => import("@/pages/TermsConditionsPage"));

export const Route = createFileRoute("/terms")({
  component: TermsConditionsPage,
});
