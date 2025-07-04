
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import CompareTests from "./pages/CompareTests";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ProductDetailPage from "./pages/ProductDetailPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import IntelligentSearchPage from "./pages/IntelligentSearchPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import AboutUsPage from "./pages/AboutUsPage";
import SubscriptionsPage from "./pages/SubscriptionsPage";
import RecommendationEngine from "./components/ai/RecommendationEngine";
import ReviewSystem from "./components/reviews/ReviewSystem";

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
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/compare" element={<CompareTests />} />
              <Route path="/search" element={<IntelligentSearchPage />} />
              <Route path="/product/:id" element={<ProductDetailPage />} />
              <Route path="/recommendations" element={<RecommendationEngine />} />
              <Route path="/reviews" element={<ReviewSystem />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/how-it-works" element={<HowItWorksPage />} />
              <Route path="/about" element={<AboutUsPage />} />
              <Route path="/subscriptions" element={<SubscriptionsPage />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
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
