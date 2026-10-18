import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Link } from "@/lib/router-compat";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import SectionReveal from "@/components/ui/SectionReveal";
import { LazyMount } from "@/components/common/LazyMount";
import { SectionSkeleton } from "@/components/common/SectionSkeleton";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobileOptimization } from "@/hooks/use-mobile";
import { useActiveTestCount } from "@/hooks/queries/useActiveTestCount";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomepageLiveComparison } from "@/components/sections/homepage-live-comparison";

// Hero LCP preloading is owned by the route head() in src/routes/index.tsx —
// duplicating it here downloaded a second, unused hero image on every visit.

// Above-the-fold: eager
import HeroMasthead from "@/components/sections/HeroMasthead";

const PartnersGrid = lazy(() => import("@/components/sections/PartnersGrid"));
const JourneySimplified = lazy(
  () => import("@/components/sections/JourneySimplified"),
);
const PartnerShowcaseGrid = lazy(
  () => import("@/components/sections/PartnerShowcaseGrid"),
);
const FeaturedPublications = lazy(() =>
  import("@/components/sections/FeaturedPublications").then((m) => ({
    default: m.FeaturedPublications,
  })),
);

const AccreditedProvidersBar = lazy(
  () => import("@/components/sections/AccreditedProvidersBar"),
);

const TestimonialCarousel = lazy(
  () => import("@/components/sections/TestimonialCarousel"),
);
const DreamHealthShowcase = lazy(
  () => import("@/components/sections/DreamHealthShowcase"),
);
const ClinicAndHelpSection = lazy(
  () => import("@/components/sections/ClinicAndHelpSection"),
);
const CallToAction = lazy(() => import("@/components/sections/CallToAction"));

const StartJourneySection = lazy(
  () => import("@/components/sections/StartJourneySection"),
);

const NewsletterSection = lazy(
  () => import("@/components/sections/NewsletterSection"),
);

const HeroPopularTests = lazy(() =>
  import("@/components/sections/HeroPopularTests").then((m) => ({
    default: m.HeroPopularTests,
  })),
);

const SectionFallback = () => (
  <div className="min-h-[200px]" aria-hidden="true" />
);

const PartnerShowcaseSkeleton = () => (
  <SectionSkeleton tone="navy" cards={3} minHeight={800} />
);
const TestimonialSkeleton = () => (
  <SectionSkeleton tone="navy" cards={3} minHeight={500} />
);
const ClinicHelpSkeleton = () => (
  <SectionSkeleton tone="white" cards={2} minHeight={500} />
);

