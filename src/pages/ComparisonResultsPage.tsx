import { Helmet } from "react-helmet-async";
import { useNavigate } from "@/lib/router-compat";
import MainLayout from "@/layouts/MainLayout";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { ProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import ComparisonSectionHeading from "@/components/sections/ComparisonSectionHeading";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { compareStore } from "@/stores/compareStore";
import { useCompareUrlSync } from "@/hooks/useCompareUrlSync";

const ComparisonResultsPage = () => {
  const { selected, isHydrating, missingIds } = useCompareUrlSync();
  const navigate = useNavigate();


  return (
    <ErrorBoundary>
      <Helmet>
        <title>Your test comparison | myhealth checkup</title>
        <meta
          name="description"
          content="Compare your selected private blood tests side by side: price, biomarkers, sample type, collection method, fees and clinical review."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/compare/results" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>

      <MainLayout mainClassName="flex-1 bg-[#f5f8fc]">
        <section className="py-12 sm:py-16 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-12">
            <ComparisonSectionHeading />

            {isHydrating ? (
              <div className="mt-8 space-y-3">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-2xl" />
              </div>
            ) : selected.length === 0 ? (
              <div className="mx-auto mt-8 max-w-xl rounded-2xl border border-dashed border-brand-navy/25 bg-white p-10 text-center">
                <h2 className="font-heading text-lg font-bold text-brand-navy">
                  No tests selected yet
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add up to five tests from any category or comparison page, then return here to
                  see the full side-by-side breakdown.
                </p>
                <Button
                  className="mt-6 bg-brand-navy text-white hover:bg-brand-navy/90"
                  onClick={() => navigate("/compare")}
                >
                  Browse tests to compare
                </Button>
              </div>
            ) : (
              <>
                {missingIds.length > 0 && (
                  <p className="mx-auto mt-6 max-w-2xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-center text-sm text-amber-900">
                    {missingIds.length === 1
                      ? "One test from this link is no longer listed and has been left out."
                      : `${missingIds.length} tests from this link are no longer listed and have been left out.`}
                  </p>
                )}

                <div className="mt-8">
                  <ProviderComparisonTable tests={selected} />
                </div>


                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/compare")}
                    className="rounded-full px-8"
                  >
                    Add more tests
                  </Button>
                  <Button
                    onClick={() => compareStore.clear()}
                    className="rounded-full bg-brand-turquoise px-8 text-white hover:bg-brand-pink"
                  >
                    Clear selection
                  </Button>
                </div>

                <p className="mt-8 text-center text-xs text-muted-foreground">
                  Prices, turnaround times and inclusions are taken from provider listings and can
                  change. Turnaround times are typical, not guaranteed. myhealth checkup does not
                  provide medical care or diagnoses.
                </p>
              </>
            )}
          </div>
        </section>
      </MainLayout>
    </ErrorBoundary>
  );
};

export default ComparisonResultsPage;
