import React from "react";
import { Link } from "react-router-dom";
import { BadgeDollarSign, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type SponsoredBadgeVariant =
  | "sponsored" // paid placement, ranking influenced
  | "promoted" // commercial promotion, ranking NOT influenced
  | "affiliate"; // affiliate link present, no ranking influence

interface SponsoredBadgeProps {
  variant?: SponsoredBadgeVariant;
  size?: "sm" | "md";
  className?: string;
  /** Hide the info icon (compact contexts) */
  compact?: boolean;
}

const COPY: Record<
  SponsoredBadgeVariant,
  { label: string; tooltip: string }
> = {
  sponsored: {
    label: "Sponsored",
    tooltip:
      "This placement is paid for by the provider. Its position has been influenced by a commercial arrangement. We disclose this in line with CMA and DMCC 2024 transparency rules.",
  },
  promoted: {
    label: "Promoted",
    tooltip:
      "This provider has a commercial relationship with myhealth checkup, but ranking and ordering are not influenced. Shown for transparency under CMA / DMCC 2024 guidance.",
  },
  affiliate: {
    label: "Affiliate link",
    tooltip:
      "We may earn a small commission if you book through this link, at no extra cost to you. Affiliate relationships do not influence ranking or editorial content.",
  },
};

/**
 * Visible commercial-disclosure badge for any sponsored, promoted, or
 * affiliate placement. Mandatory wherever consideration has been received
 * (CMA Online Choice Architecture guidance + DMCC Act 2024 s.226).
 */
const SponsoredBadge: React.FC<SponsoredBadgeProps> = ({
  variant = "sponsored",
  size = "sm",
  className,
  compact = false,
}) => {
  const { label, tooltip } = COPY[variant];
  const sizeClasses =
    size === "sm"
      ? "text-[10px] px-2 py-0.5 gap-1"
      : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="note"
          aria-label={`${label} — commercial disclosure`}
          className={cn(
            "inline-flex items-center rounded-full font-semibold uppercase tracking-wide",
            "bg-amber-100 text-amber-900 border border-amber-300",
            "dark:bg-amber-500/15 dark:text-amber-200 dark:border-amber-400/40",
            sizeClasses,
            className,
          )}
        >
          <BadgeDollarSign className="w-3 h-3" aria-hidden="true" />
          {label}
          {!compact && <Info className="w-3 h-3 opacity-70" aria-hidden="true" />}
        </span>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
        <p>{tooltip}</p>
        <Link
          to="/affiliate-disclosure"
          className="mt-1 inline-block underline text-primary"
        >
          Read our full commercial disclosure
        </Link>
      </TooltipContent>
    </Tooltip>
  );
};

export default SponsoredBadge;
