import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobileOptimization } from "@/hooks/use-mobile";

import Hero from "@/components/sections/Hero";
import TestCategoryTicker from "@/components/sections/TestCategoryTicker";
import MissionSection from "@/components/sections/MissionSection";
import PartnersGrid from "@/components/sections/PartnersGrid";
import JourneySimplified from "@/components/sections/JourneySimplified";
import PartnerShowcaseGrid from "@/components/sections/PartnerShowcaseGrid";
import { FeaturedPublications } from "@/components/sections/FeaturedPublications";
import ExpertQuotes from "@/components/sections/ExpertQuotes";
import TestimonialCarousel from "@/components/sections/TestimonialCarousel";
import HereToHelp from "@/components/sections/HereToHelp";
import CallToAction from "@/components/sections/CallToAction";
import TrustPlatformSection from "@/components/sections/TrustPlatformSection";
import StartJourneySection from "@/components/sections/StartJourneySection";

const Index = () => {
  usePerformanceOptimization();
  useMobileOptimization();

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "myhealth checkup - UK's Leading Health Test Comparison Platform",
    description:
      "Compare private blood tests, health screenings, and wellness services across 10+ leading UK providers. Hospital-grade testing with high-street convenience for health-conscious adults aged 30-60.",
    url: "https://myhealthcheckup.co.uk",
    sameAs: [
      "https://www.facebook.com/myhealthcheckupuk",
      "https://www.twitter.com/myhealthcheckup",
      "https://www.instagram.com/myhealthcheckup_uk",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "United Kingdom",
    },
    audience: {
      "@type": "Audience",
      audienceType: "Health-conscious adults aged 25-65",
      geographicArea: {
        "@type": "Country",
        name: "United Kingdom",
      },
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "GBP",
      lowPrice: "29",
      highPrice: "299",
      offerCount: "100+",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };

  return (
    <ErrorBoundary>
      <MainLayout>
        <Helmet>
          <title>myhealth checkup | Compare UK Health Tests</title>
          <meta
            name="description"
            content="UK's leading health test comparison platform. Compare private blood tests, hormone checks, and health screenings from accredited providers. UKAS accredited labs, CQC regulated. Free to use."
          />
          <meta
            name="keywords"
            content="private blood tests UK, health screening comparison, blood test prices UK, hormone testing, vitamin tests, cancer screening, health MOT UK, at-home blood tests, private health tests comparison 2024"
          />
          <link rel="canonical" href="https://myhealthcheckup.co.uk/" />

          <link rel="preload" as="image" href="/src/assets/hero-bg-tubes.jpeg" type="image/jpeg" />

          <meta property="og:type" content="website" />
          <meta property="og:site_name" content="myhealth checkup" />
          <meta property="og:title" content="myhealth checkup | Compare UK Health Tests" />
          <meta
            property="og:description"
            content="Compare private health tests from accredited UK providers. Real-time prices, expert reviews, and transparent comparisons."
          />
          <meta property="og:image" content="https://myhealthcheckup.co.uk/og-image.png" />
          <meta property="og:url" content="https://myhealthcheckup.co.uk/" />
          <meta property="og:locale" content="en_GB" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@myhealthcheckup" />
          <meta name="twitter:title" content="myhealth checkup | Compare UK Health Tests" />
          <meta
            name="twitter:description"
            content="Compare private blood tests, health screenings & wellness services. Real-time prices from accredited providers."
          />
          <meta name="twitter:image" content="https://myhealthcheckup.co.uk/og-image.png" />

          <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#22c0d4" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="myhealth checkup" />

          <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
        </Helmet>

        <div className="mt-4">
          <Hero />
        </div>

        <TestCategoryTicker />
        <MissionSection />
        <JourneySimplified />
        <PartnersGrid />
        <StartJourneySection />

        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

        <PartnerShowcaseGrid />
        <FeaturedPublications />
        <TestimonialCarousel />
        <HereToHelp />
        <CallToAction />
        <TrustPlatformSection />
        <ExpertQuotes />
      </MainLayout>
    </ErrorBoundary>
  );
};

export default Index;
