import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";

const AdminAuth = lazy(() => import("@/pages/AdminAuth"));

export const Route = createFileRoute("/admin/login")({
  head: () => buildPrivateRouteHead("Login | Admin | myhealth checkup"),
  component: AdminAuth,
});
