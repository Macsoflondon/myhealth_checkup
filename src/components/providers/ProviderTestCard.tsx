/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { UniversalTestCard } from "@/components/cards/UniversalTestCard";
import { fromProviderTest } from "@/lib/universalTestAdapter";

export interface ProviderTestCardData {
  id: string;
  provider_id: string;
  test_name: string;
  description?: string | null;
  price?: number | null;
  category?: string | null;
  sample_type?: string | null;
  biomarker_count?: number | null;
  is_popular?: boolean | null;
  url?: string | null;
  biomarkers_list?: unknown;
  home_kit_available?: boolean | null;
  clinic_visit_available?: boolean | null;
  turnaround_days_text?: string | null;
  base_price?: number | null;
  collection_options?: any;
  reviews?: number | null;
  categoryColor?: string | null;
  badge?: string;
  rating?: number | null;
  price_from?: boolean;
  markers?: string[] | null;
  compare_selected?: boolean;
  onCompareToggle?: () => void;
}

interface ProviderTestCardProps {
  test: ProviderTestCardData;
  providerName?: string;
  turnaroundTime?: string;
  onClick?: () => void;
}

/**
 * ProviderTestCard — backwards-compatible wrapper that renders the universal
 * test card (matching the /at-home-tests design).
 */
export default function ProviderTestCard({ test, onClick, turnaroundTime }: ProviderTestCardProps) {
  const data = fromProviderTest({
    ...test,
    turnaround_days_text: test.turnaround_days_text || turnaroundTime || null,
  });
  return <UniversalTestCard test={data} onOpenDetail={onClick} />;
}
