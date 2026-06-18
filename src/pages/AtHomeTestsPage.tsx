import React, { useState, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import MainLayout from "@/layouts/MainLayout";
import { useAtHomeTests, useAtHomeCategories, type AtHomeTest } from "@/hooks/queries/useAtHomeTests";
import { getProviderMeta } from "@/constants/providerMeta";
import { getProviderLogo } from "@/constants/providers";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import type { CompareTestData } from "@/types";
import {
  Search, Home, Clock, Shield,
  CheckCircle, X, ExternalLink, FlaskConical, Package, Plus
} from "lucide-react";

const NAVY = "#081129";
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const TINT = "#f0f4fa";

// Additional collection cost options (shown for at-home kits with optional blood draw paths)
const COLLECTION_ADDONS: { label: string; price: number }[] = [
  { label: "At Home Phlebotomist", price: 80 },
  { label: "In Clinic Blood Draw", price: 35 },
  { label: "Third-party blood draw (e.g. Royal Mail kit)", price: 3.99 },
];

function toCompareTestData(test: AtHomeTest): CompareTestData {
  const meta = getProviderMeta(test.provider_id);
  const logo = getProviderLogo(test.provider_id) || meta.logo || "";
  return {
    id: test.id,
    name: test.test_name,
    provider: meta.displayName,
    price: test.price ?? 0,
    category: test.category || "",
    description: test.description || "",
    available: true,
    features: {
      turnaround: test.turnaround_days_text || "",
      collection: "At-home kit",
      bioMarkers: test.biomarker_count ? String(test.biomarker_count) : undefined,
    },
    providerLogo: logo,
    biomarkerCount: test.biomarker_count ?? undefined,
    url: test.url || undefined,
  };
}

// ─── Test Info Sheet Modal ───────────────────────────────────────────────────

const TestInfoSheet: React.FC<{ test: AtHomeTest; onClose: () => void }> = ({ test, onClose }) => {
  const meta = getProviderMeta(test.provider_id);
  const logo = getProviderLogo(test.provider_id) || meta.logo;
  const biomarkers = (test.biomarkers_list || []).map((b) => b.value);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(8,17,41,0.7)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white"
        style={{ boxShadow: "0 24px 60px rgba(8,17,41,0.3)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ background: NAVY, borderRadius: "16px 16px 0 0", padding: "24px" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="rounded-lg flex-shrink-0" style={{ background: "#fff", width: 44, height: 44, padding: 6 }}>
                  <img src={logo} alt={meta.displayName} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, color: TURQUOISE }}>{meta.displayName}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", lineHeight: 1.2 }}>{test.test_name}</div>
              </div>
            </div>
            <button onClick={onClose} className="flex-shrink-0 rounded-full p-1.5 hover:bg-white/10 transition-colors">
              <X size={20} color="#fff" />
            </button>
          </div>
          {/* Price + key stats */}
          <div className="flex flex-wrap gap-4 mt-4">
            <div>
              <div style={{ color: PINK, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 28 }}>
                {test.price != null ? `£${Number(test.price).toFixed(2)}` : "POA"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>At-home kit</div>
            </div>
            {test.turnaround_days_text && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} color={TURQUOISE} />
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{test.turnaround_days_text}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Turnaround</div>
                </div>
              </div>
            )}
            {test.biomarker_count != null && test.biomarker_count > 0 && (
              <div className="flex items-center gap-1.5">
                <FlaskConical size={14} color={TURQUOISE} />
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{test.biomarker_count} {test.category === "Allergy" ? "allergies tested" : "biomarkers"}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{test.category === "Allergy" ? "Allergens" : "Measured"}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Home size={14} color={TURQUOISE} />
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>At-home kit</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Collection</div>
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Additional collection options */}
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: NAVY, marginBottom: 8 }}>Additional Collection Options</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#64748b", marginBottom: 10 }}>
              Base price covers the at-home finger-prick kit. Optional collection methods are available at additional cost:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {COLLECTION_ADDONS.map((a) => (
                <div key={a.label} className="flex items-center justify-between" style={{ background: TINT, borderRadius: 8, padding: "8px 12px" }}>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: NAVY }}>{a.label}</span>
                  <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: PINK }}>
                    +£{a.price.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>


          {/* Description */}
          {test.description && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: NAVY, marginBottom: 8 }}>About This Test</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{test.description}</p>
            </div>
          )}

          {/* Who should test */}
          {test.who_should_test && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: NAVY, marginBottom: 8 }}>Who Should Test</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{test.who_should_test}</p>
            </div>
          )}

          {/* Biomarkers */}
          {biomarkers.length > 0 && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: NAVY, marginBottom: 8 }}>
                Biomarkers Tested ({biomarkers.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {biomarkers.map((b, i) => (
                  <span key={i} style={{ background: TINT, color: NAVY, fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{b}</span>
                ))}
              </div>
            </div>
          )}

          {/* Symptoms */}
          {(test.symptoms || []).length > 0 && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: NAVY, marginBottom: 8 }}>Related Symptoms</div>
              <div className="flex flex-wrap gap-2">
                {(test.symptoms || []).map((s, i) => (
                  <span key={i} style={{ background: "#fff5f9", color: PINK, border: `1px solid ${PINK}30`, fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          {/* Accreditations */}
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: NAVY, marginBottom: 8 }}>Standards & Accreditation</div>
            <div className="flex flex-wrap gap-3">
              {meta.ukas && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} color={TURQUOISE} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#475569" }}>UKAS accredited lab</span>
                </div>
              )}
              {meta.cqc && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} color={TURQUOISE} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#475569" }}>CQC regulated</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} color={TURQUOISE} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#475569" }}>At-home collection</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} color={TURQUOISE} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#475569" }}>GDPR compliant</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div style={{ background: TINT, borderLeft: `3px solid ${TURQUOISE}`, borderRadius: 6, padding: "12px 14px" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#64748b", margin: 0 }}>
              myhealth checkup is an independent comparison platform. We do not provide medical advice. Always confirm test details, pricing, and availability directly with the provider before booking.
            </p>
          </div>

          {/* CTA */}
          {test.url && test.url !== "#" && (
            <a
              href={test.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full rounded-full"
              style={{ background: PINK, color: "#fff", fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 24px", textDecoration: "none" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c40a5a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = PINK)}
            >
              Book with {meta.displayName}
              <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Test Card ───────────────────────────────────────────────────────────────

const AtHomeTestCard: React.FC<{ test: AtHomeTest; onClick: () => void }> = ({ test, onClick }) => {
  const meta = getProviderMeta(test.provider_id);
  const logo = getProviderLogo(test.provider_id) || meta.logo;
  const biomarkers = (test.biomarkers_list || []).map((b) => b.value);
  const compareItems = useCompareItems();
  const inCompare = compareItems.some((c) => c.id === test.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    compareStore.toggle(toCompareTestData(test));
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (test.url && test.url !== "#") {
      window.open(test.url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl bg-white"
      style={{ border: "1px solid #e2e8f0", transition: "all 200ms", overflow: "hidden" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = TURQUOISE;
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(34,192,212,0.12)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {/* Provider colour bar */}
      <div style={{ height: 4, background: meta.color || TURQUOISE }} />

      <div style={{ padding: "16px" }}>
        {/* Provider row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {logo ? (
              <div style={{ width: 28, height: 28, background: "#f8fafc", borderRadius: 6, padding: 3, flexShrink: 0 }}>
                <img src={logo} alt={meta.displayName} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
              </div>
            ) : null}
            <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 12, color: TURQUOISE }}>{meta.displayName}</span>
          </div>
          {test.is_popular && (
            <span style={{ background: "#fff5f9", color: PINK, border: `1px solid ${PINK}30`, fontFamily: "'Montserrat',sans-serif", fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.06em" }}>Popular</span>
          )}
        </div>

        {/* Test name */}
        <div className="line-clamp-2 mb-1" style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, color: NAVY, lineHeight: 1.3 }}>{test.test_name}</div>

        {/* Category */}
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>{test.category}</div>

        {/* Description */}
        {test.description && (
          <p className="line-clamp-2" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#64748b", marginBottom: 10, lineHeight: 1.5 }}>{test.description}</p>
        )}

        {/* Biomarker chips — first 3 */}
        {biomarkers.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {biomarkers.slice(0, 3).map((b, i) => (
              <span key={i} style={{ background: TINT, color: NAVY, fontFamily: "'DM Sans',sans-serif", fontSize: 11, padding: "2px 8px", borderRadius: 12 }}>{b}</span>
            ))}
            {biomarkers.length > 3 && (
              <span style={{ background: TINT, color: "#94a3b8", fontFamily: "'DM Sans',sans-serif", fontSize: 11, padding: "2px 8px", borderRadius: 12 }}>+{biomarkers.length - 3} more</span>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="flex items-center gap-3 mb-3" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#64748b" }}>
          {test.biomarker_count != null && test.biomarker_count > 0 && (
            <span className="flex items-center gap-1"><FlaskConical size={12} color={TURQUOISE} />{test.biomarker_count} {test.category === "Allergy" ? "allergies tested" : "biomarkers"}</span>
          )}
          {test.turnaround_days_text && (
            <span className="flex items-center gap-1"><Clock size={12} color={TURQUOISE} />{test.turnaround_days_text}</span>
          )}
          <span className="flex items-center gap-1"><Home size={12} color={TURQUOISE} />At-home kit</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-3 mb-3" style={{ borderTop: "1px solid #f1f5f9" }}>
          <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 20, color: PINK }}>
            {test.price != null ? `£${Number(test.price).toFixed(2)}` : "POA"}
          </div>
          <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#94a3b8" }}>Base at-home kit</span>
        </div>

        {/* Footer: Compare + Book buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCompare}
            style={{
              background: inCompare ? TURQUOISE : "#fff",
              color: inCompare ? "#fff" : NAVY,
              fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 12,
              padding: "10px 12px", borderRadius: 20,
              border: `1.5px solid ${inCompare ? TURQUOISE : NAVY}`,
              cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 150ms",
            }}
          >
            {inCompare ? <CheckCircle size={14} /> : <Plus size={14} />}
            {inCompare ? "Added" : "Compare"}
          </button>
          <button
            onClick={handleBook}
            disabled={!test.url || test.url === "#"}
            style={{
              background: PINK, color: "#fff",
              fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 12,
              padding: "10px 12px", borderRadius: 20, border: "none",
              cursor: test.url && test.url !== "#" ? "pointer" : "not-allowed",
              opacity: test.url && test.url !== "#" ? 1 : 0.5,
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
            onMouseEnter={(e) => { if (test.url && test.url !== "#") e.currentTarget.style.background = "#c40a5a"; }}
            onMouseLeave={(e) => (e.currentTarget.style.background = PINK)}
          >
            Book with {meta.displayName}
            <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );

};

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

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                style={{
                  fontFamily: "'DM Sans',sans-serif", fontWeight: 500, fontSize: 13,
                  padding: "6px 16px", borderRadius: 20, border: `1.5px solid ${NAVY}`, cursor: "pointer",
                  background: activeCategory === cat ? NAVY : "#fff",
                  color: activeCategory === cat ? "#fff" : NAVY,
                  transition: "all 150ms",
                }}
              >
                {cat}
              </button>
            ))}
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
                  <AtHomeTestCard key={test.id} test={test} onClick={() => setSelectedTest(test)} />
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
        <TestInfoSheet test={selectedTest} onClose={() => setSelectedTest(null)} />
      )}
    </MainLayout>
  );
};

export default AtHomeTestsPage;
