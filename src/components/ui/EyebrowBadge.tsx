import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * EyebrowBadge
 *
 * Reusable eyebrow used above section headings across the app
 * (e.g. "Accredited & Verified"). Renders a centered uppercase
 * label flanked by two decorative pink rule lines.
 *
 * Design goals:
 *  - Single source of truth for the eyebrow pattern
 *  - Responsive: text wraps naturally at any breakpoint; the pink
 *    rules stay vertically aligned to the centre of the label
 *    regardless of how many lines the text takes
 *  - Translation-resilient: long localised strings just grow the
 *    label vertically without breaking layout, clipping, or
 *    misaligning the rules
 *  - Accessible: the decorative rules are hidden from AT; the
 *    label is real text
 *
 * Variants:
 *  - size:  "sm" (default) matches the light-surface partner card style
 *           "md" matches the dark-surface hero style
 *  - tone:  purely semantic — always renders in brand turquoise, but
 *           the token differs so tone-specific tweaks (contrast,
 *           opacity) can be applied per surface in future without
 *           touching call sites
 */

export type EyebrowBadgeSize = "sm" | "md";
export type EyebrowBadgeTone = "onLight" | "onDark";

export interface EyebrowBadgeProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** Label text. Defaults to the canonical "Accredited & Verified". */
  label?: React.ReactNode;
  /** Size preset — controls text size, tracking, gap and rule length. */
  size?: EyebrowBadgeSize;
  /** Surface tone — reserved for future per-surface tuning. */
  tone?: EyebrowBadgeTone;
  /** Element tag. Defaults to <div>. */
  as?: "div" | "p" | "span";
}

const sizeClasses: Record<
  EyebrowBadgeSize,
  { text: string; tracking: string; rule: string; gap: string }
> = {
  sm: {
    text: "text-[11px] sm:text-xs",
    tracking: "tracking-[0.2em] sm:tracking-[0.3em]",
    rule: "w-6 sm:w-10",
    gap: "gap-3 sm:gap-4",
  },
  md: {
    text: "text-sm sm:text-base md:text-lg",
    tracking: "tracking-[0.25em]",
    rule: "w-8 sm:w-12",
    gap: "gap-3",
  },
};

const toneClasses: Record<EyebrowBadgeTone, string> = {
  onLight: "text-[#22c0d4]",
  onDark: "text-brand-turquoise",
};

export const EyebrowBadge = React.forwardRef<HTMLElement, EyebrowBadgeProps>(
  (
    {
      label = (
        <>
          <span className="block sm:inline">Accredited</span>
          <span className="block sm:inline sm:mx-1">&amp;</span>
          <span className="block sm:inline">Verified</span>
        </>
      ),
      size = "sm",
      tone = "onLight",
      as = "div",
      className,
      ...rest
    },
    ref,
  ) => {
    const s = sizeClasses[size];
    const Tag = as as React.ElementType;

    return (
      <Tag
        ref={ref}
        className={cn(
          "flex w-full items-center justify-center px-4",
          s.gap,
          className,
        )}
        {...rest}
      >
        <span
          aria-hidden="true"
          className={cn("h-px shrink-0 bg-[#e70d69]", s.rule)}
        />
        <span
          className={cn(
            "min-w-0 text-center font-bold uppercase leading-tight text-balance",
            s.text,
            s.tracking,
            toneClasses[tone],
          )}
        >
          {label}
        </span>
        <span
          aria-hidden="true"
          className={cn("h-px shrink-0 bg-[#e70d69]", s.rule)}
        />
      </Tag>
    );
  },
);
EyebrowBadge.displayName = "EyebrowBadge";

export default EyebrowBadge;
