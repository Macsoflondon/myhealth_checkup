
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/context/AuthContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { logApiError } from "@/services/errorLogger";
import errorToast from "@/lib/errorToast";
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
import RecommendationEngine from "./components/ai/RecommendationEngine";
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      logApiError(error as Error, query.queryKey.toString(), { queryKey: query.queryKey });
      // Only show toast if we don't have cached data to fall back on
      if (query.state.data === undefined) {
        errorToast.generic("load data");
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      logApiError(error as Error, "mutation");
      errorToast.generic("save changes");
    },
  }),
});

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
            <ErrorBoundary>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/compare" element={<CompareTests />} />
              <Route path="/search" element={<IntelligentSearchPage />} />
              
              <Route path="/recommendations" element={<RecommendationEngine />} />
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
              <Route path="/mens-health" element={<MensHealthPage />} />
              <Route path="/womens-health" element={<WomensHealthPage />} />
              <Route path="/health-blog" element={<HealthBlogPage />} />
              <Route path="/assisted-test-finder" element={<AssistedTestFinderPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </HelmetProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
