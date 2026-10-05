import { useId } from "react";

interface CategoryStandardHeroProps {
  /** Category name shown at the top of the hero, e.g. "Cancer Screening" */
  pillLabel: string;
  /**
   * One or two sentences describing what the category covers. Rendered as
   * visible intro text beneath the heading, so both readers and crawlers see
   * the page's specific focus. Omitted on pages that have no intro copy.
   */
  subtitle?: string;
  /** Semantic heading level. Use h1 for standalone page titles, h2 when nested inside a page that already has an h1. */
  as?: "h1" | "h2";
}

/**
 * CategoryStandardHero
 * Minimal category header used across all category landing pages.
 * Shows the category name, an optional descriptive intro, and a tricolour
 * divider on a navy background.
 */
export function CategoryStandardHero({
  pillLabel,
  subtitle,
  as = "h1",
}: CategoryStandardHeroProps) {
  const headingId = useId();
  const Heading = as;

  return (
    <>
      <section
        aria-labelledby={headingId}
        className="px-4 sm:px-8 md:px-10 pt-10 sm:pt-12 md:pt-14 pb-11 sm:pb-14"
        style={{
          background: "#081129",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(6,11,24,0.08) 1px, transparent 0)",
            backgroundSize: "40px 40px",
            pointerEvents: "none",
          }}
        />
        {/* Ambient glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "-10%",
            left: "-5%",
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(233,30,140,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10%",
            right: "-5%",
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,212,200,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          {/* Category name */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 relative">
            <span
              aria-hidden="true"
              className="flex-shrink-0 h-px w-8 sm:w-12 bg-[#e70d69]"
            />
            <Heading
              id={headingId}
              className="font-bold text-center m-0 text-white text-xl sm:text-2xl md:text-[33px]"
              style={{
                letterSpacing: "0.04em",
                lineHeight: 1.15,
                // Ensures capital-letter optical baseline sits centred against the accent lines
                paddingBlock: "0.05em",
              }}
            >
              {pillLabel}
            </Heading>
            <span
              aria-hidden="true"
              className="flex-shrink-0 h-px w-8 sm:w-12 bg-[#e70d69]"
            />
          </div>

          {/* Descriptive intro: what this category covers, shown beneath the
              heading so the listing below it has visible context. */}
          {subtitle ? (
            <p className="mx-auto mt-4 sm:mt-5 max-w-2xl text-center text-sm sm:text-base leading-relaxed text-white/85">
              {subtitle}
            </p>
          ) : null}

          {/* Tricolour divider */}
          <div
            role="presentation"
            aria-hidden="true"
            className="mt-5 sm:mt-6"
            style={{
              height: 3,
              background: "linear-gradient(90deg, #22c0d4, #e70d69, #22c0d4)",
              borderRadius: 2,
            }}
          />
        </div>
      </section>
      {/* Boundary marker: the category toolbar is portalled here so it straddles the navy/white edge */}
      <div id="page-toolbar-anchor" className="relative h-0 z-[1000]" />
    </>
  );
}
