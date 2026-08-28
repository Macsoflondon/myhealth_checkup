import { useClinicTests, type ClinicTest } from "@/hooks/useClinicTests";
import { UniversalTestCard, type UniversalTestData } from "@/components/cards/UniversalTestCard";
import { SectionSkeleton } from "@/components/common/SectionSkeleton";
import { getProviderMeta } from "@/constants/providerMeta";

function toUniversalTest(test: ClinicTest): UniversalTestData {
  return {
    id: test.id,
    provider_id: test.provider_id,
    test_name: test.test_name,
    description: test.description,
    price: test.price,
    category: test.category,
    url: test.url,
    image_url: test.image_url,
    image_is_stock: test.image_is_stock,
  };
}

export interface ClinicTestsSectionProps {
  providerId: string;
  limit?: number;
}

export function ClinicTestsSection({ providerId, limit = 8 }: ClinicTestsSectionProps) {
  const { data: tests, isLoading, error } = useClinicTests(providerId);
  const meta = getProviderMeta(providerId);

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

  const visibleTests = limit ? tests.slice(0, limit) : tests;

  return (
    <section className="w-full py-10 sm:py-14 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="font-[Montserrat] font-bold text-2xl sm:text-3xl text-[#081129] tracking-tight">
            Tests available from {meta.displayName}
          </h2>
          <p className="mt-2 text-sm sm:text-base text-[#64748b] max-w-2xl">
            Browse and compare {meta.displayName} tests with transparent pricing and accreditation details.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {visibleTests.map((test) => (
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
