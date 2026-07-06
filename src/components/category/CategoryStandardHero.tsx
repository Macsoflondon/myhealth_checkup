import { LucideIcon } from "lucide-react";

interface BenefitItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

interface CategoryStandardHeroProps {
  /** Pill label shown at the top, e.g. "GENERAL WELLNESS" */
  pillLabel: string;
  /** Three benefit cards rendered below the pill */
  benefits: [BenefitItem, BenefitItem, BenefitItem];
}

/**
 * CategoryStandardHero
 * Standardised top-of-page hero used across all category landing pages.
 * Mirrors the General Wellness layout:
 *   1. Coloured pill badge with category name
 *   2. Three benefit tiles (icon + title + description)
 *   3. Tricolour gradient divider
 *
 * Designed to sit directly above the filter pills row.
 */
export function CategoryStandardHero({
  pillLabel,
  benefits,
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
        {/* Pill row */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 relative mb-6 sm:mb-8 md:mb-10">
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

        {/* Benefits row */}
        <div
          className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 max-w-[900px] mx-auto mb-6 sm:mb-8 px-2 sm:px-4"
        >
          {benefits.map(({ icon: Icon, title, description }) => (
            <div key={title} style={{ textAlign: "center" }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: "#e70d69",
                  borderRadius: "9999px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 8px",
                }}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  minHeight: 18,
                  color: "#ffffff",
                  marginBottom: 4,
                }}
              >
                {title}
              </h3>
              <p
                style={{
                  fontSize: 12,
                  lineHeight: 1.4,
                  minHeight: 32,
                  maxWidth: 220,
                  color: "rgba(255,255,255,0.7)",
                  margin: "0 auto",
                }}
              >
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Tricolour divider */}
        <div
          style={{
            height: 3,
            background: "linear-gradient(90deg, #22c0d4, #e70d69, #22c0d4)",
            borderRadius: 2,
          }}
        />
      </div>
    </section>
  );
}
