import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminPerformancePage = lazy(() => import("@/pages/AdminPerformancePage"));

export const Route = createFileRoute("/admin/performance")({
  head: () => buildPrivateRouteHead("Performance | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminPerformancePage />
      </AdminShell>
    </AdminRoute>
  ),
});
