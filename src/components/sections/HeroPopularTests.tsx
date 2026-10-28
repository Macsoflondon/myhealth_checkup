import { useHeroPopularTests } from "@/hooks/queries/useHeroPopularTests";
import {
  UniversalTestCard,
  type UniversalTestData,
} from "@/components/cards/UniversalTestCard";
import { SectionHeading } from "@/components/ui/section-heading";

export function toUniversalTest(
  test: import("@/hooks/queries/useHeroPopularTests").HeroPopularTest,
): UniversalTestData {
  return {
    id: test.id,
    provider_id: test.providerId,
    test_name: test.testName,
    price: test.price,
    total_expected_cost: test.totalExpectedCost,
    collection_fee_type: test.collectionFeeType,
    collection_fee_amount: test.collectionFeeAmount,
    collection_fee_note: test.collectionFeeNote,
    biomarker_count: test.biomarkerCount,
    url: test.url,
    url_verified: test.urlVerified,
    category: test.canonicalCategory,
    turnaround_days_text: test.turnaroundDaysText,
    biomarkers_list: test.biomarkersList,
    image_url: test.imageUrl,
    image_is_stock: test.imageIsStock,
    description: test.description,
    sample_type: test.sampleType,
    collection_method: test.collectionMethod,
    collection_options: test.collectionOptions,
    measurement_type: test.measurementType,
    who_should_test: test.whoShouldTest,
    home_kit_available: test.homeKitAvailable ?? undefined,
    clinic_visit_available: test.clinicVisitAvailable ?? undefined,
    is_addon: test.isAddon ?? undefined,
  };
}

export function HeroPopularTests() {
  const { data: tests, isLoading, error } = useHeroPopularTests();

  if (isLoading) {
    // Same box as the loaded section (heading plus eight cards per grid
    // breakpoint, measured from the live page) so the cards arrive without
    // pushing the rest of the homepage down. This is also the server HTML.
    return (
      <section aria-hidden="true" className="w-full py-6 sm:py-8 bg-white">
        <div className="homepage-section-inner animate-pulse">
          <div className="h-[118px] sm:h-[125px] lg:h-[131px] flex flex-col items-center justify-center gap-3">
            <div className="h-3 w-40 rounded-full bg-slate-200/70" />
            <div className="h-8 w-2/3 max-w-sm rounded-lg bg-slate-200/70" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {Array.from({ length: 8 }, (_, index) => (
              <div
                key={index}
                className="h-[426px] sm:h-[433px] lg:h-[447px] rounded-2xl bg-slate-200/70"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !tests || tests.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-6 sm:py-8 bg-white">
      <div className="homepage-section-inner">
        <div className="text-center mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-9 bg-brand-pink" />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
              Popular this week
            </span>
            <div className="h-px w-6 sm:w-9 bg-brand-pink" />
          </div>
          <SectionHeading
            title="Popular tests"
            gradientText=" this week"
            titleClassName="text-tertiary"
          />
          <p className="text-sm sm:text-base font-semibold text-tertiary mx-auto leading-snug mt-1.5 text-center max-w-2xl">
            Trending private blood tests and health screens chosen by our
            visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tests.slice(0, 8).map((test) => (
            <UniversalTestCard key={test.id} test={toUniversalTest(test)} />
          ))}
        </div>
      </div>
    </section>
  );
}
