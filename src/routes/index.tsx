/**
 * Centralized route configuration
 * All application routes organized by category
 */

import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import AdminClinicUploadPage from "@/pages/AdminClinicUploadPage";
import AdminClinicScraperPage from "@/pages/AdminClinicScraperPage";
import AdminQuickClinicImportPage from "@/pages/AdminQuickClinicImportPage";
import AdminTestUploadPage from "@/pages/AdminTestUploadPage";
import AdminDataRefreshPage from "@/pages/AdminDataRefreshPage";
import AdminTestMapperPage from "@/pages/AdminTestMapperPage";
import AdminScraperDashboardPage from "@/pages/AdminScraperDashboardPage";
import { AdminRoute } from "@/components/auth/AdminRoute";
import AdminAuth from "@/pages/AdminAuth";
import { authRoutes } from "./authRoutes";
import { testRoutes } from "./testRoutes";
import { complianceRoutes } from "./complianceRoutes";
import { contentRoutes } from "./contentRoutes";
import { featureRoutes } from "./featureRoutes";
import TestCategoriesPage from "@/pages/TestCategoriesPage";

export function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Index />} />
      <Route path="/test-categories" element={<TestCategoriesPage />} />
      
      {/* Admin Auth */}
      <Route path="/admin/login" element={<AdminAuth />} />
      
      {/* Admin Routes - Protected with server-side role verification */}
      <Route path="/admin/clinic-upload" element={<AdminRoute><AdminClinicUploadPage /></AdminRoute>} />
      <Route path="/admin/clinic-scraper" element={<AdminRoute><AdminClinicScraperPage /></AdminRoute>} />
      <Route path="/admin/quick-clinic-import" element={<AdminRoute><AdminQuickClinicImportPage /></AdminRoute>} />
      <Route path="/admin/test-upload" element={<AdminRoute><AdminTestUploadPage /></AdminRoute>} />
      <Route path="/admin/data-refresh" element={<AdminRoute><AdminDataRefreshPage /></AdminRoute>} />
      <Route path="/admin/scrapers" element={<AdminRoute><AdminScraperDashboardPage /></AdminRoute>} />
      <Route path="/admin/test-mapper" element={<AdminRoute><AdminTestMapperPage /></AdminRoute>} />
      
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
  );
}
