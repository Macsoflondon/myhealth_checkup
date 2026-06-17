import ComparisonSectionHeading from "./ComparisonSectionHeading";
import { ProviderComparisonTable as FullProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";
import { Button } from "@/components/ui/button";
import { compareStore, useCompareItems } from "@/stores/compareStore";

const ProviderComparisonTable = () => {
  const { data: tests = [] } = useRecommendedTests("general-health", 5);
  const selected = useCompareItems();
  const display = selected;

  return (
    <section className="bg-[#f5f8fc] py-14 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <ComparisonSectionHeading />
        <div className="mt-10">
          <FullProviderComparisonTable tests={display} />
        </div>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={() => compareStore.clear()}
            disabled={selected.length === 0}
            className="inline-block rounded-full px-5 py-2.5 text-[13px] font-semibold text-white font-['Montserrat'] transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60"
            style={{
              background: selected.length === 0 ? "#cbd5e1" : "#e70d69",
            }}
            onMouseEnter={(e) => {
              if (selected.length > 0) e.currentTarget.style.background = "#c40a5a";
            }}
            onMouseLeave={(e) => {
              if (selected.length > 0) e.currentTarget.style.background = "#e70d69";
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProviderComparisonTable;
