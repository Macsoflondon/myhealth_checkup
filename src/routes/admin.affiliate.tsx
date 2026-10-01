import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminAffiliatePage = lazy(() => import("@/pages/AdminAffiliatePage"));

export const Route = createFileRoute("/admin/affiliate")({
  head: () =>
    buildPrivateRouteHead("Affiliate performance | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminAffiliatePage />
      </AdminShell>
    </AdminRoute>
  ),
});
