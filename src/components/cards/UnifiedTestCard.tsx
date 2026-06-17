import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "@/components/providers/ProviderLogo";
import ProviderTestDetailModal from "@/components/providers/ProviderTestDetailModal";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";


/* ───────── Gradient star rating with partial fill ───────── */
const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => {
  if (reviews === 0) return null;
  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.min(1, Math.max(0, rating - (i - 1)));
        const pct = `${Math.round(fill * 100)}%`;
        const id = `star-${i}-${Math.round(rating * 10)}`;
        return (
          <svg key={i} width="16" height="16" viewBox="0 0 20 20" className="flex-shrink-0">
            <defs>
              <linearGradient id={id}>
                <stop offset={pct} stopColor="#facc15" />
                <stop offset={pct} stopColor="#d1d5db" />
              </linearGradient>
            </defs>
            <path
              d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.5.91-5.33L2.27 6.67l5.34-.78z"
              fill={`url(#${id})`}
            />
          </svg>
        );
      })}
      <span className="text-xs font-semibold text-white ml-0.5 whitespace-nowrap">
        {rating.toFixed(1)}&nbsp; ({reviews.toLocaleString()})
      </span>
    </div>
  );
};

/* ───────── Types ───────── */
export interface UnifiedTestCardProps {
  /** Category label shown top-left */
  category: string;
  /** Hex colour for category pill + accent bar */
  categoryColor?: string;
  /** Optional badge text, e.g. "Most Popular" */
  badge?: string;
  /** Test name */
  name: string;
  /** Short description (2-3 lines max) */
  description: string;
  /** Number of biomarkers */
  biomarkers: number;
  /** Turnaround time string */
  results: string;
  /** Collection method string */
  collection: string;
  /** Trustpilot rating 0-5 */
  rating: number;
  /** Number of reviews */
  reviews: number;
  /** Price in GBP */
  price: number;
  /** Show "from" prefix */
  priceFrom?: boolean;
  /** Key marker labels */
  markers?: string[];
  /** Provider display name (used for logo lookup) */
  provider: string;
  /** URL to navigate to on CTA click */
  url?: string;
  /** Override CTA label (default: "Compare") */
  ctaLabel?: string;
  /** Click handler for CTA */
  onCtaClick?: () => void;
  /** Whether this card is selected for comparison */
  compareSelected?: boolean;
  /** Toggle comparison selection */
  onCompareToggle?: () => void;
  /** Additional className */
  className?: string;
  /** Optional structured test data — when provided, tapping the card opens a detail modal */
  testDetails?: ProviderTestCardData;
}


/* ───────── Component ───────── */
export function UnifiedTestCard({
  category,
  categoryColor = "#e70d69",
  badge,
  name,
  description,
  biomarkers,
  results,
  collection,
  rating,
  reviews,
  price,
  priceFrom = false,
  markers = [],
  provider,
  url,
  ctaLabel = "Compare",
  onCtaClick,
  compareSelected,
  onCompareToggle,
  className,
  testDetails,
}: UnifiedTestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (testDetails) {
      setDetailOpen(true);
    } else if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  const handleCardClick = () => {
    if (testDetails) setDetailOpen(true);
  };

  return (
    <>
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      role={testDetails ? "button" : undefined}
      tabIndex={testDetails ? 0 : undefined}
      onKeyDown={(e) => {
        if (testDetails && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          setDetailOpen(true);
        }
      }}
      className={cn(
        "rounded-2xl w-full max-w-[360px] bg-[#08122b] flex flex-col h-full overflow-hidden border-2 transition-all duration-300",
        compareSelected
          ? "border-brand-turquoise shadow-lg shadow-brand-turquoise/30 ring-2 ring-brand-turquoise/40"
          : "border-brand-turquoise/40 shadow-md hover:border-brand-pink hover:shadow-2xl hover:shadow-brand-pink/25",
        hovered && "-translate-y-1",
        testDetails && "cursor-pointer",
        className
      )}
      style={{
        background: "#ffffff",
      }}
    >

      {/* Top accent bar */}
      <div className="h-2 w-full bg-gradient-to-r from-brand-turquoise to-brand-pink" />

      <div className="p-5 sm:p-6 flex flex-col flex-1 bg-[#08122b] text-white">
        {/* Category + Badge strip */}
        <div className="flex items-center gap-2 mb-4 rounded-2xl px-1 py-1" style={{ backgroundColor: categoryColor }}>
          <span
            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {category}
          </span>
          {badge && (
            <span
              className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide text-white ml-auto bg-white/20"
            >
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 text-lg font-bold font-mono leading-snug min-h-[3.25rem] line-clamp-2">
          {name}
        </h3>

        {/* Lola Health add-on notice */}
        {/lola\s*health/i.test(provider) && (
          <div className="mb-2 inline-flex items-start gap-1.5 rounded-md border border-amber-400/40 bg-amber-400/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-200">
            <span aria-hidden>⚠</span>
            <span>Add-on only — can only be purchased when bundled with a Lola Health full test.</span>
          </div>
        )}

        {/* Description */}
        <p className="text-sm leading-relaxed font-semibold text-white/90 line-clamp-3 min-h-[3.75rem] mb-4">
          {/lola\s*health/i.test(provider)
            ? `This test can only be purchased when bundled with one of Lola Health's full test panels. It cannot be ordered on its own. ${description}`
            : description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🧬", value: biomarkers, label: "Biomarkers" },
            { icon: "⏱", value: "2-3 days", label: "Results" },
            { icon: "💉", value: collection.split(" / ")[0] || collection.split(" ")[0], label: "Collection" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center text-center rounded-lg py-2 px-1 min-h-[72px]"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <span className="text-base mb-1 leading-none">{stat.icon}</span>
              <span className="text-sm font-semibold leading-tight truncate max-w-full">{stat.value}</span>
              <span className="text-[10px] text-white/60 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Key Markers — only reserve space when present */}
        <div className={markers.length > 0 ? "mb-4 min-h-[72px]" : "mb-2"}>
          {markers.length > 0 && (
            <>
              <span className="text-[10px] uppercase tracking-wide text-white/70">
                Key Markers
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {markers.slice(0, expanded ? markers.length : 3).map((m) => (
                  <span
                    key={m}
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  >
                    {m}
                  </span>
                ))}
                {!expanded && markers.length > 3 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(true);
                    }}
                    className="px-2.5 py-1 rounded-md text-[10px] font-medium text-white/60 border border-white/15 hover:border-white/40 transition-colors cursor-pointer bg-transparent"
                  >
                    +{markers.length - 3} more
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-white/10 mb-3" />

        {/* Stars + Provider */}
        <div className="flex items-center justify-between mb-4 gap-2">
          <StarRating rating={rating} reviews={reviews} />
          <span className="font-semibold text-white text-sm truncate">{provider}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1">
            {priceFrom && (
              <span className="text-xs text-white/50 font-medium">from</span>
            )}
            <span className="text-2xl font-extrabold text-white">
              £{price}
            </span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCta();
            }}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 cursor-pointer border-0"
            style={{
              backgroundColor: categoryColor,
              color: "#ffffff",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget.style.opacity = "0.85");
              (e.currentTarget.style.transform = "scale(1.03)");
            }}
            onMouseLeave={(e) => {
              (e.currentTarget.style.opacity = "1");
              (e.currentTarget.style.transform = "scale(1)");
            }}
          >
            {ctaLabel}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
    {testDetails && (
      <ProviderTestDetailModal
        test={testDetails}
        providerName={provider}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    )}
    </>
  );
}


export default UnifiedTestCard;
