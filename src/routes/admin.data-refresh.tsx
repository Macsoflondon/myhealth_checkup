import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminDataRefreshPage = lazy(() => import("@/pages/AdminDataRefreshPage"));

export const Route = createFileRoute("/admin/data-refresh")({
  head: () => buildPrivateRouteHead("Data Refresh | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminDataRefreshPage />
      </AdminShell>
    </AdminRoute>
  ),
});
