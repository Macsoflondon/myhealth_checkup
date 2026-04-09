import { Route, Navigate } from "react-router-dom";
import HowItWorksPage from "@/pages/HowItWorksPage";
import AboutUsPage from "@/pages/AboutUsPage";
import FAQsPage from "@/pages/FAQsPage";
import ContactPage from "@/pages/ContactPage";
import PartnersPage from "@/pages/PartnersPage";
import HealthBlogPage from "@/pages/HealthBlogPage";
import SitemapPage from "@/pages/SitemapPage";
import ConditionsPage from "@/pages/ConditionsPage";
import TrustedProvidersPage from "@/pages/TrustedProvidersPage";
import TypographyShowcasePage from "@/pages/TypographyShowcasePage";
import BiomarkerDatabasePage from "@/pages/BiomarkerDatabasePage";
import { AdminRoute } from "@/components/auth/AdminRoute";

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
