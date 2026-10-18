import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";

const ControlPage = lazy(() => import("@/pages/ControlPage"));

export const Route = createFileRoute("/control/")({
  head: () => buildPrivateRouteHead("Crux Control | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <ControlPage />
    </AdminRoute>
  ),
});
