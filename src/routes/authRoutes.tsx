import { lazy } from "react";
import { Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const Auth = lazy(() => import("@/pages/Auth"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const ClientPortal = lazy(() => import("@/pages/ClientPortal"));
const HealthDashboardPage = lazy(() => import("@/pages/HealthDashboardPage"));
const NotificationHistoryPage = lazy(() => import("@/pages/NotificationHistoryPage"));

export const authRoutes = (
  <>
    <Route path="/auth" element={<Auth />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/health-dashboard" element={<ProtectedRoute><HealthDashboardPage /></ProtectedRoute>} />
    <Route path="/notification-history" element={<ProtectedRoute><NotificationHistoryPage /></ProtectedRoute>} />
    <Route path="/portal" element={<ProtectedRoute><ClientPortal /></ProtectedRoute>} />
  </>
);
