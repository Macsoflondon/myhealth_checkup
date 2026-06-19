import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { useAtHomeTests, useAtHomeCategories, type AtHomeTest } from "@/hooks/queries/useAtHomeTests";
import {
  UniversalTestCard,
  UniversalTestDetailModal,
  UTC_NAVY as NAVY,
  UTC_TURQUOISE as TURQUOISE,
  UTC_TINT as TINT,
} from "@/components/cards/UniversalTestCard";
import { fromAtHomeTest } from "@/lib/universalTestAdapter";
import {
  Search, Home, Clock, Shield, FlaskConical, Package, ChevronDown,
} from "lucide-react";

// ─── Page ────────────────────────────────────────────────────────────────────



const ITEMS_PER_PAGE = 18;

const AtHomeTestsPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTest, setSelectedTest] = useState<AtHomeTest | null>(null);
  const [page, setPage] = useState(1);

  const { data: tests = [], isLoading, isError } = useAtHomeTests(activeCategory, search);
  const { data: categories = ["All"] } = useAtHomeCategories();

  const paginated = useMemo(() => tests.slice(0, page * ITEMS_PER_PAGE), [tests, page]);
  const hasMore = tests.length > page * ITEMS_PER_PAGE;

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <MainLayout>
      <Helmet>
        <title>At-Home Health Tests | myhealth checkup</title>
        <meta name="description" content="Compare at-home health testing kits from the UK's most trusted providers. Finger-prick blood tests, delivered to your door, analysed in accredited labs." />
        <meta name="keywords" content="at home blood test, home testing kit, finger prick test, health test at home, private blood test UK" />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/at-home-tests" />
      </Helmet>

      <div style={{ background: "#fff", minHeight: "100vh" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">

          {/* Page header */}
          <div className="mb-8">
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.12em", color: TURQUOISE, marginBottom: 8 }}>AT-HOME TESTING</div>
            <h1 style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: "clamp(26px,4vw,40px)", color: NAVY, marginBottom: 10 }}>At-Home Health Tests</h1>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 16, color: "#64748b", maxWidth: 600, lineHeight: 1.6 }}>
              Compare at-home testing kits from the UK's most trusted providers. Analysed in accredited labs. Results delivered securely online.
            </p>

            {/* Trust strip */}
            <div className="flex flex-wrap gap-4 mt-4">
              {[
                { icon: <Package size={14} color={TURQUOISE} />, label: `${tests.length > 0 ? `${tests.length}+` : "300+"} tests available` },
                { icon: <Home size={14} color={TURQUOISE} />, label: "Delivered to your door" },
                { icon: <Shield size={14} color={TURQUOISE} />, label: "UKAS accredited labs" },
                { icon: <Clock size={14} color={TURQUOISE} />, label: "Fast results online" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-1.5" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#64748b" }}>
                  {s.icon}{s.label}
                </div>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md mb-5">
            <Search size={16} color="#94a3b8" className="absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={handleSearchChange}
              placeholder="Search by test name or biomarker…"
              className="w-full pl-10 pr-4 py-3 rounded-full"
              style={{ border: `1.5px solid ${NAVY}`, fontFamily: "'DM Sans',sans-serif", fontSize: 14, outline: "none", color: NAVY }}
              onFocus={(e) => (e.currentTarget.style.borderColor = TURQUOISE)}
              onBlur={(e) => (e.currentTarget.style.borderColor = NAVY)}
            />
          </div>

          {/* Category dropdown */}
          <div className="relative mb-8" style={{ maxWidth: 280 }}>
            <select
              value={activeCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full appearance-none pl-4 pr-10 py-3 rounded-full cursor-pointer"
              style={{
                border: `1.5px solid ${NAVY}`,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 14,
                outline: "none",
                color: NAVY,
                background: "#fff",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = TURQUOISE)}
              onBlur={(e) => (e.currentTarget.style.borderColor = NAVY)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown
              size={16}
              color={NAVY}
              className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />
          </div>


          {/* Results count */}
          {!isLoading && (
            <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#94a3b8", marginBottom: 20 }}>
              {tests.length} test{tests.length !== 1 ? "s" : ""} found
              {activeCategory !== "All" ? ` in ${activeCategory}` : ""}
              {search ? ` matching "${search}"` : ""}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-2xl animate-pulse" style={{ height: 280, background: TINT }} />
              ))}
            </div>
          )}

          {/* Error */}
          {isError && (
            <div className="text-center py-16" style={{ fontFamily: "'DM Sans',sans-serif", color: "#64748b" }}>
              <FlaskConical size={40} color={TURQUOISE} className="mx-auto mb-3" />
              <p>Unable to load tests. Please try again.</p>
            </div>
          )}

          {/* Empty */}
          {!isLoading && !isError && tests.length === 0 && (
            <div className="text-center py-16" style={{ fontFamily: "'DM Sans',sans-serif", color: "#64748b" }}>
              <Search size={40} color={TURQUOISE} className="mx-auto mb-3" />
              <p>No tests found. Try a different search or category.</p>
            </div>
          )}

          {/* Grid */}
          {!isLoading && !isError && paginated.length > 0 && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {paginated.map((test) => (
                  <UniversalTestCard key={test.id} test={fromAtHomeTest(test)} onOpenDetail={() => setSelectedTest(test)} />
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-10">
                  <button
                    onClick={() => setPage((p) => p + 1)}
                    style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 14, color: NAVY, padding: "10px 32px", borderRadius: 24, border: `1.5px solid ${NAVY}`, background: "#fff", cursor: "pointer" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = TINT)}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
                  >
                    Load more tests ({tests.length - page * ITEMS_PER_PAGE} remaining)
                  </button>
                </div>
              )}
            </>
          )}

        </div>
      </div>

      {/* Info Sheet Modal */}
      {selectedTest && (
        <UniversalTestDetailModal test={fromAtHomeTest(selectedTest)} onClose={() => setSelectedTest(null)} />
      )}
    </MainLayout>
  );
};

export default AtHomeTestsPage;
