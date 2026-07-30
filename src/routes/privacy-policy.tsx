import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));

export const Route = createFileRoute("/privacy-policy")({
  component: PrivacyPolicyPage,
});
