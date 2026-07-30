import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminAlertRoutingPage = lazy(() => import("@/pages/AdminAlertRoutingPage"));

export const Route = createFileRoute("/admin/alert-routing")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminAlertRoutingPage />
      </AdminShell>
    </AdminRoute>
  ),
});
