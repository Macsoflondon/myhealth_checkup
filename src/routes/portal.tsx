import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const ClientPortal = lazy(() => import("@/pages/ClientPortal"));

export const Route = createFileRoute("/portal")({
  component: () => (
    <ProtectedRoute>
      <ClientPortal />
    </ProtectedRoute>
  ),
});
