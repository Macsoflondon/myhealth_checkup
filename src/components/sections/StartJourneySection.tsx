import { Link } from "@/lib/router-compat";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { LiveCatalogueComparison } from "@/design-system/live-catalogue-comparison";
import { useHomepageComparisons } from "@/hooks/use-homepage-comparisons";
import { selectHomepageComparisons } from "@/lib/homepage-comparisons";

/**
 * Outline shared with the test cards above this section: a turquoise edge at
 * 35% with the same soft turquoise glow, warming to full turquoise on hover.
 */
const PANEL_OUTLINE =
  "border border-brand-turquoise/35 shadow-[0_0_0_1px_rgba(34,192,212,0.18),0_6px_20px_rgba(34,192,212,0.14)] hover:border-brand-turquoise hover:shadow-[0_0_0_1px_rgba(34,192,212,0.32),0_12px_32px_rgba(34,192,212,0.28)]";

/** Navy edge every action carries, so the three buttons read as one set. */
const BUTTON_BORDER = "border-2 border-brand-navy";

const StartJourneySection = () => {
  const { data: panels = [], isPending: comparisonsLoading } =
    useHomepageComparisons();
  const [syncIdx, setSyncIdx] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setSyncIdx((index) => index + 1), 30000);
    return () => clearInterval(interval);
  }, []);
  const { left, right } = selectHomepageComparisons(panels, syncIdx);

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-6 sm:py-8">
      <div className="homepage-section-inner">
        <div
          className={`relative bg-white rounded-2xl overflow-hidden mb-6 sm:mb-8 transition-all duration-700 ease-out hover:-translate-y-1 ${PANEL_OUTLINE}`}
        >
          <div className="p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
                <span className="type-eyebrow text-brand-turquoise">
                  Start your journey
                </span>
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
              </div>
              <h2 className="type-section-title text-[#081129] mb-3">
                Take control of your health today
              </h2>
              <p className="text-base sm:text-lg text-brand-navy leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Compare trusted, accredited tests from leading UK providers in
                minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row lg:flex-row gap-3 lg:flex-shrink-0 lg:max-w-[640px] w-full lg:w-auto">
              {/* Each button flips to the opposite brand colour on hover:
                  turquoise to pink, pink to turquoise, white to navy. */}
              <Link
                to="/assisted-test-finder"
                className={cn(
                  buttonVariants({ variant: "plain", size: "lg" }),
                  "w-full sm:w-auto sm:flex-1 bg-brand-turquoise hover:bg-brand-pink text-white font-semibold rounded-full shadow-[0_8px_28px_-8px_rgba(34,192,212,0.5)] hover:shadow-[0_10px_32px_-8px_rgba(231,13,105,0.6)] transition-all active:scale-[0.98]",
                  BUTTON_BORDER,
                )}
              >
                Find your test
              </Link>
              <Link
                to="/compare/goals"
                className={cn(
                  buttonVariants({ variant: "plain", size: "lg" }),
                  "w-full sm:w-auto sm:flex-1 bg-brand-pink hover:bg-brand-turquoise text-white font-semibold rounded-full shadow-[0_8px_28px_-8px_rgba(231,13,105,0.45)] hover:shadow-[0_10px_32px_-8px_rgba(34,192,212,0.6)] transition-all active:scale-[0.98]",
                  BUTTON_BORDER,
                )}
              >
                Compare by goal
              </Link>
              <Link
                to="/compare"
                className={cn(
                  buttonVariants({ variant: "plain", size: "lg" }),
                  "w-full sm:w-auto sm:flex-1 bg-white text-brand-navy hover:bg-brand-navy hover:text-white font-semibold rounded-full transition-colors active:scale-[0.98]",
                  BUTTON_BORDER,
                )}
              >
                Browse all tests
              </Link>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-stretch">
          <LiveCatalogueComparison
            panel={left}
            loading={comparisonsLoading}
            tone="navy"
          />
          <LiveCatalogueComparison
            panel={right}
            loading={comparisonsLoading}
            tone="navy"
          />
        </div>
      </div>
    </section>
  );
};

export default StartJourneySection;
