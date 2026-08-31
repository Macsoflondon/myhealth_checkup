import { useHeroPopularTests } from "@/hooks/queries/useHeroPopularTests";
import {
  UniversalTestCard,
  type UniversalTestData,
} from "@/components/cards/UniversalTestCard";
import { SectionSkeleton } from "@/components/common/SectionSkeleton";
import { SectionHeading } from "@/components/ui/section-heading";

function toUniversalTest(
  test: import("@/hooks/queries/useHeroPopularTests").HeroPopularTest,
): UniversalTestData {
  return {
    id: test.id,
    provider_id: test.providerId,
    test_name: test.testName,
    total_expected_cost: test.totalExpectedCost,
    biomarker_count: test.biomarkerCount,
    url: test.url,
    category: test.canonicalCategory,
    turnaround_days_text: test.turnaroundDaysText,
    biomarkers_list: test.biomarkersList,
    image_url: test.imageUrl,
    image_is_stock: test.imageIsStock,
  };
}

export function HeroPopularTests() {
  const { data: tests, isLoading, error } = useHeroPopularTests();

  if (isLoading) {
    return (
      <section className="w-full py-10 sm:py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionSkeleton tone="white" cards={4} minHeight={320} />
        </div>
      </section>
    );
  }

  if (error || !tests || tests.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 sm:py-14 bg-white">
      <div className="container mx-auto px-4">
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
