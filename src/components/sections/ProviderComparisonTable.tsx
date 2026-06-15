import ComparisonSectionHeading from "./ComparisonSectionHeading";
import { ProviderComparisonTable as FullProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";

const ProviderComparisonTable = () => {
  const { data: tests = [] } = useRecommendedTests("general-health", 5);

  return (
    <section className="bg-[#f5f8fc] py-14 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <ComparisonSectionHeading />
        <div className="mt-10">
          <FullProviderComparisonTable tests={tests.slice(0, 5)} />
        </div>
      </div>
    </section>
  );
};

export default ProviderComparisonTable;
