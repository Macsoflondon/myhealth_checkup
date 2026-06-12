import { lazy, Suspense, type ReactNode } from "react";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";


const FeaturedPublications = lazy(() =>
  import("@/components/sections/FeaturedPublications").then((m) => ({ default: m.FeaturedPublications }))
);
const DreamHealthShowcase = lazy(() => import("@/components/sections/DreamHealthShowcase"));
const GoodbodyBentoShowcase = lazy(() => import("@/components/sections/GoodbodyBentoShowcase"));
const CallToAction = lazy(() => import("@/components/sections/CallToAction"));

const BentoSkeleton = () => (
  <div
    className="min-h-[420px] sm:min-h-[480px] w-full rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-6 space-y-4"
    aria-hidden="true"
  >
    <Skeleton className="h-6 w-1/3 bg-white/10" />
    <Skeleton className="h-48 sm:h-64 w-full bg-white/10" />
    <div className="grid grid-cols-2 gap-3">
      <Skeleton className="h-20 bg-white/10" />
      <Skeleton className="h-20 bg-white/10" />
    </div>
  </div>
);

const BlockSkeleton = ({ height = "min-h-[360px]" }: { height?: string }) => (
  <div className={`container mx-auto px-4 ${height}`} aria-hidden="true">
    <div className="max-w-6xl mx-auto space-y-4 py-8">
      <Skeleton className="h-8 w-1/2 mx-auto bg-white/10" />
      <Skeleton className="h-4 w-2/3 mx-auto bg-white/10" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <Skeleton className="h-40 bg-white/10" />
        <Skeleton className="h-40 bg-white/10" />
        <Skeleton className="h-40 bg-white/10" />
      </div>
    </div>
  </div>
);

const CtaSkeleton = () => (
  <div className="container mx-auto px-4 min-h-[220px] py-8" aria-hidden="true">
    <Skeleton className="h-40 w-full max-w-4xl mx-auto bg-white/10 rounded-2xl" />
  </div>
);

const SectionErrorFallback = ({ name }: { name: string }) => (
  <div className="container mx-auto px-4 py-6" role="alert">
    <div className="max-w-4xl mx-auto rounded-xl border border-white/10 bg-white/5 p-4 text-center text-white/70 text-sm">
      We couldn't load the {name} section right now. The rest of the page is unaffected.
    </div>
  </div>
);

const SafeBlock = ({
  name,
  fallback,
  children,
}: {
  name: string;
  fallback: ReactNode;
  children: ReactNode;
}) => (
  <ErrorBoundary fallback={<SectionErrorFallback name={name} />}>
    <Suspense fallback={fallback}>{children}</Suspense>
  </ErrorBoundary>
);


const PartnerShowcaseGrid = () => {
  return (
    <section
      data-hq-images
      className="w-full py-8 sm:py-10 md:py-12 bg-brand-navy relative overflow-hidden min-h-[800px] [&_img]:[image-rendering:high-quality] [&_img]:[-webkit-backface-visibility:hidden] [&_img]:transform-gpu"
    >
      <NavyDecorativeCircles />

      {/* Featured Partner — Goodbody */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 xl:px-16 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
          <div className="md:col-span-2 text-center mt-2 sm:mt-4">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
              <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-[0.25em]">
                Featured Partner
              </span>
              <div className="h-px w-8 sm:w-12 bg-brand-turquoise" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white md:text-5xl">
              Our Featured Partner of the Month
            </h2>
          </div>

          <SafeBlock name="Featured Partner" fallback={<BentoSkeleton />}>
            <GoodbodyBentoShowcase />
          </SafeBlock>
        </div>
      </div>

      <SafeBlock name="Most Popular Tests" fallback={<BlockSkeleton />}>
        <DreamHealthShowcase />
      </SafeBlock>

      <SafeBlock name="Featured Publications" fallback={<BlockSkeleton height="min-h-[280px]" />}>
        <FeaturedPublications />
      </SafeBlock>

      <SafeBlock name="Call To Action" fallback={<CtaSkeleton />}>
        <CallToAction />
      </SafeBlock>


      <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
    </section>
  );
};

export default PartnerShowcaseGrid;
