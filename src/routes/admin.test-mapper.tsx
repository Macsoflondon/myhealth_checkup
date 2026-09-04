import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminTestMapperPage = lazy(() => import("@/pages/AdminTestMapperPage"));

export const Route = createFileRoute("/admin/test-mapper")({
  head: () => buildPrivateRouteHead("Test Mapper | Admin | myhealth checkup"),
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminTestMapperPage />
      </AdminShell>
    </AdminRoute>
  ),
});
