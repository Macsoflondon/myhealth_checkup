
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CompareTests from "./pages/CompareTests";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import IntelligentSearchPage from "./pages/IntelligentSearchPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutUsPage from "./pages/AboutUsPage";
import CancerScreeningPage from "./pages/CancerScreeningPage";
import DiabetesTestingPage from "./pages/DiabetesTestingPage";
import HeartHealthPage from "./pages/HeartHealthPage";
import VitaminDeficiencyPage from "./pages/VitaminDeficiencyPage";
import GutHealthPage from "./pages/GutHealthPage";
import AccessibilityPage from "./pages/AccessibilityPage";
import SitemapPage from "./pages/SitemapPage";
import CookiePolicyPage from "./pages/CookiePolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import FAQsPage from "./pages/FAQsPage";
import ContactPage from "./pages/ContactPage";
import PartnersPage from "./pages/PartnersPage";
import HealthBlogPage from "./pages/HealthBlogPage";
import AssistedTestFinderPage from "./pages/AssistedTestFinderPage";
import MensHealthPage from "./pages/MensHealthPage";
import WomensHealthPage from "./pages/WomensHealthPage";
import RecommendationsPage from "./pages/RecommendationsPage";
import ReviewSystem from "./components/reviews/ReviewSystem";
import FindClinicPage from "./pages/FindClinicPage";
import ProviderProfilePage from "./pages/ProviderProfilePage";
import ProviderTestCatalogPage from "./pages/ProviderTestCatalogPage";
import TestDetailPage from "./pages/TestDetailPage";
import MostPopularTestsPage from "./pages/MostPopularTestsPage";
import FertilityTestsPageWrapper from "./pages/FertilityTestsPage";
import AtHomeTestsPage from "./pages/AtHomeTestsPage";
import WellnessPage from "./pages/WellnessPage";
import ConditionsPage from "./pages/ConditionsPage";
import SportsPerformancePage from "./pages/SportsPerformancePage";
import ThyroidPage from "./pages/ThyroidPage";
import HormonesPage from "./pages/HormonesPage";
import TrustedProvidersPage from "./pages/TrustedProvidersPage";

// Test detail pages
import GeneralHealthTestPage from "./pages/GeneralHealthTestPage";
import MaleHormoneTestPage from "./pages/MaleHormoneTestPage";
import VitaminDTestPage from "./pages/VitaminDTestPage";
import IronProfileTestPage from "./pages/IronProfileTestPage";
import LipidProfileTestPage from "./pages/LipidProfileTestPage";
import WellWomanTestPage from "./pages/WellWomanTestPage";
import { ScrollToTop } from "./components/ScrollToTop";
import ClientPortal from "./pages/ClientPortal";
import ModernSlaveryPage from "./pages/ModernSlaveryPage";
import AffiliateDisclosurePage from "./pages/AffiliateDisclosurePage";
import FairTradingPolicyPage from "./pages/FairTradingPolicyPage";
import HowWeRankPage from "./pages/HowWeRankPage";
import LolaHealthTestDetailPage from "./pages/LolaHealthTestDetailPage";
import GoodbodyTestDetailPage from "./pages/GoodbodyTestDetailPage";
import MedichecksTestDetailPage from "./pages/MedichecksTestDetailPage";
import HealthDashboardPage from "./pages/HealthDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <HelmetProvider>
        <TooltipProvider>
          <Helmet>
            <html lang="en" />
            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          </Helmet>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/compare" element={<CompareTests />} />
              <Route path="/search" element={<IntelligentSearchPage />} />
              
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/reviews" element={<ReviewSystem />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/tests/cancer" element={<CancerScreeningPage />} />
              <Route path="/tests/diabetes" element={<DiabetesTestingPage />} />
              <Route path="/tests/heart" element={<HeartHealthPage />} />
              <Route path="/tests/vitamins" element={<VitaminDeficiencyPage />} />
              <Route path="/tests/gut" element={<GutHealthPage />} />
              <Route path="/tests/mens-health" element={<MensHealthPage />} />
              <Route path="/tests/womens-health" element={<WomensHealthPage />} />
              <Route path="/accessibility" element={<AccessibilityPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />
              <Route path="/cookies" element={<CookiePolicyPage />} />
              <Route path="/terms" element={<TermsConditionsPage />} />
              <Route path="/faqs" element={<FAQsPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/blog" element={<HealthBlogPage />} />
              <Route path="/find-test" element={<AssistedTestFinderPage />} />
              <Route path="/find-clinic" element={<FindClinicPage />} />
              <Route path="/find-a-clinic" element={<Navigate to="/find-clinic" replace />} />
              <Route path="/provider/:providerId" element={<ProviderProfilePage />} />
              <Route path="/provider/:providerId/tests" element={<ProviderTestCatalogPage />} />
              <Route path="/provider/:providerId/tests/:testId" element={<TestDetailPage />} />
              <Route path="/fertility-tests" element={<FertilityTestsPageWrapper />} />
              <Route path="/tests/fertility" element={<Navigate to="/fertility-tests" replace />} />
              <Route path="/popular-tests" element={<MostPopularTestsPage />} />
              <Route path="/most-popular-tests" element={<Navigate to="/popular-tests" replace />} />
              <Route path="/at-home-tests" element={<AtHomeTestsPage />} />
              <Route path="/wellness" element={<WellnessPage />} />
              <Route path="/conditions" element={<ConditionsPage />} />
              <Route path="/sports-performance" element={<SportsPerformancePage />} />
              <Route path="/thyroid" element={<ThyroidPage />} />
              <Route path="/hormones" element={<HormonesPage />} />
              <Route path="/mens-health" element={<MensHealthPage />} />
              <Route path="/womens-health" element={<WomensHealthPage />} />
              <Route path="/health-blog" element={<HealthBlogPage />} />
              <Route path="/trusted-providers" element={<TrustedProvidersPage />} />
              <Route path="/assisted-test-finder" element={<AssistedTestFinderPage />} />
              
              {/* Test detail pages */}
              <Route path="/test/general-health" element={<GeneralHealthTestPage />} />
              <Route path="/test/male-hormones" element={<MaleHormoneTestPage />} />
              <Route path="/test/vitamin-d" element={<VitaminDTestPage />} />
              <Route path="/test/iron-profile" element={<IronProfileTestPage />} />
              <Route path="/test/lipid-profile" element={<LipidProfileTestPage />} />
              <Route path="/test/well-woman" element={<WellWomanTestPage />} />
              
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/health-dashboard" element={<ProtectedRoute><HealthDashboardPage /></ProtectedRoute>} />
              <Route path="/portal" element={<ProtectedRoute><ClientPortal /></ProtectedRoute>} />
              <Route path="/modern-slavery" element={<ModernSlaveryPage />} />
              <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
              <Route path="/fair-trading" element={<FairTradingPolicyPage />} />
              <Route path="/how-we-rank" element={<HowWeRankPage />} />
              
              {/* Lola Health test detail pages */}
          <Route path="/lola-health/:testId" element={<LolaHealthTestDetailPage />} />
          <Route path="/goodbody/:testId" element={<GoodbodyTestDetailPage />} />
          <Route path="/medichecks/:testId" element={<MedichecksTestDetailPage />} />
              
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
