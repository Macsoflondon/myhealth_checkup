import { lazy } from "react";
import { Route } from "react-router-dom";

const PrivacyPolicyPage = lazy(() => import("@/pages/PrivacyPolicyPage"));
const CookiePolicyPage = lazy(() => import("@/pages/CookiePolicyPage"));
const TermsConditionsPage = lazy(() => import("@/pages/TermsConditionsPage"));
const AccessibilityPage = lazy(() => import("@/pages/AccessibilityPage"));
const ModernSlaveryPage = lazy(() => import("@/pages/ModernSlaveryPage"));
const AffiliateDisclosurePage = lazy(() => import("@/pages/AffiliateDisclosurePage"));
const FairTradingPolicyPage = lazy(() => import("@/pages/FairTradingPolicyPage"));
const HowWeRankPage = lazy(() => import("@/pages/HowWeRankPage"));
const LegalPage = lazy(() => import("@/pages/LegalPage"));

export const complianceRoutes = (
  <>
    <Route path="/legal" element={<LegalPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
    <Route path="/cookies" element={<CookiePolicyPage />} />
    <Route path="/terms" element={<TermsConditionsPage />} />
    <Route path="/accessibility" element={<AccessibilityPage />} />
    <Route path="/modern-slavery" element={<ModernSlaveryPage />} />
    <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
    <Route path="/fair-trading" element={<FairTradingPolicyPage />} />
    <Route path="/how-we-rank" element={<HowWeRankPage />} />
  </>
);
