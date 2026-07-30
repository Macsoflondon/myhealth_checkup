import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const ControlPage = lazy(() => import("@/pages/ControlPage"));

export const Route = createFileRoute("/control/$section")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <ControlPage />
      </AdminShell>
    </AdminRoute>
  ),
});
