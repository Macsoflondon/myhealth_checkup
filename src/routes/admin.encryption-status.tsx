import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { AdminShell } from "@/components/admin/AdminShell";

const AdminEncryptionStatusPage = lazy(() => import("@/pages/AdminEncryptionStatusPage"));

export const Route = createFileRoute("/admin/encryption-status")({
  component: () => (
    <AdminRoute>
      <AdminShell>
        <AdminEncryptionStatusPage />
      </AdminShell>
    </AdminRoute>
  ),
});
