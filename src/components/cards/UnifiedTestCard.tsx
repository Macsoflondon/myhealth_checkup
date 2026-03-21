import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "@/components/providers/ProviderLogo";

/* ───────── Gradient star rating with partial fill ───────── */
const StarRating = ({ rating, reviews }: { rating: number; reviews: number }) => (
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
              <stop offset={pct} stopColor="#334155" />
            </linearGradient>
          </defs>
          <path
            d="M10 1l2.39 4.84 5.34.78-3.87 3.77.91 5.33L10 13.27l-4.77 2.5.91-5.33L2.27 6.67l5.34-.78z"
            fill={`url(#${id})`}
          />
        </svg>
      );
    })}
    <span className="text-xs font-semibold text-white ml-0.5">
      {rating.toFixed(1)} ({reviews.toLocaleString()})
    </span>
  </div>
);

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
}: UnifiedTestCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleCta = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "flex flex-col overflow-hidden font-sans flex-shrink-0 w-full max-w-[340px]",
        className
      )}
      style={{
        background: "linear-gradient(160deg, hsl(var(--navy) / 0.95) 0%, hsl(var(--navy)) 100%)",
        border: `1px solid ${compareSelected ? "hsl(var(--brand-turquoise))" : hovered ? categoryColor + "66" : "hsl(var(--navy) / 0.6)"}`,
        borderRadius: 20,
        transition: "border-color 0.3s ease, transform 0.25s ease, box-shadow 0.25s ease",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: compareSelected
          ? "0 0 0 1px hsl(var(--brand-turquoise) / 0.4), 0 8px 32px hsl(var(--brand-turquoise) / 0.15)"
          : hovered
            ? `0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px ${categoryColor}33`
            : "0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      {/* Top accent bar */}
      <div className="h-1 w-full" style={{ backgroundColor: categoryColor }} />

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        {/* Compare checkbox + Category + Badge */}
        <div className="flex items-center gap-2 mb-3">
          {onCompareToggle && (
            <button
              onClick={(e) => { e.stopPropagation(); onCompareToggle(); }}
              className="flex-shrink-0 w-[18px] h-[18px] rounded flex items-center justify-center cursor-pointer transition-all duration-150 p-0"
              style={{
                border: `1.5px solid ${compareSelected ? "hsl(var(--brand-turquoise))" : "rgba(255,255,255,0.25)"}`,
                background: compareSelected ? "hsl(var(--brand-turquoise))" : "transparent",
                color: "hsl(var(--navy))",
                fontSize: 11,
                fontWeight: 900,
              }}
              aria-label={compareSelected ? "Remove from comparison" : "Add to comparison"}
            >
              {compareSelected ? "✓" : ""}
            </button>
          )}
          <span
            className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {category}
          </span>
          {badge && (
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-white/10 text-white/80 border border-white/15">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white leading-snug mb-2 line-clamp-2">
          {name}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/55 leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { icon: "🧬", value: biomarkers, label: "Biomarkers" },
            { icon: "⏱", value: results, label: "Results" },
            { icon: "💉", value: collection.split(" / ")[0] || collection.split(" ")[0], label: "Collection" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center rounded-lg py-2 px-1"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <span className="text-base mb-0.5">{stat.icon}</span>
              <span className="text-xs font-bold text-white">{stat.value}</span>
              <span className="text-[10px] text-white/40">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Key Markers */}
        {markers.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-wider text-white/35 font-semibold mb-2 block">
              Key Markers
            </span>
            <div className="flex flex-wrap gap-1.5">
              {markers.slice(0, expanded ? markers.length : 3).map((m) => (
                <span
                  key={m}
                  className="px-2.5 py-1 rounded-md text-[11px] font-medium text-white/80 border border-white/10"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
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
                  className="px-2.5 py-1 rounded-md text-[10px] font-medium text-white/60 border border-white/10 hover:border-white/25 transition-colors cursor-pointer bg-transparent"
                >
                  +{markers.length - 3} more
                </button>
              )}
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="h-px w-full bg-white/10 my-2" />

        {/* Stars + Provider Logo */}
        <div className="flex items-center justify-between mb-4 mt-2">
          <StarRating rating={rating} reviews={reviews} />
          <div className="flex-shrink-0 ml-3">
            <ProviderLogo provider={provider} className="h-6 w-auto max-w-[80px] object-contain" />
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1">
            {priceFrom && (
              <span className="text-xs text-white/40 font-medium">from</span>
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
  );
}

export default UnifiedTestCard;
