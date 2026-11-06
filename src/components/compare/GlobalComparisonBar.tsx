import { lazy, Suspense } from "react";
import { useNavigate } from "@/lib/router-compat";
import { compareResultsPath } from "@/lib/compareUrl";
import { compareStore, useCompareItems } from "@/stores/compareStore";

// The tray only appears once a test is selected, so its code stays out of the
// first-paint bundle until then.
const ComparisonBar = lazy(() =>
  import("@/components/compare/ComparisonBar").then((m) => ({ default: m.ComparisonBar })),
);

/**
 * Mounts the comparison tray once for the whole app so it is present on every
 * page that can accept a test selection, not only routes using MainLayout.
 */
export const GlobalComparisonBar = () => {
  const compareItems = useCompareItems();
  const navigate = useNavigate();
  if (compareItems.length === 0) return null;

  return (
    <Suspense fallback={null}>
      <ComparisonBar
        selectedTests={compareItems}
        onRemoveTest={(id) => compareStore.remove(id)}
        onCompare={() => navigate(compareResultsPath(compareItems.map((t) => t.id)))}
        onClearAll={() => compareStore.clear()}
      />
    </Suspense>
  );
};
