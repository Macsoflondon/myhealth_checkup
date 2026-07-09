interface CategoryStandardHeroProps {
  /** Category name shown at the top of the hero, e.g. "Cancer Screening" */
  pillLabel: string;
}

/**
 * CategoryStandardHero
 * Minimal category header used across all category landing pages.
 * Shows only the category name on a navy background with a tricolour divider.
 */
export function CategoryStandardHero({
  pillLabel,
}: CategoryStandardHeroProps) {
  return (
    <section
      className="px-4 sm:px-8 md:px-10 pt-10 sm:pt-12 md:pt-14 pb-6 sm:pb-8"
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
          <span aria-hidden="true" className="h-px w-8 sm:w-12 bg-[#e70d69]" />
          <h1
            className="text-lg sm:text-2xl md:text-[33px] font-bold leading-none truncate m-0 text-center"
            style={{
              letterSpacing: "0.04em",
              color: "#ffffff",
            }}
          >
            {pillLabel}
          </h1>
          <span aria-hidden="true" className="h-px w-8 sm:w-12 bg-[#e70d69]" />
        </div>

        {/* Tricolour divider */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #22c0d4, #e70d69, #22c0d4)",
            borderRadius: 2,
            marginTop: 24,
          }}
        />
      </div>
    </section>
  );
}
