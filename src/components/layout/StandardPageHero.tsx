import type { ReactNode } from "react";
import { useId } from "react";

interface StandardPageHeroProps {
  /** Page title shown between the pink hairlines */
  title: string;
  /** Optional single-line strapline below the title */
  strapline?: string;
  /** Optional tick stat row, e.g. ["455 articles", "6 providers"] */
  stats?: readonly string[];
  /** Semantic heading level */
  as?: "h1" | "h2";
  /** Optional extra content (e.g. a search field) rendered above the divider */
  children?: ReactNode;
}

/**
 * StandardPageHero
 * The standard navy page header used across the More-menu pages.
 * Navy #081129 panel, dot grid, ambient glow orbs, Montserrat title flanked by
 * pink hairlines, optional strapline and turquoise tick stat row, closed by the
 * tricolour divider.
 */
export function StandardPageHero({
  title,
  strapline,
  stats,
  as = "h1",
  children,
}: StandardPageHeroProps) {
  const headingId = useId();
  const Heading = as;

  return (
    <section
      aria-labelledby={headingId}
      className="px-4 sm:px-8 md:px-10 pt-10 sm:pt-12 md:pt-14 pb-11 sm:pb-14"
      style={{ background: "#081129", position: "relative", overflow: "hidden" }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(6,11,24,0.08) 1px, transparent 0)",
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
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
        aria-hidden="true"
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
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <span
            aria-hidden="true"
            className="flex-shrink-0 h-px w-8 sm:w-12"
            style={{ background: "#e70d69" }}
          />
          <Heading
            id={headingId}
            className="font-bold text-center m-0 text-white text-xl sm:text-2xl md:text-[33px]"
            style={{
              fontFamily: "Montserrat, 'Helvetica Neue', sans-serif",
              letterSpacing: "0.04em",
              lineHeight: 1.15,
              paddingBlock: "0.05em",
            }}
          >
            {title}
          </Heading>
          <span
            aria-hidden="true"
            className="flex-shrink-0 h-px w-8 sm:w-12"
            style={{ background: "#e70d69" }}
          />
        </div>

        {strapline ? (
          <p
            className="text-center mx-auto mt-4 text-sm sm:text-base"
            style={{ color: "rgba(255,255,255,0.78)", maxWidth: 680, lineHeight: 1.6 }}
          >
            {strapline}
          </p>
        ) : null}

        {stats && stats.length > 0 ? (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {stats.map((stat) => (
              <span
                key={stat}
                className="inline-flex items-center gap-2 text-[13px] sm:text-sm font-semibold"
                style={{ color: "rgba(255,255,255,0.92)" }}
              >
                <span aria-hidden="true" style={{ color: "#22c0d4" }}>
                  ✓
                </span>
                {stat}
              </span>
            ))}
          </div>
        ) : null}

        {children ? <div className="mt-6">{children}</div> : null}

        <div
          role="presentation"
          aria-hidden="true"
          className="mt-6 sm:mt-7"
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
