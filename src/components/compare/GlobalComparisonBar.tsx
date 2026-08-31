import { useNavigate } from "@/lib/router-compat";
import { ComparisonBar } from "@/components/compare/ComparisonBar";
import { compareResultsPath } from "@/lib/compareUrl";
import { compareStore, useCompareItems } from "@/stores/compareStore";

/**
 * Mounts the comparison tray once for the whole app so it is present on every
 * page that can accept a test selection, not only routes using MainLayout.
 */
export const GlobalComparisonBar = () => {
  const compareItems = useCompareItems();
  const navigate = useNavigate();

  return (
    <ComparisonBar
      selectedTests={compareItems}
      onRemoveTest={(id) => compareStore.remove(id)}
      onCompare={() => navigate(compareResultsPath(compareItems.map((t) => t.id)))}
      onClearAll={() => compareStore.clear()}
    />
  );
};
