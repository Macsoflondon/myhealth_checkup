import { createFileRoute } from "@tanstack/react-router";
import { buildRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));

export const Route = createFileRoute("/privacy-policy")({
  head: () =>
    buildRouteHead({
      title: "Privacy Policy | myhealth checkup",
      description: "How myhealth checkup collects, uses and protects your personal data under UK GDPR and the Data Protection Act 2018.",
      path: "/privacy-policy",
    }),
  component: PrivacyPolicyPage,
});
