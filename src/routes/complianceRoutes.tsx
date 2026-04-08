import { Route } from "react-router-dom";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import CookiePolicyPage from "@/pages/CookiePolicyPage";
import TermsConditionsPage from "@/pages/TermsConditionsPage";
import AccessibilityPage from "@/pages/AccessibilityPage";
import ModernSlaveryPage from "@/pages/ModernSlaveryPage";
import AffiliateDisclosurePage from "@/pages/AffiliateDisclosurePage";
import FairTradingPolicyPage from "@/pages/FairTradingPolicyPage";
import HowWeRankPage from "@/pages/HowWeRankPage";
import LegalPage from "@/pages/LegalPage";

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
