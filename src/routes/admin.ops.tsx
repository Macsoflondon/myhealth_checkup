import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminOpsPage = lazy(() => import("@/pages/AdminOpsPage"));

export const Route = createFileRoute("/admin/ops")({
  head: () => buildPrivateRouteHead("Ops | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminOpsPage />
      </AdminShell>
    </AdminRoute>
  ),
});
