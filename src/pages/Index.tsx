import { lazy, Suspense } from "react";
import { Link } from "@/lib/router-compat";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import SectionReveal from "@/components/ui/SectionReveal";
import { LazyMount } from "@/components/common/LazyMount";
import {
  HydrateOnVisible,
  lazyPreloadable,
} from "@/components/common/HydrateOnVisible";
import { SectionSkeleton } from "@/components/common/SectionSkeleton";
import { usePerformanceOptimization } from "@/hooks/usePerformanceOptimization";
import { useMobileOptimization } from "@/hooks/use-mobile";
import { useActiveTestCount } from "@/hooks/queries/useActiveTestCount";
import { Shield } from "lucide-react";
import { LiveCatalogueComparison } from "@/design-system/live-catalogue-comparison";
import { useHomepageComparisons } from "@/hooks/use-homepage-comparisons";
import { selectHomepageComparisons } from "@/lib/homepage-comparisons";

// Hero LCP preloading is owned by the route head() in src/routes/index.tsx —
// duplicating it here downloaded a second, unused hero image on every visit.

// Above-the-fold: eager
import { HomepageSearchBand } from "@/components/sections/homepage-search-band";
import HeroMasthead from "@/components/sections/HeroMasthead";

// Server-rendered sections below the hero: HydrateOnVisible keeps their HTML
// and loads their code only when the visitor scrolls near them.
const PartnersGrid = lazyPreloadable(
  () => import("@/components/sections/PartnersGrid"),
);
const PartnerShowcaseGrid = lazy(
  () => import("@/components/sections/PartnerShowcaseGrid"),
);
const DecisionInfrastructureSection = lazyPreloadable(() =>
  import("@/components/sections/DecisionInfrastructureSection").then((m) => ({
    default: m.DecisionInfrastructureSection,
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

const StartJourneySection = lazyPreloadable(
  () => import("@/components/sections/StartJourneySection"),
);

const NewsletterSection = lazy(
  () => import("@/components/sections/NewsletterSection"),
);

const HeroPopularTests = lazyPreloadable(() =>
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

// Rendered as one module-level element so homepage re-renders (data hooks,
// context updates) hand React the same element and it skips this subtree.
// A changed element would make React hydrate these sections at once instead
// of waiting for HydrateOnVisible, and load all their code up front.
const DEFERRED_SECTIONS = (
  <>
    <Suspense fallback={<SectionFallback />}>
      <SectionReveal>
        <AccreditedProvidersBar />
      </SectionReveal>
    </Suspense>

    <HydrateOnVisible load={HeroPopularTests.preload}>
      <Suspense fallback={<SectionFallback />}>
        <SectionReveal delay={0.05}>
          <HeroPopularTests />
        </SectionReveal>
      </Suspense>
    </HydrateOnVisible>

    <HydrateOnVisible load={StartJourneySection.preload}>
      <Suspense fallback={<SectionFallback />}>
        <SectionReveal delay={0.15}>
          <StartJourneySection />
        </SectionReveal>
      </Suspense>
    </HydrateOnVisible>
  </>
);

// "Why myhealth checkup" was moved below "Trusted by users" at the site owner's
// request. It stays a module-level element for the same reason as
// DEFERRED_SECTIONS: homepage re-renders must hand React the same element.
const DECISION_SECTION = (
  <HydrateOnVisible load={DecisionInfrastructureSection.preload}>
    <Suspense fallback={<SectionFallback />}>
      <SectionReveal delay={0.1}>
        <DecisionInfrastructureSection />
      </SectionReveal>
    </Suspense>
  </HydrateOnVisible>
);

const Index = () => {
  usePerformanceOptimization();
  useMobileOptimization();
  const activeTestCount = useActiveTestCount();
  const { data: comparisonPanels = [], isPending: comparisonsLoading } =
    useHomepageComparisons();
  const { upper: upperComparison } = selectHomepageComparisons(
    comparisonPanels,
    0,
  );

  // Organization + WebSite JSON-LD live once, site-wide, in src/routes/__root.tsx.
  // Repeating them here duplicated ~2 KB of markup in every homepage response.

  return (
    <ErrorBoundary>
      <MainLayout>
        <div>
          <div className="mt-0 mx-0">
            <HeroMasthead />
          </div>

          {/* Trusted providers carousel — sits directly under the hero */}
          <Suspense fallback={<SectionFallback />}>
            <PartnersGrid />
          </Suspense>

          <HomepageSearchBand />

          <div id="comparison-anchor" aria-hidden="true" />

          {/* Hero CTA — Slogan + Health Quiz entry point */}
          <section className="w-full rounded-none sm:rounded-2xl overflow-hidden bg-brand-navy">
            <div className="homepage-section-inner relative overflow-hidden py-8 sm:py-10">
              <div className="absolute -right-[50px] -top-[60px] w-[260px] h-[260px] rounded-full bg-[#22c0d4]/[0.12]" />
              <div className="absolute right-[120px] -bottom-[110px] w-[240px] h-[240px] rounded-full bg-[#e70d69]/10" />
              <div className="relative">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.7fr)] gap-8 sm:gap-10 lg:gap-12 items-center lg:items-start">
                  <div className="flex flex-col gap-5 2xl:gap-8 text-left">
                    <h2 className="font-extrabold text-[clamp(1.6rem,3.4vw,2.25rem)] tracking-[-0.02em] leading-[1.15] text-white m-0 font-[Montserrat] text-center xl:whitespace-nowrap">
                      Your <span className="text-[#22c0d4]">health</span> is
                      your greatest{" "}
                      <span className="text-[#e70d69]">asset.</span>
                    </h2>

                    <p className="text-white/85 text-sm sm:text-base leading-relaxed m-0 2xl:text-lg">
                      Compare private blood tests in the UK with myhealth
                      checkup. See prices, biomarkers, collection options and
                      typical turnaround times side by side, using provider
                      listings. Every provider we list uses a UKAS-accredited
                      laboratory or a CQC-regulated clinic. We provide
                      comparison information, not medical care or diagnosis.
                    </p>

                    <div
                      className="h-[2px] w-full rounded-full bg-gradient-to-r from-[#22c0d4] via-[#e70d69] to-[#22c0d4]"
                      aria-hidden="true"
                    />

                    <h3 className="text-[clamp(1.2rem,2.8vw,1.85rem)] font-bold text-white leading-[1.15] tracking-tight font-[Montserrat] m-0 text-center">
                      Not sure what test you need?
                    </h3>
                    <p className="text-white/85 text-sm sm:text-base leading-relaxed m-0 text-center 2xl:text-lg">
                      Answer 6 quick questions and our AI will match you to the
                      best-fit tests from{" "}
                      {activeTestCount.toLocaleString("en-GB")} accredited
                      options.
                    </p>

                    <div className="flex flex-col items-center gap-4">
                      <Link
                        to="/find-test"
                        aria-label="Take the Health Quiz: find the right private blood test"
                        className="inline-flex items-center justify-center gap-2 whitespace-nowrap bg-brand-turquoise text-white shadow-glow-teal hover:bg-brand-pink hover:shadow-glow-pink focus-visible:bg-brand-pink focus-visible:shadow-glow-pink focus-visible:outline-none font-bold font-[Montserrat] text-base px-8 py-3.5 rounded-full transition-all duration-200 hover:scale-[1.02]"
                      >
                        Take the Health Quiz
                      </Link>
                      <div className="flex flex-wrap justify-center items-center gap-x-3 gap-y-1 text-white/80 text-xs 2xl:text-sm">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3 shrink-0" /> No account
                          required
                        </span>
                        <span>Takes 2 minutes</span>
                        <span>100% free</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full justify-center lg:justify-end">
                    <div className="w-full max-w-none sm:max-w-[400px] xl:max-w-[460px] 2xl:max-w-[520px]">
                      <LiveCatalogueComparison
                        panel={upperComparison}
                        loading={comparisonsLoading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {DEFERRED_SECTIONS}

          <Suspense fallback={<PartnerShowcaseSkeleton />}>
            <PartnerShowcaseGrid />
          </Suspense>

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

          {DECISION_SECTION}

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
