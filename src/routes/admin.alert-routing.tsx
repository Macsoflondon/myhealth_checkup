import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminAlertRoutingPage = lazy(() => import("@/pages/AdminAlertRoutingPage"));

export const Route = createFileRoute("/admin/alert-routing")({
  head: () => buildPrivateRouteHead("Alert Routing | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminAlertRoutingPage />
      </AdminShell>
    </AdminRoute>
  ),
});
