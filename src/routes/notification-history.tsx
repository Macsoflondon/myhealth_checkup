import { createFileRoute } from "@tanstack/react-router";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const NotificationHistoryPage = lazy(() => import("@/pages/NotificationHistoryPage"));

export const Route = createFileRoute("/notification-history")({
  component: () => (
    <ProtectedRoute>
      <NotificationHistoryPage />
    </ProtectedRoute>
  ),
});
