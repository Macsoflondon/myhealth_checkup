
import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { ScrollToTop } from "./components/ScrollToTop";
import { useMobileOptimization } from "./hooks/useMobileOptimization";
import { usePerformanceOptimization } from "./hooks/usePerformanceOptimization";

// Eager load critical pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Lazy load all other pages for better performance
const CompareTests = lazy(() => import("./pages/CompareTests"));
const Auth = lazy(() => import("./pages/Auth"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const PrivacyPolicyPage = lazy(() => import("./pages/PrivacyPolicyPage"));
const IntelligentSearchPage = lazy(() => import("./pages/IntelligentSearchPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const AboutUsPage = lazy(() => import("./pages/AboutUsPage"));
const CancerScreeningPage = lazy(() => import("./pages/CancerScreeningPage"));
const DiabetesTestingPage = lazy(() => import("./pages/DiabetesTestingPage"));
const HeartHealthPage = lazy(() => import("./pages/HeartHealthPage"));
const VitaminDeficiencyPage = lazy(() => import("./pages/VitaminDeficiencyPage"));
const GutHealthPage = lazy(() => import("./pages/GutHealthPage"));
const AccessibilityPage = lazy(() => import("./pages/AccessibilityPage"));
const SitemapPage = lazy(() => import("./pages/SitemapPage"));
const CookiePolicyPage = lazy(() => import("./pages/CookiePolicyPage"));
const TermsConditionsPage = lazy(() => import("./pages/TermsConditionsPage"));
const FAQsPage = lazy(() => import("./pages/FAQsPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const PartnersPage = lazy(() => import("./pages/PartnersPage"));
const HealthBlogPage = lazy(() => import("./pages/HealthBlogPage"));
const AssistedTestFinderPage = lazy(() => import("./pages/AssistedTestFinderPage"));
const MensHealthPage = lazy(() => import("./pages/MensHealthPage"));
const WomensHealthPage = lazy(() => import("./pages/WomensHealthPage"));
const RecommendationsPage = lazy(() => import("./pages/RecommendationsPage"));
const ReviewSystem = lazy(() => import("./components/reviews/ReviewSystem"));
const FindClinicPage = lazy(() => import("./pages/FindClinicPage"));
const ProviderProfilePage = lazy(() => import("./pages/ProviderProfilePage"));
const ProviderTestCatalogPage = lazy(() => import("./pages/ProviderTestCatalogPage"));
const TestDetailPage = lazy(() => import("./pages/TestDetailPage"));
const MostPopularTestsPage = lazy(() => import("./pages/MostPopularTestsPage"));
const FertilityTestsPageWrapper = lazy(() => import("./pages/FertilityTestsPage"));
const AtHomeTestsPage = lazy(() => import("./pages/AtHomeTestsPage"));
const WellnessPage = lazy(() => import("./pages/WellnessPage"));
const ConditionsPage = lazy(() => import("./pages/ConditionsPage"));
const SportsPerformancePage = lazy(() => import("./pages/SportsPerformancePage"));
const ThyroidPage = lazy(() => import("./pages/ThyroidPage"));
const HormonesPage = lazy(() => import("./pages/HormonesPage"));
const TrustedProvidersPage = lazy(() => import("./pages/TrustedProvidersPage"));
const GeneralHealthTestPage = lazy(() => import("./pages/GeneralHealthTestPage"));
const MaleHormoneTestPage = lazy(() => import("./pages/MaleHormoneTestPage"));
const VitaminDTestPage = lazy(() => import("./pages/VitaminDTestPage"));
const IronProfileTestPage = lazy(() => import("./pages/IronProfileTestPage"));
const LipidProfileTestPage = lazy(() => import("./pages/LipidProfileTestPage"));
const WellWomanTestPage = lazy(() => import("./pages/WellWomanTestPage"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const ModernSlaveryPage = lazy(() => import("./pages/ModernSlaveryPage"));
const AffiliateDisclosurePage = lazy(() => import("./pages/AffiliateDisclosurePage"));

const queryClient = new QueryClient();

// Loading fallback component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <Loader2 className="h-8 w-8 animate-spin text-[#FA6980]" />
  </div>
);

const App = () => {
  // Apply mobile and performance optimizations
  useMobileOptimization();
  usePerformanceOptimization();

  return (
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
              <Suspense fallback={<PageLoader />}>
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
              <Route path="/find-a-clinic" element={<FindClinicPage />} />
              <Route path="/provider/:providerId" element={<ProviderProfilePage />} />
              <Route path="/provider/:providerId/tests" element={<ProviderTestCatalogPage />} />
              <Route path="/provider/:providerId/tests/:testId" element={<TestDetailPage />} />
              <Route path="/tests/fertility" element={<FertilityTestsPageWrapper />} />
              <Route path="/fertility-tests" element={<FertilityTestsPageWrapper />} />
              <Route path="/popular-tests" element={<MostPopularTestsPage />} />
              <Route path="/most-popular-tests" element={<MostPopularTestsPage />} />
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
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/portal" element={<ClientPortal />} />
              <Route path="/modern-slavery" element={<ModernSlaveryPage />} />
              <Route path="/affiliate-disclosure" element={<AffiliateDisclosurePage />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
