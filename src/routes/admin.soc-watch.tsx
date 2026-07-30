import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminSocWatchPage = lazy(() => import("@/pages/AdminSocWatchPage"));

export const Route = createFileRoute("/admin/soc-watch")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminSocWatchPage />
      </AdminShell>
    </AdminRoute>
  ),
});
