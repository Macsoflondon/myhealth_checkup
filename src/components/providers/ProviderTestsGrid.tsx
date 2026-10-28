import { useQuery, useQueryClient } from "@tanstack/react-query";
import { loadViewPricing, mergeActiveRows } from "@/lib/viewPricing";
import { getProviderGridTests } from "@/services/provider-grid-tests";
import { UnifiedTestCard } from "@/components/cards/UnifiedTestCard";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderRating } from "@/constants/providerRatings";
import { getBranding } from "@/data/providerBranding";
import { hasStartingPrice } from "@/hooks/usePopularTestsFromDatabase";
import { toUnifiedCardProps } from "@/lib/unifiedCardAdapter";
import type { ProviderTestCardData } from "@/components/providers/ProviderTestCard";
import { isJunkTestName } from "@/utils/is-junk-test-name";
import { deriveCollectionVariants } from "@/lib/collectionVariants";

const PROVIDER_ID_DB_MAP: Record<string, string> = {
  "randox-health": "randox",
  "goodbody-clinic": "goodbody-clinic",
  medichecks: "medichecks",
  "lola-health": "lola-health",
  "london-medical-laboratory": "london-medical-laboratory",
  "london-health-company": "london-health-company",
  clinilabs: "clinilabs",
  "medical-diagnosis": "medical-diagnosis",
};

interface Props {
  providerSlug: string;
  providerDisplayName: string;
  limit?: number;
}

export const ProviderTestsGrid = ({
  providerSlug,
  providerDisplayName,
  limit = 1000,
}: Props) => {
  const dbId = PROVIDER_ID_DB_MAP[providerSlug] ?? providerSlug;
  const branding = getBranding(providerDisplayName);
  const rating = getProviderRating(providerDisplayName);

  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["provider-tests-grid", dbId, limit],
    queryFn: async () => {
      const data = await getProviderGridTests(dbId, limit);
      const rows = (data ?? []).filter(
        (test) => !isJunkTestName(test.test_name),
      );
      return mergeActiveRows(
        rows,
        await loadViewPricing(
          queryClient,
          rows.map((r) => r.id),
        ),
      );
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
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-on-dark">
            Tests from {providerDisplayName}
          </h2>
          <p className="text-on-dark-muted text-sm mt-1">
            {data.length} tests available
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {data.flatMap((t) => {
          const card: ProviderTestCardData = {
            id: t.id,
            provider_id: dbId,
            test_name: t.test_name,
            description: t.description ?? null,
            price: t.price ?? null,
            category: t.category ?? null,
            sample_type: t.sample_type ?? null,
            collection_method: t.collection_method ?? null,
            measurement_type: t.measurement_type ?? null,
            who_should_test: t.who_should_test ?? null,
            home_kit_available: t.home_kit_available ?? null,
            clinic_visit_available: t.clinic_visit_available ?? null,
            biomarker_count: t.biomarker_count ?? null,
            url: t.url ?? null,
            url_verified: t.url_verified ?? null,
            image_url: t.image_url ?? null,
            biomarkers_list: t.biomarkers_list ?? null,
            turnaround_days_text: t.turnaround_days_text ?? null,
            base_price: t.base_price ?? null,
            collection_options: t.collection_options ?? null,
            total_expected_cost: t.total_expected_cost ?? null,
            collection_fee_type: t.collection_fee_type ?? null,
            collection_fee_amount: t.collection_fee_amount ?? null,
            collection_route_pricing: t.collection_route_pricing,
            home_phlebotomy_cost: t.home_phlebotomy_cost ?? null,
            price_from: hasStartingPrice(t),
            categoryColor: branding?.primary || "#e70d69",
            is_addon: t.is_addon ?? false,
            lab_ukas_accredited: t.lab_ukas_accredited ?? null,
            lab_cqc_regulated: t.lab_cqc_regulated ?? null,
            lab_iso15189: t.lab_iso15189 ?? null,
            purchase_notes: t.purchase_notes ?? null,
            what_is_tested: t.what_is_tested ?? null,
            preparation_notes: t.preparation_notes ?? null,
            test_limitations: t.test_limitations ?? null,
          };
          // One listing per collection route, so kit and professional-draw
          // prices are never mixed on the same card.
          const variants = deriveCollectionVariants({
            id: String(t.id),
            price: t.price ?? null,
            base_price: t.base_price ?? null,
            sample_type: t.sample_type ?? null,
            collection_method: t.collection_method ?? null,
            home_kit_available: t.home_kit_available ?? null,
            clinic_visit_available: t.clinic_visit_available ?? null,
            total_expected_cost: t.total_expected_cost ?? null,
            collection_fee_type: t.collection_fee_type ?? null,
            collection_fee_amount: t.collection_fee_amount ?? null,
            collection_route_pricing: t.collection_route_pricing,
            home_phlebotomy_cost: t.home_phlebotomy_cost ?? null,
          });
          const single = variants.length === 1 && variants[0].fee <= 0;
          return variants.map((variant) => (
            <UnifiedTestCard
              key={variant.variantId}
              routeVariant={single ? null : variant}
              {...toUnifiedCardProps(card, {
                provider: providerDisplayName,
                rating: rating?.rating,
                reviews: rating?.reviews,
                ctaLabel: t.url ? "View test" : "Compare",
              })}
            />
          ));
        })}
      </div>
    </section>
  );
};

export default ProviderTestsGrid;
