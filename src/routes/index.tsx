/**
 * Centralized route configuration
 * All application routes organized by category
 */

import { Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
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
