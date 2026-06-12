import React, { useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { ProviderComparisonTable } from "@/components/compare/ProviderComparisonTable";
import type { CompareTestData } from "@/services/CompareService";
import { Loader2, Search, Clock, Check } from "lucide-react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import {
  useCompareTestsData,
  defaultFilters,
} from "@/hooks/queries/useCompareTestsData";
import { getCategoryDisplayName } from "@/utils/categoryTaglines";

interface TestSelectCardProps {
  test: CompareTestData;
  selected: boolean;
  onToggle: (test: CompareTestData) => void;
}

const TestSelectCard: React.FC<TestSelectCardProps> = ({ test, selected, onToggle }) => {
  return (
    <button
      type="button"
      onClick={() => onToggle(test)}
      className={`group relative text-left rounded-2xl p-4 transition-all bg-white ${
        selected
          ? "border-2 border-[#e70d69] bg-[#fff5f9] shadow-sm"
          : "border border-[#e2e8f0] hover:border-[#22c0d4] hover:shadow-md"
      }`}
    >
      {selected && (
        <span className="absolute top-2 right-2 h-6 w-6 rounded-full bg-[#e70d69] text-white flex items-center justify-center">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
      <div className="flex items-center gap-2 mb-3">
        {test.providerLogo ? (
          <img
            src={test.providerLogo}
            alt={test.provider}
            className="h-8 w-8 rounded object-contain bg-white border border-[#e2e8f0]"
          />
        ) : (
          <div className="h-8 w-8 rounded bg-[#f1f5f9]" />
        )}
        <span className="font-montserrat font-semibold text-[13px] text-[#22c0d4] truncate">
          {test.provider}
        </span>
      </div>
      <h3 className="font-[DM_Sans] text-[14px] text-[#081129] line-clamp-2 mb-2 min-h-[40px]">
        {test.name}
      </h3>
      <div className="font-montserrat font-bold text-[18px] text-[#e70d69] mb-2">
        £{Number(test.price ?? 0).toFixed(0)}
      </div>
      <div className="flex items-center justify-between text-[12px] text-muted-foreground font-[DM_Sans]">
        <span>{test.biomarkerCount ?? 0} biomarkers</span>
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {test.features?.turnaround || `${test.turnaroundDays ?? "2-3"}d`}
        </span>
      </div>
    </button>
  );
};

const CompareTests = () => {
  const [filters, setFilters] = useState({ ...defaultFilters });
  const [selectedTests, setSelectedTests] = useState<CompareTestData[]>([]);

  const { tests, isLoading, urlCategory } = useCompareTestsData(filters);
  const effectiveCategory = filters.selectedCategory || urlCategory || "general-health";

  React.useEffect(() => {
    if (urlCategory && !filters.selectedCategory) {
      setFilters((prev) => ({ ...prev, selectedCategory: urlCategory }));
    }
  }, [urlCategory]);

  const toggleSelect = useCallback((test: CompareTestData) => {
    setSelectedTests((prev) =>
      prev.some((t) => t.id === test.id)
        ? prev.filter((t) => t.id !== test.id)
        : [...prev, test]
    );
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedTests.some((t) => t.id === id),
    [selectedTests]
  );

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-background">
        <Helmet>
          <title>Compare Blood Tests | myhealth checkup</title>
          <meta
            name="description"
            content="Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers. Transparent pricing and inclusions from trusted UK providers."
          />
          <link rel="canonical" href="https://www.myhealthcheckup.co.uk/compare" />
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Compare Blood Tests",
            "description": "Compare private blood tests from Medichecks, Thriva, Randox, and more UK providers.",
            "url": "https://www.myhealthcheckup.co.uk/compare",
            "isPartOf": { "@type": "WebSite", "name": "myhealth checkup", "url": "https://www.myhealthcheckup.co.uk" },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.myhealthcheckup.co.uk" },
                { "@type": "ListItem", "position": 2, "name": "Compare Tests" }
              ]
            }
          })}</script>
          <script type="application/ld+json">{JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              { "@type": "Question", "name": "How do I compare private blood tests in the UK?", "acceptedAnswer": { "@type": "Answer", "text": "Use myhealth checkup to compare price, biomarker coverage, sample method, and typical turnaround across UKAS-accredited providers including Medichecks, Thriva, Randox and more." } },
              { "@type": "Question", "name": "Are the labs UKAS accredited?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. We only list providers whose laboratories hold UKAS accreditation (ISO 15189 where applicable) and whose clinics are CQC regulated." } },
              { "@type": "Question", "name": "Do I need a GP referral to book a private blood test?", "acceptedAnswer": { "@type": "Answer", "text": "No GP referral is required for the tests listed on myhealth checkup." } },
              { "@type": "Question", "name": "How long do results take?", "acceptedAnswer": { "@type": "Answer", "text": "Typical turnaround is 2–5 working days from sample receipt for most blood tests." } },
              { "@type": "Question", "name": "Is myhealth checkup free to use?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The comparison platform is free for users." } }
            ]
          })}</script>
        </Helmet>

        <MainLayout>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#081129] font-montserrat mb-6 text-center">
              {effectiveCategory && effectiveCategory !== "all"
                ? `Compare ${getCategoryDisplayName(effectiveCategory)}`
                : "Compare Private Blood Tests"}
            </h1>

            {/* Search */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-[#081129]/60"
                />
                <input
                  type="text"
                  value={filters.searchQuery}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
                  }
                  placeholder="Search for a test, biomarker or health concern…"
                  className="w-full h-12 rounded-full border border-[#081129] bg-white pl-12 pr-5 text-[15px] text-[#081129] placeholder:text-[#081129]/50 focus:outline-none focus:ring-2 focus:ring-[#22c0d4] focus:border-[#22c0d4] transition"
                />
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-[#22c0d4]" />
              </div>
            ) : tests.length === 0 ? (
              <p className="text-center text-muted-foreground py-16">
                No tests found. Try a different search term.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {tests.map((test) => (
                  <TestSelectCard
                    key={test.id}
                    test={test}
                    selected={isSelected(test.id)}
                    onToggle={toggleSelect}
                  />
                ))}
              </div>
            )}

            {/* Comparison Table */}
            {selectedTests.length > 0 && (
              <>
                <div className="my-8 h-px w-full bg-[#22c0d4]" />
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <p className="text-sm text-muted-foreground font-[DM_Sans]">
                    Comparing {selectedTests.length} test
                    {selectedTests.length > 1 ? "s" : ""} — select more cards above to add them
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedTests([])}
                    className="text-sm text-[#e70d69] hover:underline font-[DM_Sans]"
                  >
                    Clear selection
                  </button>
                </div>
                <ProviderComparisonTable tests={selectedTests} />
              </>
            )}
          </div>
        </MainLayout>
      </div>
    </ErrorBoundary>
  );
};

export default CompareTests;
