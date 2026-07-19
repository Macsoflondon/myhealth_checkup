import { lazyWithRetry as lazy } from "@/lib/lazyWithRetry";
import { Route, Navigate } from "react-router-dom";
import { AdminRoute } from "@/components/auth/AdminRoute";

const HowItWorksPage = lazy(() => import("@/pages/HowItWorksPage"));
const MedicalReviewPage = lazy(() => import("@/pages/MedicalReviewPage"));
const AboutUsPage = lazy(() => import("@/pages/AboutUsPage"));
const FAQsPage = lazy(() => import("@/pages/FAQsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PartnersPage = lazy(() => import("@/pages/PartnersPage"));
const HealthBlogPage = lazy(() => import("@/pages/HealthBlogPage"));
const SitemapPage = lazy(() => import("@/pages/SitemapPage"));
const ConditionsPage = lazy(() => import("@/pages/ConditionsPage"));
const TrustedProvidersPage = lazy(() => import("@/pages/TrustedProvidersPage"));

const BiomarkerDatabasePage = lazy(() => import("@/pages/BiomarkerDatabasePage"));
const BiomarkerGuidesIndexPage = lazy(() => import("@/pages/BiomarkerGuidesIndexPage"));
const BiomarkerGuidePage = lazy(() => import("@/pages/BiomarkerGuidePage"));
const TestosteroneLevelsByAgePage = lazy(() => import("@/pages/TestosteroneLevelsByAgePage"));
const PrivateBloodTestCostGuidePage = lazy(() => import("@/pages/PrivateBloodTestCostGuidePage"));
const FerritinVsIronComparisonGuidePage = lazy(() => import("@/pages/FerritinVsIronComparisonGuidePage"));


export const contentRoutes = (
  <>
    <Route path="/how-it-works" element={<HowItWorksPage />} />
    <Route path="/about/medical-review" element={<MedicalReviewPage />} />
    <Route path="/about" element={<AboutUsPage />} />
    <Route path="/faqs" element={<FAQsPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/partners" element={<PartnersPage />} />
    <Route path="/blog" element={<HealthBlogPage />} />
    <Route path="/health-blog" element={<Navigate to="/blog" replace />} />
    <Route path="/blog/testosterone-levels-by-age" element={<TestosteroneLevelsByAgePage />} />
    <Route path="/blog/private-blood-test-cost-guide" element={<PrivateBloodTestCostGuidePage />} />
    <Route path="/blog/ferritin-vs-iron-comparison-guide" element={<FerritinVsIronComparisonGuidePage />} />
    <Route path="/sitemap" element={<SitemapPage />} />
    <Route path="/conditions" element={<ConditionsPage />} />
    <Route path="/trusted-providers" element={<TrustedProvidersPage />} />
    <Route path="/biomarker-database" element={<BiomarkerDatabasePage />} />
    <Route path="/guides" element={<BiomarkerGuidesIndexPage />} />
    <Route path="/guides/:slug" element={<BiomarkerGuidePage />} />
  </>
);
