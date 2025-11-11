import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import ClientPortal from "@/pages/ClientPortal";
import HealthDashboardPage from "@/pages/HealthDashboardPage";
import NotificationHistoryPage from "@/pages/NotificationHistoryPage";

export const authRoutes = (
  <>
    <Route path="/auth" element={<Auth />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/health-dashboard" element={<ProtectedRoute><HealthDashboardPage /></ProtectedRoute>} />
    <Route path="/notification-history" element={<ProtectedRoute><NotificationHistoryPage /></ProtectedRoute>} />
    <Route path="/portal" element={<ProtectedRoute><ClientPortal /></ProtectedRoute>} />
  </>
);
