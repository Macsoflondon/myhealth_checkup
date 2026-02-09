import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobileOptimization } from "@/hooks/useMobileOptimization";

// New streamlined sections
import Hero from "@/components/sections/Hero";
import MissionSection from "@/components/sections/MissionSection";
import PartnersGrid from "@/components/sections/PartnersGrid";

import TrustPlatformSection from "@/components/sections/TrustPlatformSection";
import JourneySimplified from "@/components/sections/JourneySimplified";
import TopConcernsSection from "@/components/sections/TopConcernsSection";
import MostPopularTestsSection from "@/components/sections/MostPopularTestsSection";
import FindClinicSection from "@/components/sections/FindClinicSection";
import HereToHelp from "@/components/sections/HereToHelp";

import StickyCtaBar from "@/components/common/StickyCtaBar";
import { FeaturedPublications } from "@/components/sections/FeaturedPublications";
import BrandVideoSection from "@/components/sections/BrandVideoSection";

const Index = () => {
  usePerformanceOptimization();
  useMobileOptimization();
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    "name": "myhealth checkup - UK's Leading Health Test Comparison Platform",
    "description": "Compare private blood tests, health screenings, and wellness services across 10+ leading UK providers. Hospital-grade testing with high-street convenience for health-conscious adults aged 30-60.",
    "url": "https://myhealthhub.co.uk",
    "sameAs": ["https://www.facebook.com/myhealthhub", "https://www.twitter.com/myhealthhub", "https://www.instagram.com/myhealthhub"],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "United Kingdom"
    },
    "audience": {
      "@type": "Audience",
      "audienceType": "Health-conscious adults aged 30-60",
      "geographicArea": "United Kingdom"
    },
    "offers": {
      "@type": "AggregateOffer",
      "priceCurrency": "GBP",
      "lowPrice": "29",
      "highPrice": "299",
      "offerCount": "100+"
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "opens": "00:00",
      "closes": "23:59"
    }
  };

  return (
    <ErrorBoundary>
      <MainLayout>
        <Helmet>
          <title>myhealth checkup - Compare Trusted Private Health Tests Across the UK</title>
          <meta name="description" content="UK's leading health test comparison platform. Compare private blood tests, hormone checks, and health screenings from accredited providers. UKAS accredited labs, CQC regulated. Free to use." />
          <meta name="keywords" content="private blood tests UK, health screening comparison, blood test prices UK, hormone testing, vitamin tests, cancer screening, health MOT UK, at-home blood tests, private health tests comparison 2024" />
          <link rel="canonical" href="https://myhealthhub.co.uk/" />
          
          {/* Preload critical hero image for faster LCP */}
          <link rel="preload" as="image" href="/lovable-uploads/hero-bg-pink-tubes.webp" type="image/webp" />
          
          {/* Open Graph */}
          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="myhealth checkup" />
          <meta property="og:title" content="myhealth checkup - Compare Trusted Private Health Tests" />
          <meta property="og:description" content="Compare private health tests from accredited UK providers. Real-time prices, expert reviews, and transparent comparisons." />
          <meta property="og:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
          <meta property="og:url" content="https://myhealthhub.co.uk/" />
          <meta property="og:locale" content="en_GB" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@myhealthhub" />
          <meta name="twitter:title" content="myhealth checkup - Compare Trusted Private Health Tests" />
          <meta name="twitter:description" content="Compare private blood tests, health screenings & wellness services. Real-time prices from accredited providers." />
          <meta name="twitter:image" content="https://lovable.dev/opengraph-image-p98pqg.png" />
          
          {/* Additional SEO */}
          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
          
          {/* PWA */}
          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#22c0d4" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="myhealth checkup" />
          
          {/* Structured data */}
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>
        
        {/* 1. Hero Section */}
        <Hero />
        
        {/* 2. Mission Section - Your Health is Your Greatest Asset */}
        <MissionSection />
        
        {/* 3. Our Trusted Partners */}
        <PartnersGrid />
        
        {/* 4. Your Health Journey Simplified */}
        <JourneySimplified />
        
        {/* 5. Brand Tagline Video */}
        <BrandVideoSection />
        
        {/* 6. Featured Publications */}
        <FeaturedPublications />
        
        {/* 8. Most Popular Tests from Our Providers */}
        <MostPopularTestsSection />
        
        {/* 6. Comprehensive Care Categories */}
        <TopConcernsSection />
        
        {/* 4. Find a Clinic Near You */}
        <FindClinicSection />
        
        {/* 4. Here to Help */}
        <HereToHelp />
        
        {/* 5. Final CTA - now integrated into FindClinicSection */}
        
        {/* 6. Trusted Health Comparison Platform - Above Footer */}
        <TrustPlatformSection />
        
        {/* Sticky CTA Bar - appears on scroll */}
        <StickyCtaBar showAfter={600} />
      </MainLayout>
    </ErrorBoundary>
  );
};

export default Index;