const Index = () => {
  usePerformanceOptimization();
  useMobileOptimization();
  const activeTestCount = useActiveTestCount();

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
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  };

  // Organization + WebSite JSON-LD live once, site-wide, in src/routes/__root.tsx.
  // Repeating them here duplicated ~2 KB of markup in every homepage response.

  return (
    <ErrorBoundary>
      <MainLayout>
        <Helmet>
          {/* Hero preload lives in the route head() — see src/routes/index.tsx. */}

          {/* Title, description, canonical, og:* and twitter:* are owned by the
              route head() in src/routes/index.tsx — single source of truth. */}
          <meta
            name="keywords"
            content="private blood tests UK, health screening comparison, blood test prices UK, hormone testing, vitamin tests, cancer screening, health MOT UK, at-home blood tests, private health tests comparison"
          />
          <meta property="og:site_name" content="myhealth checkup" />
          <meta
            property="og:image"
            content="https://myhealthcheckup.co.uk/og-image.png"
          />
          <meta property="og:locale" content="en_GB" />

          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@myhealthcheckup" />
          <meta
            name="twitter:image"
            content="https://myhealthcheckup.co.uk/og-image.png"
          />

          <meta
            name="robots"
            content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
          />

          <link rel="manifest" href="/manifest.json" />
          <meta name="theme-color" content="#22c0d4" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta
            name="apple-mobile-web-app-status-bar-style"
            content="default"
          />
          <meta name="apple-mobile-web-app-title" content="myhealth checkup" />

          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
        </Helmet>

        <div>
          <div className="mt-0 mx-0">
            <HeroMasthead />
          </div>

          {/* Accredited standards bar — sits directly under the slogan */}
          <Suspense fallback={<SectionFallback />}>
            <div className="bg-white px-3 sm:px-6 pt-4 pb-6">
              <AccreditedProvidersBar />
            </div>
          </Suspense>

          <div id="comparison-anchor" aria-hidden="true" />

          {/* Hero CTA — Slogan + Health Quiz entry point */}
          <section aria-label="Your health and live comparison" className="overflow-hidden bg-surface border border-brand-navy/5 shadow-e3 rounded-xl p-3 sm:p-6 mx-3 sm:mx-10 mt-0 mb-6 sm:mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] items-center gap-10 lg:gap-16 rounded-xl bg-brand-navy px-5 py-8 sm:p-10 lg:px-10 lg:py-10">
              <div className="min-w-0">
                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl xl:text-4xl leading-tight text-white mb-6 text-center lg:text-left">
                  Your <span className="text-brand-turquoise">health</span> is your
                  greatest <span className="text-brand-pink">asset.</span>
                </h2>

                <div className="text-left mb-6">
                  <p className="text-on-dark-subtle text-sm sm:text-base leading-relaxed">
                    At myhealth checkup, everyone deserves access to transparent, trustworthy health
                    information. Our mission is to make it simple to compare private health tests from
                    accredited UK providers – all of which meet rigorous quality standards, including
                    UKAS accreditation and CQC regulation.
                  </p>
                </div>

                <div className="w-full mb-6">
                  <div
                    className="h-0.5 w-full bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise"
                    aria-hidden="true"
                  />
                </div>

                <div className="flex flex-col items-center gap-6 w-full text-center">
                  <h2
                    className="font-heading text-xl sm:text-2xl font-bold text-white leading-tight"
                  >
                    Not sure what test you need?
                  </h2>

                  <p className="text-on-dark-subtle text-sm sm:text-base leading-relaxed">
                    Answer 6 quick questions and our AI will match you to the best-fit tests from {activeTestCount.toLocaleString("en-GB")} accredited options.
                  </p>
                  <Button asChild variant="brandPill" size="lg" className="font-heading bg-brand-turquoise text-white hover:bg-brand-pink">
                  <Link
                    to="/find-test"
                    aria-label="Take the Health Quiz — find the right private blood test"
                  >
                    Take the Health Quiz
                  </Link>
                  </Button>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-on-dark-subtle text-xs">
                    <span className="flex items-center gap-1">
                      <Shield className="w-3 h-3 shrink-0" /> No account
                      required
                    </span>
                    <span className="hidden sm:inline">{"\n"}</span>
                    <span>Takes 2 minutes</span>
                    <span className="hidden sm:inline">{"\n"}</span>
                    <span>100% free</span>
                  </div>
                </div>
              </div>
              <HomepageLiveComparison className="justify-self-center" />
            </div>
          </section>

          <Suspense fallback={<SectionFallback />}>
            <SectionReveal>
              <PartnersGrid />
            </SectionReveal>
          </Suspense>

          <Suspense fallback={<SectionFallback />}>
            <SectionReveal delay={0.05}>
              <HeroPopularTests />
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

          <Suspense fallback={<SectionFallback />}>
            <SectionReveal delay={0.1}>
              <FeaturedPublications />
            </SectionReveal>
          </Suspense>

          <LazyMount
            minHeight={800}
            className="bg-brand-navy"
            fallback={<PartnerShowcaseSkeleton />}
          >
            <Suspense fallback={<PartnerShowcaseSkeleton />}>
              <SectionReveal delay={0.1}>
                <PartnerShowcaseGrid />
              </SectionReveal>
            </Suspense>
          </LazyMount>

          <LazyMount
            minHeight={500}
            className="bg-brand-navy"
            fallback={<TestimonialSkeleton />}
          >
            <Suspense fallback={<TestimonialSkeleton />}>
              <SectionReveal>
                <TestimonialCarousel />
              </SectionReveal>
            </Suspense>
          </LazyMount>

          <LazyMount
            minHeight={500}
            className="bg-white"
            fallback={<ClinicHelpSkeleton />}
          >
            <Suspense fallback={<ClinicHelpSkeleton />}>
              <SectionReveal delay={0.1}>
                <ClinicAndHelpSection />
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
