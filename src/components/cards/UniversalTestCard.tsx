import React, { useState } from "react";
import {
  Clock, Home, FlaskConical, CheckCircle, Plus, X, Syringe,
} from "lucide-react";
import { getProviderMeta } from "@/constants/providerMeta";
import { getProviderLogo } from "@/constants/providers";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import type { CompareTestData } from "@/types";

// ─── Design tokens (kept inline to mirror AtHomeTestsPage exactly) ───────────
export const UTC_NAVY = "#081129";
export const UTC_TURQUOISE = "#22c0d4";
export const UTC_PINK = "#e70d69";
export const UTC_TINT = "#f0f4fa";

// ─── Universal test data ─────────────────────────────────────────────────────
export interface UniversalTestData {
  id: string;
  provider_id: string;
  test_name: string;
  category?: string | null;
  description?: string | null;
  price?: number | null;
  turnaround_days_text?: string | null;
  sample_type?: string | null;
  biomarker_count?: number | null;
  biomarkers_list?: { value: string }[] | string[] | null;
  symptoms?: string[] | null;
  who_should_test?: string | null;
  url?: string | null;
  is_popular?: boolean;
  home_kit_available?: boolean;
  clinic_visit_available?: boolean;
}

// ─── Collection add-ons (shared across all cards) ────────────────────────────
const COLLECTION_ADDONS: { label: string; description?: string; price: number }[] = [
  { label: "At Home Phlebotomist", description: "A professional phlebotomist comes to your home", price: 80 },
  { label: "In Clinic Blood Draw", price: 35 },
  { label: "Third-party blood draw (e.g. Royal Mail kit)", price: 3.99 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function normalizeBiomarkers(list: UniversalTestData["biomarkers_list"]): string[] {
  if (!list) return [];
  if (Array.isArray(list) && list.length > 0) {
    if (typeof list[0] === "string") return list as string[];
    return (list as { value: string }[]).map((b) => b?.value).filter(Boolean);
  }
  return [];
}

function collectionLabel(t: UniversalTestData): string {
  if (t.home_kit_available && t.clinic_visit_available) return "Home or clinic";
  if (t.home_kit_available) return "At-home kit";
  if (t.clinic_visit_available) return "Clinic visit";
  return "At-home kit";
}

function toCompareData(t: UniversalTestData): CompareTestData {
  const meta = getProviderMeta(t.provider_id);
  const logo = getProviderLogo(t.provider_id) || meta.logo || "";
  return {
    id: t.id,
    name: t.test_name,
    provider: meta.displayName,
    price: t.price ?? 0,
    category: t.category || "",
    description: t.description || "",
    available: true,
    features: {
      turnaround: t.turnaround_days_text || "",
      collection: collectionLabel(t),
      bioMarkers: t.biomarker_count ? String(t.biomarker_count) : undefined,
    },
    providerLogo: logo,
    biomarkerCount: t.biomarker_count ?? undefined,
    url: t.url || undefined,
  };
}

// ─── Detail Modal ────────────────────────────────────────────────────────────
export const UniversalTestDetailModal: React.FC<{
  test: UniversalTestData;
  onClose: () => void;
}> = ({ test, onClose }) => {
  const meta = getProviderMeta(test.provider_id);
  const logo = getProviderLogo(test.provider_id) || meta.logo;
  const biomarkers = normalizeBiomarkers(test.biomarkers_list);
  const compareItems = useCompareItems();
  const inCompare = compareItems.some((c) => c.id === test.id);
  const handleCompareToggle = () => compareStore.toggle(toCompareData(test));
  const isAllergy = (test.category || "").toLowerCase().includes("allerg");

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
        <div style={{ background: UTC_NAVY, borderRadius: "16px 16px 0 0", padding: "24px" }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              {logo && (
                <div className="rounded-lg flex-shrink-0" style={{ background: "#fff", width: 44, height: 44, padding: 6 }}>
                  <img src={logo} alt={meta.displayName} className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                </div>
              )}
              <div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, color: UTC_TURQUOISE }}>{meta.displayName}</div>
                <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", lineHeight: 1.2 }}>{test.test_name}</div>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close" className="flex-shrink-0 rounded-full p-1.5 hover:bg-white/10 transition-colors">
              <X size={20} color="#fff" />
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-4">
            <div>
              <div style={{ color: UTC_PINK, fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 28 }}>
                {test.price != null ? `£${Number(test.price).toFixed(2)}` : "POA"}
              </div>
              <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontFamily: "'DM Sans',sans-serif" }}>Base price</div>
            </div>
            {test.turnaround_days_text && (
              <div className="flex items-center gap-1.5">
                <Clock size={14} color={UTC_TURQUOISE} />
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{test.turnaround_days_text}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Turnaround</div>
                </div>
              </div>
            )}
            {test.biomarker_count != null && test.biomarker_count > 0 && (
              <div className="flex items-center gap-1.5">
                <FlaskConical size={14} color={UTC_TURQUOISE} />
                <div>
                  <div style={{ color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{test.biomarker_count} {isAllergy ? "allergies tested" : "biomarkers"}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>{isAllergy ? "Allergens" : "Measured"}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <Syringe size={14} color={UTC_TURQUOISE} />
              <div>
                <div style={{ color: "#fff", fontSize: 13, fontFamily: "'DM Sans',sans-serif" }}>{collectionLabel(test)}</div>
                <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 11 }}>Collection</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: UTC_NAVY, marginBottom: 8 }}>Additional Collection Options</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#64748b", marginBottom: 10 }}>
              Base price covers the standard collection method. Optional collection methods are available at additional cost:
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {COLLECTION_ADDONS.map((a) => (
                <div key={a.label} style={{ background: UTC_TINT, borderRadius: 8, padding: "8px 12px" }}>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: UTC_NAVY }}>{a.label}</span>
                    <span style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 13, color: UTC_PINK }}>+£{a.price.toFixed(2)}</span>
                  </div>
                  {a.description && (
                    <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#94a3b8", marginTop: 2 }}>{a.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {test.description && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: UTC_NAVY, marginBottom: 8 }}>About This Test</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{test.description}</p>
            </div>
          )}

          {test.who_should_test && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: UTC_NAVY, marginBottom: 8 }}>Who Should Test</div>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 14, color: "#475569", lineHeight: 1.6 }}>{test.who_should_test}</p>
            </div>
          )}

          {biomarkers.length > 0 && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: UTC_NAVY, marginBottom: 8 }}>
                {isAllergy ? "Allergies Tested" : "Biomarkers Tested"} ({biomarkers.length})
              </div>
              <div className="flex flex-wrap gap-2">
                {biomarkers.map((b, i) => (
                  <span key={i} style={{ background: UTC_TINT, color: UTC_NAVY, fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{b}</span>
                ))}
              </div>
            </div>
          )}

          {(test.symptoms || []).length > 0 && (
            <div>
              <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: UTC_NAVY, marginBottom: 8 }}>Related Symptoms</div>
              <div className="flex flex-wrap gap-2">
                {(test.symptoms || []).map((s, i) => (
                  <span key={i} style={{ background: "#fff5f9", color: UTC_PINK, border: `1px solid ${UTC_PINK}30`, fontFamily: "'DM Sans',sans-serif", fontSize: 12, padding: "4px 10px", borderRadius: 20 }}>{s}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: UTC_NAVY, marginBottom: 8 }}>Standards & Accreditation</div>
            <div className="flex flex-wrap gap-3">
              {meta.ukas && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} color={UTC_TURQUOISE} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#475569" }}>UKAS accredited lab</span>
                </div>
              )}
              {meta.cqc && (
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={16} color={UTC_TURQUOISE} />
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#475569" }}>CQC regulated</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <CheckCircle size={16} color={UTC_TURQUOISE} />
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 13, color: "#475569" }}>GDPR compliant</span>
              </div>
            </div>
          </div>

          <div style={{ background: UTC_TINT, borderLeft: `3px solid ${UTC_TURQUOISE}`, borderRadius: 6, padding: "12px 14px" }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#64748b", margin: 0 }}>
              myhealth checkup is an independent comparison platform. We do not provide medical advice. Always confirm test details, pricing, and availability directly with the provider before booking.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleCompareToggle}
              className="flex items-center justify-center gap-2 rounded-full"
              style={{
                background: inCompare ? UTC_TURQUOISE : "#fff",
                color: inCompare ? "#fff" : UTC_NAVY,
                border: `2px solid ${UTC_TURQUOISE}`,
                fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15,
                padding: "14px 24px", flex: 1, cursor: "pointer", transition: "all 150ms",
              }}
            >
              {inCompare ? "✓ In Compare" : "+ Compare"}
            </button>
            {test.url && test.url !== "#" ? (
              <a
                href={test.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full"
                style={{ background: UTC_PINK, color: "#fff", fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 24px", textDecoration: "none", flex: 1 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#c40a5a")}
                onMouseLeave={(e) => (e.currentTarget.style.background = UTC_PINK)}
              >
                Book
              </a>
            ) : (
              <a
                href={`/contact?test=${encodeURIComponent(test.id)}`}
                className="flex items-center justify-center gap-2 rounded-full"
                style={{ background: UTC_PINK, color: "#fff", fontFamily: "'Montserrat',sans-serif", fontWeight: 700, fontSize: 15, padding: "14px 24px", textDecoration: "none", flex: 1 }}
              >
                Enquire
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Card ────────────────────────────────────────────────────────────────────
export interface UniversalTestCardProps {
  test: UniversalTestData;
  /** Optional override for the click handler. If omitted, opens the detail modal. */
  onOpenDetail?: () => void;
  className?: string;
}

export const UniversalTestCard: React.FC<UniversalTestCardProps> = ({
  test, onOpenDetail, className,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const meta = getProviderMeta(test.provider_id);
  const logo = getProviderLogo(test.provider_id) || meta.logo;
  const biomarkers = normalizeBiomarkers(test.biomarkers_list);
  const compareItems = useCompareItems();
  const inCompare = compareItems.some((c) => c.id === test.id);
  const isAllergy = (test.category || "").toLowerCase().includes("allerg");

  const handleOpen = () => {
    if (onOpenDetail) onOpenDetail();
    else setInternalOpen(true);
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    compareStore.toggle(toCompareData(test));
  };

  const handleBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (test.url && test.url !== "#") {
      window.open(test.url, "_blank", "noopener,noreferrer");
    } else {
      window.location.href = `/contact?test=${encodeURIComponent(test.id)}`;
    }
  };

  return (
    <>
      <div
        onClick={handleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleOpen(); } }}
        className={`group cursor-pointer rounded-2xl bg-white w-full h-full flex flex-col overflow-hidden ${className || ""}`}
        style={{
          border: "1px solid #e2e8f0",
          transition: "border-color 200ms, box-shadow 200ms, transform 200ms",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = UTC_TURQUOISE;
          (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(34,192,212,0.12)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
          (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Accent stripe — identical on every card */}
        <div style={{ height: 4, background: meta.color || UTC_TURQUOISE, flexShrink: 0 }} />

        {/* Body — flex column so the bottom block (price + buttons) is always flush */}
        <div className="flex flex-1 flex-col p-4">
          {/* Provider row — fixed height */}
          <div className="flex items-center justify-between mb-3 h-7 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <div
                style={{ width: 28, height: 28, background: "#f8fafc", borderRadius: 6, padding: 3, flexShrink: 0 }}
                className="flex items-center justify-center"
              >
                {logo ? (
                  <img
                    src={logo}
                    alt={meta.displayName}
                    className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).style.visibility = "hidden"; }}
                  />
                ) : null}
              </div>
              <span
                className="truncate"
                style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 600, fontSize: 12, color: UTC_TURQUOISE }}
              >
                {meta.displayName}
              </span>
            </div>
            <span
              aria-hidden={!test.is_popular}
              style={{
                background: "#fff5f9",
                color: UTC_PINK,
                border: `1px solid ${UTC_PINK}30`,
                fontFamily: "'Montserrat',sans-serif",
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 8px",
                borderRadius: 20,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                flexShrink: 0,
                visibility: test.is_popular ? "visible" : "hidden",
              }}
            >
              Popular
            </span>
          </div>

          {/* Title — always reserves 2 lines */}
          <div
            className="line-clamp-2 mb-1"
            style={{
              fontFamily: "'Montserrat',sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: UTC_NAVY,
              lineHeight: 1.3,
              minHeight: "calc(15px * 1.3 * 2)",
            }}
          >
            {test.test_name}
          </div>

          {/* Category — always reserves one line */}
          <div
            className="truncate mb-2"
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#94a3b8", minHeight: 18 }}
          >
            {test.category || "\u00A0"}
          </div>

          {/* Description — always reserves 2 lines */}
          <p
            className="line-clamp-2 mb-3"
            style={{
              fontFamily: "'DM Sans',sans-serif",
              fontSize: 13,
              color: "#64748b",
              lineHeight: 1.5,
              minHeight: "calc(13px * 1.5 * 2)",
            }}
          >
            {test.description || "\u00A0"}
          </p>

          {/* Biomarker chips — fixed row */}
          <div
            className="flex flex-nowrap gap-1.5 mb-3 overflow-hidden"
            style={{ minHeight: 22, maxHeight: 22 }}
          >
            {biomarkers.slice(0, 3).map((b, i) => (
              <span
                key={i}
                className="truncate"
                style={{
                  background: UTC_TINT,
                  color: UTC_NAVY,
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 12,
                  maxWidth: "40%",
                }}
              >
                {b}
              </span>
            ))}
            {biomarkers.length > 3 && (
              <span
                className="flex-shrink-0"
                style={{
                  background: UTC_TINT,
                  color: "#94a3b8",
                  fontFamily: "'DM Sans',sans-serif",
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 12,
                }}
              >
                +{biomarkers.length - 3}
              </span>
            )}
          </div>

          {/* Stats row — single fixed-height row */}
          <div
            className="flex items-center gap-x-3 mb-3 overflow-hidden whitespace-nowrap"
            style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 12, color: "#64748b", minHeight: 20 }}
          >
            <span className="flex items-center gap-1 flex-shrink-0">
              <FlaskConical size={12} color={UTC_TURQUOISE} />
              {test.biomarker_count && test.biomarker_count > 0
                ? `${test.biomarker_count} ${isAllergy ? "allergens" : "markers"}`
                : "—"}
            </span>
            <span className="flex items-center gap-1 flex-shrink-0">
              <Clock size={12} color={UTC_TURQUOISE} />
              {test.turnaround_days_text || "—"}
            </span>
            <span className="flex items-center gap-1 flex-shrink-0 truncate">
              <Home size={12} color={UTC_TURQUOISE} />
              {collectionLabel(test)}
            </span>
          </div>

          {/* Spacer pushes price + buttons to the bottom */}
          <div className="flex-1" />

          {/* Price */}
          <div
            className="flex items-center justify-between pt-3 mb-3"
            style={{ borderTop: "1px solid #f1f5f9" }}
          >
            <div style={{ fontFamily: "'Montserrat',sans-serif", fontWeight: 800, fontSize: 20, color: UTC_PINK }}>
              {test.price != null ? `£${Number(test.price).toFixed(2)}` : "POA"}
            </div>
            <span
              className="truncate ml-2"
              style={{ fontFamily: "'DM Sans',sans-serif", fontSize: 11, color: "#94a3b8" }}
            >
              Base {collectionLabel(test).toLowerCase()}
            </span>
          </div>

          {/* Buttons — flush bottom, identical heights */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleCompare}
              aria-label={inCompare ? "Remove from compare" : "Add to compare"}
              style={{
                background: inCompare ? UTC_TURQUOISE : "#fff",
                color: inCompare ? "#fff" : UTC_NAVY,
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 600,
                fontSize: 12,
                height: 40,
                padding: "0 12px",
                borderRadius: 20,
                border: `1.5px solid ${inCompare ? UTC_TURQUOISE : UTC_NAVY}`,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 150ms",
              }}
            >
              {inCompare ? <CheckCircle size={14} /> : <Plus size={14} />}
              {inCompare ? "Added" : "Compare"}
            </button>
            <button
              onClick={handleBook}
              aria-label={`Book ${test.test_name}`}
              style={{
                background: UTC_PINK,
                color: "#fff",
                fontFamily: "'Montserrat',sans-serif",
                fontWeight: 700,
                fontSize: 12,
                height: 40,
                padding: "0 12px",
                borderRadius: 20,
                border: "none",
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#c40a5a")}
              onMouseLeave={(e) => (e.currentTarget.style.background = UTC_PINK)}
            >
              {test.url && test.url !== "#" ? "Book" : "Enquire"}
            </button>
          </div>
        </div>
      </div>

      {internalOpen && !onOpenDetail && (
        <UniversalTestDetailModal test={test} onClose={() => setInternalOpen(false)} />
      )}
    </>
  );
};

export default UniversalTestCard;
