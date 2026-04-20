import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobileOptimization } from "@/hooks/use-mobile";

// Above-the-fold: eager
import Hero from "@/components/sections/Hero";
import TestCategoryTicker from "@/components/sections/TestCategoryTicker";

// Below-the-fold: lazy-loaded to slim the initial bundle (audit 4.x)
const MissionSection = lazy(() => import("@/components/sections/MissionSection"));
const PartnersGrid = lazy(() => import("@/components/sections/PartnersGrid"));
const JourneySimplified = lazy(() => import("@/components/sections/JourneySimplified"));
const PartnerShowcaseGrid = lazy(() => import("@/components/sections/PartnerShowcaseGrid"));
const ExpertQuotes = lazy(() => import("@/components/sections/ExpertQuotes"));
const TestimonialCarousel = lazy(() => import("@/components/sections/TestimonialCarousel"));
const ClinicAndHelpSection = lazy(() => import("@/components/sections/ClinicAndHelpSection"));
const CallToAction = lazy(() => import("@/components/sections/CallToAction"));
const AccreditedProvidersBar = lazy(() => import("@/components/sections/AccreditedProvidersBar"));
const TrustPlatformSection = lazy(() => import("@/components/sections/TrustPlatformSection"));
const StartJourneySection = lazy(() => import("@/components/sections/StartJourneySection"));

const SectionFallback = () => <div className="min-h-[200px]" aria-hidden="true" />;

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

  // Organisation schema — enables Knowledge Panel & sitelinks (audit 3.2)
  const organisationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://myhealthcheckup.co.uk/#organisation",
    name: "myhealth checkup",
    legalName: "MYHEALTHCHECKUP LTD",
    url: "https://myhealthcheckup.co.uk",
    logo: "https://myhealthcheckup.co.uk/og-image.png",
    sameAs: [
      "https://www.facebook.com/myhealthcheckupuk",
      "https://www.twitter.com/myhealthcheckup",
      "https://www.instagram.com/myhealthcheckup_uk",
      "https://www.linkedin.com/company/myhealthcheckup",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@myhealthcheckup.co.uk",
      areaServed: "GB",
      availableLanguage: ["en-GB"],
    },
  };

  // WebSite schema with SearchAction — enables Sitelinks Search Box (audit 3.2)
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://myhealthcheckup.co.uk/#website",
    url: "https://myhealthcheckup.co.uk",
    name: "myhealth checkup",
    description: "Compare private health tests across accredited UK providers.",
    publisher: { "@id": "https://myhealthcheckup.co.uk/#organisation" },
    inLanguage: "en-GB",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://myhealthcheckup.co.uk/compare?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
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
            content="private blood tests UK, health screening comparison, blood test prices UK, hormone testing, vitamin tests, cancer screening, health MOT UK, at-home blood tests, private health tests comparison"
          />
          <link rel="canonical" href="https://myhealthcheckup.co.uk/" />

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
          <script type="application/ld+json">{JSON.stringify(organisationSchema)}</script>
          <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
        </Helmet>

        <div>
          <Hero />
        </div>

        <TestCategoryTicker />
        <Suspense fallback={<SectionFallback />}>
          <MissionSection />
          <JourneySimplified />
          <PartnersGrid />
          <StartJourneySection />

          <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

          <PartnerShowcaseGrid />
          <TestimonialCarousel />
          <ClinicAndHelpSection />
          <AccreditedProvidersBar />
          <CallToAction />
          <TrustPlatformSection />
          <ExpertQuotes />
        </Suspense>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default Index;
