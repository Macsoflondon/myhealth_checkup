/**
 * Centralized route configuration
 * All application routes organized by category
 */

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { authRoutes } from "./authRoutes";
import { testRoutes } from "./testRoutes";
import { complianceRoutes } from "./complianceRoutes";
import { contentRoutes } from "./contentRoutes";
import { featureRoutes } from "./featureRoutes";
import TestCategoriesPage from "@/pages/TestCategoriesPage";

// Lazy-load admin pages — they're only used by admins, no need to bundle in the main chunk.
const AdminAuth = lazy(() => import("@/pages/AdminAuth"));
const AdminClinicUploadPage = lazy(() => import("@/pages/AdminClinicUploadPage"));
const AdminClinicScraperPage = lazy(() => import("@/pages/AdminClinicScraperPage"));
const AdminQuickClinicImportPage = lazy(() => import("@/pages/AdminQuickClinicImportPage"));
const AdminTestUploadPage = lazy(() => import("@/pages/AdminTestUploadPage"));
const AdminDataRefreshPage = lazy(() => import("@/pages/AdminDataRefreshPage"));
const AdminTestMapperPage = lazy(() => import("@/pages/AdminTestMapperPage"));
const AdminScraperDashboardPage = lazy(() => import("@/pages/AdminScraperDashboardPage"));
const AdminTestDashboardPage = lazy(() => import("@/pages/AdminTestDashboardPage"));

const AdminFallback = () => (
  <div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading admin…</div>
);
const wrapAdmin = (Component: React.ComponentType) => (
  <AdminRoute>
    <Suspense fallback={<AdminFallback />}>
      <Component />
    </Suspense>
  </AdminRoute>
);

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading…</div>
);

export function AppRoutes() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        {/* Home */}
        <Route path="/" element={<Index />} />
        <Route path="/test-categories" element={<TestCategoriesPage />} />

        {/* Admin Auth */}
        <Route path="/admin/login" element={<AdminAuth />} />

        {/* Admin Routes - Protected with server-side role verification */}
        <Route path="/admin/clinic-upload" element={wrapAdmin(AdminClinicUploadPage)} />
        <Route path="/admin/clinic-scraper" element={wrapAdmin(AdminClinicScraperPage)} />
        <Route path="/admin/quick-clinic-import" element={wrapAdmin(AdminQuickClinicImportPage)} />
        <Route path="/admin/test-upload" element={wrapAdmin(AdminTestUploadPage)} />
        <Route path="/admin/data-refresh" element={wrapAdmin(AdminDataRefreshPage)} />
        <Route path="/admin/scrapers" element={wrapAdmin(AdminScraperDashboardPage)} />
        <Route path="/admin/test-mapper" element={wrapAdmin(AdminTestMapperPage)} />
        <Route path="/admin/test-dashboard" element={wrapAdmin(AdminTestDashboardPage)} />

        {/* Feature Routes */}
        {featureRoutes}

        {/* Test Routes */}
        {testRoutes}

        {/* Authentication & Dashboard Routes */}
        {authRoutes}

        {/* Content & Information Routes */}
        {contentRoutes}

        {/* Compliance & Legal Routes */}
        {complianceRoutes}

        {/* 404 - Must be last */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
