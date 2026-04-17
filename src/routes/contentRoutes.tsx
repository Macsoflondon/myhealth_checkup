import { lazy } from "react";
import { Route } from "react-router-dom";
import { AdminRoute } from "@/components/auth/AdminRoute";

const HowItWorksPage = lazy(() => import("@/pages/HowItWorksPage"));
const AboutUsPage = lazy(() => import("@/pages/AboutUsPage"));
const FAQsPage = lazy(() => import("@/pages/FAQsPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const PartnersPage = lazy(() => import("@/pages/PartnersPage"));
const HealthBlogPage = lazy(() => import("@/pages/HealthBlogPage"));
const SitemapPage = lazy(() => import("@/pages/SitemapPage"));
const ConditionsPage = lazy(() => import("@/pages/ConditionsPage"));
const TrustedProvidersPage = lazy(() => import("@/pages/TrustedProvidersPage"));
const TypographyShowcasePage = lazy(() => import("@/pages/TypographyShowcasePage"));
const BiomarkerDatabasePage = lazy(() => import("@/pages/BiomarkerDatabasePage"));

export const contentRoutes = (
  <>
    <Route path="/how-it-works" element={<HowItWorksPage />} />
    <Route path="/about" element={<AboutUsPage />} />
    <Route path="/faqs" element={<FAQsPage />} />
    <Route path="/contact" element={<ContactPage />} />
    <Route path="/partners" element={<PartnersPage />} />
    <Route path="/blog" element={<HealthBlogPage />} />
    <Route path="/health-blog" element={<HealthBlogPage />} />
    <Route path="/sitemap" element={<SitemapPage />} />
    <Route path="/conditions" element={<ConditionsPage />} />
    <Route path="/trusted-providers" element={<TrustedProvidersPage />} />
    <Route path="/biomarker-database" element={<BiomarkerDatabasePage />} />
    <Route path="/typography-showcase" element={<AdminRoute><TypographyShowcasePage /></AdminRoute>} />
  </>
);
