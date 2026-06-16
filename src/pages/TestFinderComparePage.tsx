import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { RefreshCw, ChevronLeft } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ComparisonTable } from "@/components/testFinder/ComparisonTable";
import { FiltersPanel } from "@/components/testFinder/FiltersPanel";
import { useTestFinder, testFinderStore } from "@/stores/testFinderStore";
import { TEST_CATALOGUE } from "@/lib/testFinder/catalogue";
import { applyFilters } from "@/lib/testFinder/filters";

const TestFinderComparePage = () => {
  const navigate = useNavigate();
  const filters = useTestFinder((s) => s.filters);
  const quizFilters = useTestFinder((s) => s.quizFilters);
  const selectedIds = useTestFinder((s) => s.selectedTestIds);
  const recs = useTestFinder((s) => s.recommendations);

  const pool = recs.length > 0 ? recs : TEST_CATALOGUE;
  const filtered = useMemo(() => applyFilters(pool, filters), [pool, filters]);
  const selectedTests = useMemo(
    () => filtered.filter((t) => selectedIds.includes(t.id)),
    [filtered, selectedIds],
  );

  return (
    <>
      <Helmet>
        <title>Compare Tests | myhealth checkup</title>
        <meta
          name="description"
          content="Compare private health tests side by side on price, biomarkers, sample type, collection and clinical review."
        />
        <link rel="canonical" href="https://www.myhealthcheckup.co.uk/find-test/compare" />
      </Helmet>
      <div className="min-h-screen bg-[#081129] text-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
            <div>
              <button
                onClick={() => navigate("/find-test/recommendations")}
                className="text-xs text-white/60 hover:text-white flex items-center gap-1 mb-1"
              >
                <ChevronLeft className="w-3 h-3" /> Back to recommendations
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold">Compare tests</h1>
            </div>
            <button
              onClick={() => navigate("/find-test")}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white border border-white/15 px-4 py-2 rounded-full self-start"
            >
              <RefreshCw className="w-4 h-4" /> Restart quiz
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <aside>
              <FiltersPanel
                filters={filters}
                quizFilters={quizFilters}
                onChange={(f) => testFinderStore.setFilters(f)}
                onClear={() => testFinderStore.clearFilters()}
                onResetToQuiz={() => testFinderStore.resetFiltersToQuiz()}
              />
            </aside>
            <div className="space-y-4">
              {selectedTests.length === 0 && (
                <div className="bg-[#0F2238] border border-white/10 rounded-xl p-4 text-sm text-white/70">
                  Showing all {filtered.length} matching tests. Tick tests on the recommendations
                  page to narrow this to a side-by-side comparison.
                </div>
              )}
              <ComparisonTable
                tests={selectedTests.length > 0 ? selectedTests : filtered.slice(0, 4)}
              />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default TestFinderComparePage;
