import { X } from "lucide-react";
import ComparisonSectionHeading from "./ComparisonSectionHeading";
import { ProviderComparisonTable as FullProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import { useRecommendedTests } from "@/hooks/queries/useRecommendedTests";
import { Button } from "@/components/ui/button";
import { compareStore, useCompareItems } from "@/stores/compareStore";

const ProviderComparisonTable = () => {
  const { data: tests = [] } = useRecommendedTests("general-health", 5);
  const selected = useCompareItems();
  const display = selected.length > 0 ? selected : tests.slice(0, 5);

  return (
    <section className="bg-[#f5f8fc] py-14 sm:py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <ComparisonSectionHeading />
        <div className="mt-10">
          <FullProviderComparisonTable tests={display} />
        </div>
        <div className="flex justify-end mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => compareStore.clear()}
            disabled={selected.length === 0}
            className="font-['DM_Sans'] gap-1.5 border-destructive text-destructive hover:bg-destructive/10"
          >
            <X size={14} />
            Clear
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProviderComparisonTable;
