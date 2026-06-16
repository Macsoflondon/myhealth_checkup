import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderRating } from "@/constants/providerRatings";
import { getBranding } from "@/data/providerBranding";
import { hasStartingPrice } from "@/hooks/usePopularTestsFromDatabase";

// Map detailedProvider IDs (routing slug) -> DB provider_id
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

export const ProviderTestsGrid = ({ providerSlug, providerDisplayName, limit = 12 }: Props) => {
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
            {data.length} tests available · live pricing from Supabase
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {data.map((t: any) => {
          const cleanName = (t.test_name as string)
            .replace(/\s*[-–|].*$/, "")
            .replace(/\s+Blood Test$/i, "")
            .trim();
          return (
            <UnifiedTestCard
              key={t.id}
              category={t.category || "Health"}
              categoryColor={branding?.primary || "#e70d69"}
              name={cleanName}
              description={
                t.description || `Comprehensive screening from ${providerDisplayName}.`
              }
              biomarkers={t.biomarker_count || 0}
              results={t.turnaround_days_text || "2–5 working days"}
              collection={t.sample_type || "Blood sample"}
              rating={rating.rating}
              reviews={rating.reviews}
              price={t.price}
              priceFrom={hasStartingPrice(t)}
              provider={providerDisplayName}
              url={t.url || undefined}
              ctaLabel={t.url ? "View test" : "Compare"}
              testDetails={{
                id: t.id,
                provider_id: dbId,
                test_name: t.test_name,
                description: t.description ?? null,
                price: t.price ?? null,
                category: t.category ?? null,
                sample_type: t.sample_type ?? null,
                biomarker_count: t.biomarker_count ?? null,
                url: t.url ?? null,
                biomarkers_list: (t.biomarkers_list as any) ?? null,
                turnaround_days_text: t.turnaround_days_text ?? null,
                base_price: t.base_price ?? null,
                collection_options: t.collection_options ?? null,
              }}
            />
          );
        })}
      </div>
    </section>
  );
};

export default ProviderTestsGrid;
