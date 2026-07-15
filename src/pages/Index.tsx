import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import SectionReveal from "@/components/ui/SectionReveal";
import { LazyMount } from "@/components/common/LazyMount";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobileOptimization } from "@/hooks/use-mobile";
import { Brain, ArrowRight, Shield } from "lucide-react";

// Hero first-slide images — preloaded for LCP optimisation
import heroSlide1DesktopAsset from "@/assets/hero/hero-active-lifestyle.jpg.asset.json";
import heroSlide1MobileAsset from "@/assets/hero/mobile/hero-mobile-active.jpg.asset.json";
const heroSlide1Desktop = heroSlide1DesktopAsset.url;
const heroSlide1Mobile = heroSlide1MobileAsset.url;

// Above-the-fold: eager
import HeroMasthead from "@/components/sections/HeroMasthead";
import BrowseByCategoryBar from "@/components/layout/BrowseByCategoryBar";
import StatsBand from "@/components/sections/StatsBand";

const PartnersGrid = lazy(() => import("@/components/sections/PartnersGrid"));
const JourneySimplified = lazy(() => import("@/components/sections/JourneySimplified"));
const PartnerShowcaseGrid = lazy(() => import("@/components/sections/PartnerShowcaseGrid"));

const AccreditedProvidersBar = lazy(() => import("@/components/sections/AccreditedProvidersBar"));

const TestimonialCarousel = lazy(() => import("@/components/sections/TestimonialCarousel"));
const DreamHealthShowcase = lazy(() => import("@/components/sections/DreamHealthShowcase"));
const ClinicAndHelpSection = lazy(() => import("@/components/sections/ClinicAndHelpSection"));
const CallToAction = lazy(() => import("@/components/sections/CallToAction"));

const StartJourneySection = lazy(() => import("@/components/sections/StartJourneySection"));

const NewsletterSection = lazy(() => import("@/components/sections/NewsletterSection"));
const ProviderComparisonTable = lazy(() => import("@/components/sections/ProviderComparisonTable"));

const SectionFallback = () => <div className="min-h-[200px]" aria-hidden="true" />;

const TRUST_ITEMS = [
  { emoji: "\ud83c\udfe5", label: "CQC Registered Providers" },
  { emoji: "\ud83d\udd2c", label: "UKAS Accredited Labs" },
  { emoji: "\ud83d\udd12", label: "Data Never Shared" },
  { emoji: "\u2b50", label: "Trusted Comparison" },
] as const;

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
      streetAddress: "2/369 Clapham Road",
      addressLocality: "London",
      postalCode: "SW9 9BT",
      addressCountry: "GB",
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
          <link
            rel="preload"
            as="image"
            href={heroSlide1Desktop}
            type="image/jpeg"
            media="(min-width: 640px)"
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            href={heroSlide1Mobile}
            type="image/jpeg"
            media="(max-width: 639px)"
            fetchPriority="high"
          />
          <title>myhealth checkup | Compare UK Health Tests</title>
          <meta
            name="description"
            content="Compare UK private blood tests, hormone checks and screenings from accredited UKAS labs and CQC clinics. Free, transparent, independent."
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
          <div className="mt-0 mx-0">
            <HeroMasthead />
          </div>

          {/* Trust Bar \u2014 CQC/UKAS credibility strip */}
          <div
            className="w-full py-3 px-4"
            style={{ background: "#081129" }}
          >
            <div className="mx-auto max-w-5xl flex flex-wrap items-center justify-center gap-x-6 gap-y-2 sm:gap-x-10">
              {TRUST_ITEMS.map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-1.5 whitespace-nowrap"
                  style={{
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    fontSize: 13,
                    color: "#ffffff",
                  }}
                >
                  <span aria-hidden="true" className="text-base">{item.emoji}</span>
                  {item.label}
                </span>
              ))}
            </div>
          </div>

          <BrowseByCategoryBar compact placement="hero" />

          {/* Hero CTA \u2014 Health Quiz entry point */}
          <section className="py-12 sm:py-16 px-4" style={{ background: "linear-gradient(135deg, #081129 0%, #0F2238 100%)" }}>
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-[#22c0d4]/10 border border-[#22c0d4]/30 rounded-full px-4 py-1.5 mb-6">
                <Brain className="w-4 h-4 text-[#22c0d4]" />
                <span className="text-[#22c0d4] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  AI-Powered
                </span>
              </div>
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Not sure which test you need?
              </h2>
              <p className="text-white/70 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                Answer 6 quick questions and our AI will analyse 597 accredited tests to find your perfect wellness panel \u2014 with transparent pricing.
              </p>
              <Link
                to="/find-test"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#22c0d4] to-[#1aa8bb] hover:from-[#1aa8bb] hover:to-[#22c0d4] text-[#081129] font-bold text-base sm:text-lg px-8 py-4 rounded-full shadow-lg shadow-[#22c0d4]/25 transition-all hover:scale-[1.02]"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Take the Health Quiz
                <ArrowRight className="w-5 h-5" />
              </Link>
              <div className="flex items-center justify-center gap-4 mt-6 text-white/50 text-xs">
                <span className="flex items-center gap-1">
                  <Shield className="w-3 h-3" /> No account required
                </span>
                <span>\u2022</span>
                <span>Takes 2 minutes</span>
                <span>\u2022</span>
                <span>100% free</span>
              </div>
            </div>
          </section>

          <div className="mx-0">
            <StatsBand />
          </div>

          <Suspense fallback={<SectionFallback />}>
            <SectionReveal>
              <PartnersGrid />
            </SectionReveal>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <SectionReveal delay={0.1}>
              <JourneySimplified />
            </SectionReveal>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <SectionReveal delay={0.15}>
              <StartJourneySection />
            </SectionReveal>
          </Suspense>


          <LazyMount minHeight={800}>
            <Suspense fallback={<SectionFallback />}>
              <SectionReveal delay={0.1}>
                <PartnerShowcaseGrid />
              </SectionReveal>
            </Suspense>
          </LazyMount>

          <LazyMount minHeight={500}>
            <Suspense fallback={<SectionFallback />}>
              <SectionReveal>
                <TestimonialCarousel />
              </SectionReveal>
            </Suspense>
          </LazyMount>

          <LazyMount minHeight={500}>
            <Suspense fallback={<SectionFallback />}>
              <SectionReveal delay={0.1}>
                <ClinicAndHelpSection />
              </SectionReveal>
            </Suspense>
          </LazyMount>

          <div id="comparison-anchor" aria-hidden="true" />
          <LazyMount minHeight={600}>
            <Suspense fallback={<SectionFallback />}>
              <SectionReveal>
                <div className="hidden md:block">
                  <ProviderComparisonTable />
                </div>
              </SectionReveal>
            </Suspense>
          </LazyMount>
          <div id="comparison-end" aria-hidden="true" />



        </div>


      </MainLayout>
    </ErrorBoundary>
  );
};

export default Index;
