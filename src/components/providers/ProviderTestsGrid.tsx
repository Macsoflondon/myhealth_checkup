/* eslint-disable @typescript-eslint/no-explicit-any -- TODO: type properly; inherited from upstream merge 2026-07-10 */
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderRating } from "@/constants/providerRatings";
import { getBranding } from "@/data/providerBranding";
import { hasStartingPrice } from "@/hooks/usePopularTestsFromDatabase";
import { toUnifiedCardProps } from "@/lib/unifiedCardAdapter";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";

const PROVIDER_ID_DB_MAP: Record<string, string> = {
  "randox-health": "randox",
  "goodbody-clinic": "goodbody-clinic",
  "medichecks": "medichecks",
  "thriva": "thriva",
  "lola-health": "lola-health",
  "london-medical-laboratory": "london-medical-laboratory",
  "london-health-company": "london-health-company",
  "clinilabs": "clinilabs",
  "medical-diagnosis": "medical-diagnosis",
};

interface Props {
  providerSlug: string;
  providerDisplayName: string;
  limit?: number;
}

export const ProviderTestsGrid = ({ providerSlug, providerDisplayName, limit = 1000 }: Props) => {
  const dbId = PROVIDER_ID_DB_MAP[providerSlug] ?? providerSlug;
  const branding = getBranding(providerDisplayName);
  const rating = getProviderRating(providerDisplayName);

  const { data, isLoading } = useQuery({
    queryKey: ["provider-tests-grid", dbId, limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select(
          "id, test_name, price, base_price, category, sample_type, url, biomarker_count, biomarkers_list, description, turnaround_days_text, collection_options, popularity_rank, is_popular"
        )
        .eq("provider_id", dbId)
        .eq("is_active", true)
        .not("price", "is", null)
        .order("is_popular", { ascending: false, nullsFirst: false })
        .order("popularity_rank", { ascending: true, nullsFirst: false })
        .limit(limit);
      if (error) throw error;
      return data ?? [];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-72 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) return null;

  return (
    <section className="mb-8 md:mb-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-[#081129]">
            Tests from {providerDisplayName}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {data.length} tests available
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {data.map((t: any) => {
          const card: ProviderTestCardData = {
            id: t.id,
            provider_id: dbId,
            test_name: t.test_name,
            description:
              t.description || `Comprehensive screening from ${providerDisplayName}.`,
            price: t.price ?? null,
            category: t.category ?? null,
            sample_type: t.sample_type ?? null,
            biomarker_count: t.biomarker_count ?? null,
            url: t.url ?? null,
            biomarkers_list: (t.biomarkers_list as any) ?? null,
            turnaround_days_text: t.turnaround_days_text ?? null,
            base_price: t.base_price ?? null,
            collection_options: t.collection_options ?? null,
            price_from: hasStartingPrice(t),
            categoryColor: branding?.primary || "#e70d69",
          };
          return (
            <UnifiedTestCard
              key={t.id}
              {...toUnifiedCardProps(card, {
                provider: providerDisplayName,
                rating: rating.rating,
                reviews: rating.reviews,
                ctaLabel: t.url ? "View test" : "Compare",
              })}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ProviderTestsGrid;
