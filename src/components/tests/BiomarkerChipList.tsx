import { useId, useState } from "react";

const UTC_NAVY = "#081129";
const UTC_TINT = "#f1f5f9";

const DEFAULT_VISIBLE = 5;

interface BiomarkerChipListProps {
  /** Biomarker (or allergen/cancer type) names stored for this test. */
  biomarkers: string[];
  /** Count published by the provider, used to flag an incomplete stored list. */
  publishedCount?: number | null;
  /** Plural noun for what is measured, e.g. "biomarkers". */
  noun?: string;
  /** Visual treatment: navy chips (modal) or muted cards (detail page). */
  variant?: "chips" | "cards";
  className?: string;
}

/**
 * Shows the first five entries with a "Show N more" toggle. When the stored
 * list is shorter than the provider's published count, the heading states that
 * plainly rather than implying the shorter number is the full panel.
 */
export function BiomarkerChipList({
  biomarkers,
  publishedCount,
  noun = "biomarkers",
  variant = "chips",
  className,
}: BiomarkerChipListProps) {
  const [expanded, setExpanded] = useState(false);
  const listId = useId();

  const title = `${noun.charAt(0).toUpperCase()}${noun.slice(1)} tested`;

  if (biomarkers.length === 0) {
    return (
      <div className={className}>
        <Heading>{title}</Heading>
        <p className="text-sm italic text-[#081129]/50 leading-relaxed">
          {title} not published by this provider.
        </p>
      </div>
    );
  }

  const incomplete =
    typeof publishedCount === "number" && publishedCount > biomarkers.length;
  const headingLabel = incomplete
    ? `${title} — showing ${biomarkers.length} of ${publishedCount} published by the provider`
    : `${title} (${biomarkers.length})`;

  const visible = expanded ? biomarkers : biomarkers.slice(0, DEFAULT_VISIBLE);
  const hiddenCount = biomarkers.length - DEFAULT_VISIBLE;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
        <Heading>{headingLabel}</Heading>
        {hiddenCount > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            aria-controls={listId}
            className="text-xs font-semibold text-[#22c0d4] underline underline-offset-2 hover:text-[#e70d69] transition-colors"
          >
            {expanded ? "Show less" : `Show ${hiddenCount} more`}
          </button>
        )}
      </div>
      <div id={listId} className="flex flex-wrap gap-2">
        {visible.map((b, i) => (
          <span
            key={`${b}-${i}`}
            className={
              variant === "cards"
                ? "inline-flex items-center rounded-md border bg-muted/30 px-2.5 py-1.5 text-sm"
                : "inline-flex items-center rounded-full px-2.5 py-1 text-xs"
            }
            style={
              variant === "chips"
                ? { background: UTC_TINT, color: UTC_NAVY, fontFamily: "'DM Sans',sans-serif" }
                : undefined
            }
          >
            {b}
          </span>
        ))}
      </div>
    </div>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-xs font-bold uppercase tracking-[0.12em] text-[#081129] font-[Montserrat] m-0">
      {children}
    </h4>
  );
}
