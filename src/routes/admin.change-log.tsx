import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminChangeLogPage = lazy(() => import("@/pages/AdminChangeLogPage"));

export const Route = createFileRoute("/admin/change-log")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminChangeLogPage />
      </AdminShell>
    </AdminRoute>
  ),
});
