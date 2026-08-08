import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const Auth = lazy(() => import("@/pages/Auth"));

export const Route = createFileRoute("/auth")({
  head: () => buildPrivateRouteHead("Sign in | myhealth checkup"),
  component: Auth,
});
