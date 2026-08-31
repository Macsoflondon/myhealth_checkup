import { useHeroPopularTests } from "@/hooks/queries/useHeroPopularTests";
import { UniversalTestCard, type UniversalTestData } from "@/components/cards/UniversalTestCard";
import { SectionSkeleton } from "@/components/common/SectionSkeleton";

function toUniversalTest(test: import("@/hooks/queries/useHeroPopularTests").HeroPopularTest): UniversalTestData {
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
        <div className="mb-8 text-center">
          <h2 className="font-[Montserrat] font-bold text-2xl sm:text-3xl text-[#081129] tracking-tight">
            Popular tests this week
          </h2>
          <p className="mt-2 text-sm sm:text-base text-brand-navy max-w-2xl mx-auto">
            Trending private blood tests and health screens chosen by our visitors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tests.slice(0, 8).map((test) => (
            <UniversalTestCard
              key={test.id}
              test={toUniversalTest(test)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
