import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProviderRatings } from "@/hooks/queries/useProviderRatings";
import { formatCheckedDate, formatReviewCount } from "@/lib/provider-rating-lookup";

interface ProviderRatingBadgeProps {
  /** Provider ID, alias or display name. */
  provider: string | null | undefined;
  className?: string;
}

/**
 * Verified Trustpilot rating with a source link and checked date. Renders
 * nothing while loading or when there is no stored rating.
 */
export function ProviderRatingBadge({ provider, className }: ProviderRatingBadgeProps) {
  const { getRating } = useProviderRatings();
  const r = getRating(provider);
  if (!r) return null;
  const checked = formatCheckedDate(r.checkedAt);
  const stars = r.rating.toFixed(1);
  const count = formatReviewCount(r.reviewCount);
  const link = r.sourceUrl ? (
    <a
      href={r.sourceUrl}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="underline underline-offset-2 hover:text-brand-pink"
      onClick={(e) => e.stopPropagation()}
    >
      Trustpilot
    </a>
  ) : (
    <span>Trustpilot</span>
  );
  return (
    <span
      className={cn("inline-flex flex-wrap items-center gap-x-1 gap-y-0.5", className)}
      aria-label={`Rated ${stars} out of 5 from ${count} reviews on Trustpilot`}
    >
      <Star className="h-3 w-3 shrink-0 fill-[#D4A843] text-[#D4A843]" aria-hidden="true" />
      <span className="font-semibold">{stars}</span>
      <span>· {count} reviews ·</span>
      {link}
      {checked && <span className="opacity-75">· checked {checked}</span>}
    </span>
  );
}
