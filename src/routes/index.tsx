/**
 * Centralized route configuration
 * All application routes organized by category
 */

import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
// Index stays eager — it's the LCP route. Everything else is code-split.
import Index from "@/pages/Index";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { authRoutes } from "./authRoutes";
import { testRoutes } from "./testRoutes";
import { complianceRoutes } from "./complianceRoutes";
import { contentRoutes } from "./contentRoutes";
import { featureRoutes } from "./featureRoutes";

const NotFound = lazy(() => import("@/pages/NotFound"));
const TestCategoriesPage = lazy(() => import("@/pages/TestCategoriesPage"));

// Lazy-load admin pages — they're only used by admins, no need to bundle in the main chunk.
const AdminAuth = lazy(() => import("@/pages/AdminAuth"));
const AdminTestUploadPage = lazy(() => import("@/pages/AdminTestUploadPage"));
const AdminDataRefreshPage = lazy(() => import("@/pages/AdminDataRefreshPage"));
const AdminTestMapperPage = lazy(() => import("@/pages/AdminTestMapperPage"));
const AdminScraperDashboardPage = lazy(() => import("@/pages/AdminScraperDashboardPage"));
const AdminTestDashboardPage = lazy(() => import("@/pages/AdminTestDashboardPage"));
const AdminEncryptionStatusPage = lazy(() => import("@/pages/AdminEncryptionStatusPage"));
const AdminSecurityDiffPage = lazy(() => import("@/pages/AdminSecurityDiffPage"));
const AdminBiomarkerAuditPage = lazy(() => import("@/pages/AdminBiomarkerAuditPage"));

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading…</div>
);

const wrapAdmin = (Component: React.ComponentType) => (
  <AdminRoute>
    <Component />
  </AdminRoute>
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
        <Route path="/admin/test-upload" element={wrapAdmin(AdminTestUploadPage)} />
        <Route path="/admin/data-refresh" element={wrapAdmin(AdminDataRefreshPage)} />
        <Route path="/admin/scrapers" element={wrapAdmin(AdminScraperDashboardPage)} />
        <Route path="/admin/test-mapper" element={wrapAdmin(AdminTestMapperPage)} />
        <Route path="/admin/test-dashboard" element={wrapAdmin(AdminTestDashboardPage)} />
        <Route path="/admin/encryption-status" element={wrapAdmin(AdminEncryptionStatusPage)} />
        <Route path="/admin/security-diff" element={wrapAdmin(AdminSecurityDiffPage)} />
        <Route path="/admin/biomarker-audit" element={wrapAdmin(AdminBiomarkerAuditPage)} />

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
