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
import { authRoutes } from "./authRoutes";
import { testRoutes } from "./testRoutes";
import { complianceRoutes } from "./complianceRoutes";
import { contentRoutes } from "./contentRoutes";
import { featureRoutes } from "./featureRoutes";

export function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Index />} />
      
      {/* Admin Routes */}
      <Route path="/admin/clinic-upload" element={<AdminClinicUploadPage />} />
      <Route path="/admin/clinic-scraper" element={<AdminClinicScraperPage />} />
      <Route path="/admin/quick-clinic-import" element={<AdminQuickClinicImportPage />} />
      <Route path="/admin/test-upload" element={<AdminTestUploadPage />} />
      <Route path="/admin/data-refresh" element={<AdminDataRefreshPage />} />
      <Route path="/admin/test-mapper" element={<AdminTestMapperPage />} />
      
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
