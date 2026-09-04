import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminChangeLogPage = lazy(() => import("@/pages/AdminChangeLogPage"));

export const Route = createFileRoute("/admin/change-log")({
  head: () => buildPrivateRouteHead("Change Log | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminChangeLogPage />
      </AdminShell>
    </AdminRoute>
  ),
});
