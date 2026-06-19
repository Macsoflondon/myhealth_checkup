import { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useBiomarkersLibrary, BiomarkerDefinition } from "@/hooks/useBiomarkersLibrary";
import { Search, ChevronDown, ChevronUp, FlaskConical, Activity } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const MONTSERRAT = { fontFamily: "Montserrat, sans-serif" } as const;
const DM_SANS = { fontFamily: "'DM Sans', sans-serif" } as const;

function BiomarkerCard({ biomarker }: { biomarker: BiomarkerDefinition }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      onClick={() => setOpen(!open)}
      className="bg-white rounded-2xl border border-[#e2e8f0] p-5 overflow-hidden cursor-pointer transition-all duration-200 hover:border-[#22c0d4] hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className="font-semibold text-[15px] text-[#081129] line-clamp-1"
            style={MONTSERRAT}
          >
            {biomarker.biomarker_name}
          </h3>
          {biomarker.biomarker_code && (
            <span
              className="inline-block bg-[#f0f4fa] text-[#22c0d4] text-[11px] px-2 py-0.5 rounded mt-0.5 font-mono"
              style={MONTSERRAT}
            >
              {biomarker.biomarker_code}
            </span>
          )}
          {biomarker.description && (
            <p
              className="text-[13px] text-[#64748b] line-clamp-2 mt-1"
              style={DM_SANS}
            >
              {biomarker.description}
            </p>
          )}
        </div>
        {open ? (
          <ChevronUp size={18} color="#22c0d4" className="shrink-0" />
        ) : (
          <ChevronDown size={18} color="#22c0d4" className="shrink-0" />
        )}
      </div>

      {open && (
        <div className="border-t border-[#e2e8f0] mt-4 pt-4 space-y-3">
          {biomarker.unit_of_measurement && (
            <div>
              <div
                className="text-[12px] uppercase tracking-wide text-[#081129] font-medium"
                style={MONTSERRAT}
              >
                Unit
              </div>
              <div className="text-[13px] text-[#64748b] mt-0.5" style={DM_SANS}>
                {biomarker.unit_of_measurement}
              </div>
            </div>
          )}

          {(biomarker.normal_range_male || biomarker.normal_range_female) && (
            <div className="grid grid-cols-2 gap-2">
              {biomarker.normal_range_male && (
                <div className="bg-[#f0f4fa] rounded-lg p-3">
                  <div
                    className="text-[11px] uppercase text-[#94a3b8]"
                    style={MONTSERRAT}
                  >
                    Male Range
                  </div>
                  <div className="text-[13px] text-[#081129] mt-0.5" style={DM_SANS}>
                    {biomarker.normal_range_male}
                  </div>
                </div>
              )}
              {biomarker.normal_range_female && (
                <div className="bg-[#f0f4fa] rounded-lg p-3">
                  <div
                    className="text-[11px] uppercase text-[#94a3b8]"
                    style={MONTSERRAT}
                  >
                    Female Range
                  </div>
                  <div className="text-[13px] text-[#081129] mt-0.5" style={DM_SANS}>
                    {biomarker.normal_range_female}
                  </div>
                </div>
              )}
            </div>
          )}

          {biomarker.clinical_significance && (
            <div>
              <div
                className="text-[12px] uppercase tracking-wide text-[#081129] font-medium"
                style={MONTSERRAT}
              >
                Clinical Significance
              </div>
              <p className="text-[13px] text-[#64748b] mt-1" style={DM_SANS}>
                {biomarker.clinical_significance}
              </p>
            </div>
          )}

          {biomarker.related_conditions && biomarker.related_conditions.length > 0 && (
            <div>
              <div
                className="text-[12px] uppercase tracking-wide text-[#081129] font-medium mb-1.5"
                style={MONTSERRAT}
              >
                Related Conditions
              </div>
              <div className="flex flex-wrap gap-1.5">
                {biomarker.related_conditions.map((condition) => (
                  <span
                    key={condition}
                    className="bg-[#f0f4fa] text-[#081129] text-[12px] px-2.5 py-1 rounded-full"
                    style={DM_SANS}
                  >
                    {condition}
                  </span>
                ))}
              </div>
            </div>
          )}

          {biomarker.lifestyle_factors && biomarker.lifestyle_factors.length > 0 && (
            <div>
              <div
                className="text-[12px] uppercase tracking-wide text-[#081129] font-medium mb-1.5"
                style={MONTSERRAT}
              >
                Lifestyle Factors
              </div>
              <div className="flex flex-wrap gap-1.5">
                {biomarker.lifestyle_factors.map((factor) => (
                  <span
                    key={factor}
                    className="bg-[#22c0d4]/10 text-[#22c0d4] text-[12px] px-2.5 py-1 rounded-full"
                    style={DM_SANS}
                  >
                    {factor}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BiomarkerDatabasePage() {
  const { biomarkers, isLoading, error, categories, searchBiomarkers, getBiomarkersByCategory } = useBiomarkersLibrary();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredBiomarkers = useMemo(() => {
    let results: BiomarkerDefinition[];
    if (searchQuery.trim()) {
      results = searchBiomarkers(searchQuery);
    } else if (selectedCategory) {
      results = getBiomarkersByCategory(selectedCategory);
    } else {
      results = biomarkers;
    }
    return results;
  }, [searchQuery, selectedCategory, biomarkers, searchBiomarkers, getBiomarkersByCategory]);

  const groupedByCategory = useMemo(() => {
    const groups: Record<string, BiomarkerDefinition[]> = {};
    filteredBiomarkers.forEach((b) => {
      if (!groups[b.category]) groups[b.category] = [];
      groups[b.category].push(b);
    });
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredBiomarkers]);

  return (
    <>
      <Helmet>
        <title>Biomarker Library | myhealth checkup</title>
        <meta name="description" content="Explore our comprehensive biomarker library. Search by name, code, or category to understand what each blood test marker measures and why it matters." />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/biomarker-database" />
      </Helmet>

      <Header />

      <div className="bg-white min-h-screen">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          {/* Header */}
          <div
            className="text-[12px] uppercase font-medium text-[#22c0d4]"
            style={{ ...MONTSERRAT, letterSpacing: "0.12em" }}
          >
            BIOMARKER LIBRARY
          </div>
          <h1
            className="font-bold text-[#081129] text-[28px] md:text-[40px] mt-2 leading-tight"
            style={MONTSERRAT}
          >
            Understand Your Biomarkers
          </h1>
          <p
            className="text-[16px] text-[#64748b] mt-3 max-w-2xl"
            style={DM_SANS}
          >
            Search and explore blood test markers. Understand what each one measures, normal ranges, and why it matters for your health.
          </p>

          {/* Search */}
          <div className="relative max-w-md mt-6">
            <Search
              size={16}
              color="#94a3b8"
              className="absolute left-4 top-1/2 -translate-y-1/2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) setSelectedCategory(null);
              }}
              placeholder="Search biomarkers by name or code…"
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-[#081129] text-[14px] text-[#081129] placeholder:text-[#94a3b8] outline-none focus:ring-2 focus:ring-[#22c0d4] focus:border-[#22c0d4] bg-white"
              style={DM_SANS}
            />
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => { setSelectedCategory(null); setSearchQuery(""); }}
                className={`rounded-full border border-[#081129] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                  !selectedCategory
                    ? "bg-[#081129] text-white"
                    : "bg-white text-[#081129] hover:bg-[#f0f4fa]"
                }`}
                style={DM_SANS}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setSearchQuery(""); }}
                  className={`rounded-full border border-[#081129] px-4 py-1.5 text-[13px] font-medium transition-colors ${
                    selectedCategory === cat
                      ? "bg-[#081129] text-white"
                      : "bg-white text-[#081129] hover:bg-[#f0f4fa]"
                  }`}
                  style={DM_SANS}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}

          {/* Results */}
          <div className="mt-10">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-[#f0f4fa] animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <Activity size={40} color="#22c0d4" className="mx-auto mb-4" />
                <p className="text-[14px] text-[#64748b]" style={DM_SANS}>
                  Unable to load biomarkers. Please try again later.
                </p>
              </div>
            ) : filteredBiomarkers.length === 0 ? (
              <div className="text-center py-16">
                <FlaskConical size={40} color="#22c0d4" className="mx-auto mb-4" />
                <p className="text-[14px] text-[#64748b]" style={DM_SANS}>
                  No biomarkers found for this search.
                </p>
              </div>
            ) : (
              <>
                {groupedByCategory.map(([category, items]) => (
                  <section key={category} className="mb-10">
                    <div className="flex items-baseline gap-3">
                      <h2
                        className="font-semibold text-[20px] text-[#081129]"
                        style={MONTSERRAT}
                      >
                        {category}
                      </h2>
                      <span
                        className="text-[13px] text-[#22c0d4]"
                        style={DM_SANS}
                      >
                        {items.length} marker{items.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {items.map((biomarker) => (
                        <BiomarkerCard key={biomarker.id} biomarker={biomarker} />
                      ))}
                    </div>
                  </section>
                ))}

                <p
                  className="text-center text-[13px] text-[#94a3b8] mt-8"
                  style={DM_SANS}
                >
                  Showing {filteredBiomarkers.length} biomarker{filteredBiomarkers.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}
