import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const OAuthConsent = lazy(() => import("@/pages/OAuthConsent"));

export const Route = createFileRoute("/.lovable/oauth/consent")({
  component: OAuthConsent,
});
