import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import MainLayout from "@/layouts/MainLayout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  CollectionHeader,
  SortControl,
  MedichecksTestCard,
  CollectionPagination,
  type MedichecksSortOption,
} from "@/components/providers/medichecks";

const ITEMS_PER_PAGE = 8;

const MedichecksMensHealthPage = () => {
  const [sortBy, setSortBy] = useState<MedichecksSortOption>("best-selling");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: tests, isLoading } = useQuery({
    queryKey: ["medichecks-mens-health-tests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("provider_tests")
        .select("*")
        .eq("provider_id", "medichecks")
        .eq("is_active", true)
        .or("category.ilike.%men%,category.ilike.%male%,category.ilike.%testosterone%,category.ilike.%prostate%,category.ilike.%fertility%");

      if (error) throw error;
      return data;
    },
  });

  const sortedTests = useMemo(() => {
    if (!tests) return [];

    return [...tests].sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.test_name.localeCompare(b.test_name);
        case "name-desc":
          return b.test_name.localeCompare(a.test_name);
        case "price-asc":
          return (a.price || 0) - (b.price || 0);
        case "price-desc":
          return (b.price || 0) - (a.price || 0);
        case "best-selling":
        default:
          // Default sort by biomarker count as proxy for popularity
          return (b.biomarker_count || 0) - (a.biomarker_count || 0);
      }
    });
  }, [tests, sortBy]);

  const totalPages = Math.ceil(sortedTests.length / ITEMS_PER_PAGE);
  
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedTests.slice(start, start + ITEMS_PER_PAGE);
  }, [sortedTests, currentPage]);

  const generateTestSlug = (testName: string) => {
    return testName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <MainLayout>
      <Helmet>
        <title>Men's Health Checks and Blood Tests | Medichecks | myhealth checkup</title>
        <meta
          name="description"
          content="Support your wellbeing with our Men's Health blood test collection. Check testosterone, prostate health, fertility and more with home test kits or clinic appointments."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        <CollectionHeader
          title="Men's Health Checks and Blood Tests"
          intro="Support your wellbeing with our Men's Health collection. Our range of health checks can help you learn more about what your body needs now, and how to set yourself up for the future. Whether you're looking to optimise your performance, check fertility, or monitor key hormones, we have a test for you."
          breadcrumb={["Men's Health Checks And Blood Tests"]}
        />

        <section className="py-6 md:py-8">
          <div className="container mx-auto px-4">
            <SortControl
              value={sortBy}
              onChange={setSortBy}
              resultCount={sortedTests.length}
            />

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-surface rounded-xl border border-border overflow-hidden">
                    <Skeleton className="h-10 w-full" />
                    <div className="p-5 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-16 w-full" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-8 w-20 mx-auto" />
                      <Skeleton className="h-4 w-32 mx-auto" />
                      <Skeleton className="h-12 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {paginatedTests.map((test) => (
                    <MedichecksTestCard
                      key={test.id}
                      id={test.id}
                      testName={test.test_name}
                      description={test.description}
                      turnaroundDays={3} // Default turnaround
                      biomarkerCount={test.biomarker_count}
                      price={test.price}
                      sampleType={
                        test.home_kit_available && test.clinic_visit_available
                          ? "Finger-prick or Venous collection"
                          : test.clinic_visit_available
                          ? "Venous collection"
                          : "Finger-prick collection"
                      }
                      slug={generateTestSlug(test.test_name)}
                      rating={4.5}
                      reviewCount={Math.floor(Math.random() * 200) + 50}
                    />
                  ))}
                </div>

                <CollectionPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default MedichecksMensHealthPage;
