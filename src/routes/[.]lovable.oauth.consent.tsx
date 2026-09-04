import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const OAuthConsent = lazy(() => import("@/pages/OAuthConsent"));

export const Route = createFileRoute("/.lovable/oauth/consent")({
  head: () => buildPrivateRouteHead("Authorise Access | myhealth checkup"),
  component: OAuthConsent,
});
