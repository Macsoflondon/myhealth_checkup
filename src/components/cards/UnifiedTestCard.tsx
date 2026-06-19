import { UniversalTestCard } from "@/components/cards/UniversalTestCard";
import { fromLegacyUnified, type LegacyUnifiedProps } from "@/lib/universalTestAdapter";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";

/* ───────── Backwards-compatible props ───────── */
export interface UnifiedTestCardProps {
  category: string;
  categoryColor?: string;
  badge?: string;
  name: string;
  description: string;
  biomarkers: number;
  results: string;
  collection: string;
  rating?: number;
  reviews?: number;
  price: number;
  priceFrom?: boolean;
  markers?: string[];
  provider: string;
  url?: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
  compareSelected?: boolean;
  onCompareToggle?: () => void;
  className?: string;
  testDetails?: ProviderTestCardData;
}

/**
 * UnifiedTestCard — wrapper that renders the platform's universal test card
 * (matching the /at-home-tests design) using the legacy prop API so existing
 * callers don't need to change. Visual style now always matches AtHomeTestCard.
 */
export function UnifiedTestCard(props: UnifiedTestCardProps) {
  const data = fromLegacyUnified(props as LegacyUnifiedProps);
  return <UniversalTestCard test={data} className={props.className} />;
}

export default UnifiedTestCard;
