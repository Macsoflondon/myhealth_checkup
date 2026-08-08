import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

export const Route = createFileRoute("/reset-password")({
  head: () => buildPrivateRouteHead("Reset password | myhealth checkup"),
  component: ResetPassword,
});
