import { createFileRoute } from "@tanstack/react-router";
import { buildPrivateRouteHead } from "@/lib/seo/route-head";
import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const NotificationHistoryPage = lazy(() => import("@/pages/NotificationHistoryPage"));

export const Route = createFileRoute("/notification-history")({
  head: () => buildPrivateRouteHead("Notification history | myhealth checkup"),
  component: () => (
    <ProtectedRoute>
      <NotificationHistoryPage />
    </ProtectedRoute>
  ),
});
