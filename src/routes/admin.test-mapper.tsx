import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminTestMapperPage = lazy(() => import("@/pages/AdminTestMapperPage"));

export const Route = createFileRoute("/admin/test-mapper")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminTestMapperPage />
      </AdminShell>
    </AdminRoute>
  ),
});
