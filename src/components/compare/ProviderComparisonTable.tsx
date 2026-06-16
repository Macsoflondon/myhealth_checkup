import React, { useMemo } from "react";
import { CheckCircle, Plus, Check } from "lucide-react";
import type { CompareTestData } from "@/types";
import { PROVIDER_LOGOS } from "@/constants/providers";
import {
  SAMPLE_TYPE_LABELS,
  COLLECTION_METHOD_LABELS,
  formatCollectionFee,
  formatClinicalReview,
  computeTotalExpectedCost,
} from "@/lib/comparisonFormat";

const PROVIDER_NAME_TO_ID: Record<string, string> = {
  "medichecks": "medichecks",
  "thriva": "thriva",
  "randox": "randox",
  "randox health": "randox",
  "london medical laboratory": "london-medical-laboratory",
  "london health company": "london-health-company",
  "lola health": "lola-health",
  "goodbody": "goodbody-clinic",
  "goodbody clinic": "goodbody-clinic",
  "clinilabs": "clinilabs",
  "medical diagnosis": "medical-diagnosis",
};

const resolveLogo = (test: CompareTestData): string | undefined => {
  if (test.providerLogo) return test.providerLogo;
  const key = (test.provider || "").toLowerCase().trim();
  const id = PROVIDER_NAME_TO_ID[key];
  return id ? PROVIDER_LOGOS[id] : undefined;
};

interface ProviderComparisonTableProps {
  tests: CompareTestData[];
}

const NAVY = "#081129";
const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const TINT = "#f0f4fa";
const DIVIDER = "#e2e8f0";
const MUTED = "#94a3b8";

const MIN_COLS = 3;
const MAX_COLS = 5;

type Slot = CompareTestData | null;

interface ParsedCollection {
  homeKit: boolean;
  clinic: boolean;
  label: string;
}

const parseCollection = (collection: string): ParsedCollection => {
  const s = (collection || "").toLowerCase();
  const homeKit = /finger-?prick|home kit|at-?home/.test(s);
  const clinic = /venous|clinic/.test(s);
  let label = collection || "—";
  if (homeKit && clinic) label = "At-home kit & venous draw";
  else if (homeKit) label = "At-home kit";
  else if (clinic) label = "Venous draw";
  return { homeKit, clinic, label };
};

const hasAccreditation = (test: CompareTestData, needle: string): boolean =>
  (test.accreditations || []).some((a) => a.toLowerCase().includes(needle.toLowerCase()));

const formatPrice = (price: number): string =>
  price == null || Number.isNaN(price) ? "—" : `£${price.toFixed(2)}`;

const Tick: React.FC = () => <CheckCircle size={18} color={TURQUOISE} className="inline-block" />;
const Dash: React.FC = () => <span style={{ color: MUTED }}>—</span>;

const noteStyle: React.CSSProperties = {
  fontFamily: "'DM Sans', system-ui, sans-serif",
  fontSize: 11,
  color: MUTED,
  marginTop: 2,
};

const cellBase = (bg: string): React.CSSProperties => ({
  background: bg,
  minWidth: 160,
  fontSize: 14,
  fontFamily: "'DM Sans', system-ui, sans-serif",
  padding: "14px 16px",
  color: NAVY,
  textAlign: "center",
  verticalAlign: "middle",
});

interface RowProps {
  label: string;
  index: number;
  slots: Slot[];
  render: (t: CompareTestData, i: number) => React.ReactNode;
  placeholder?: React.ReactNode;
}

const Row: React.FC<RowProps> = ({ label, index, slots, render, placeholder }) => {
  const bg = index % 2 === 0 ? "#ffffff" : TINT;
  return (
    <tr style={{ borderBottom: `1px solid ${DIVIDER}` }}>
      <th
        scope="row"
        className="sticky left-0 z-10 text-left"
        style={{
          background: NAVY,
          color: "#ffffff",
          fontFamily: "'Montserrat', sans-serif",
          fontWeight: 500,
          fontSize: 13,
          width: 160,
          minWidth: 160,
          padding: "14px 16px",
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
        }}
      >
        {label}
      </th>
      {slots.map((slot, i) => (
        <td key={i} style={cellBase(bg)}>
          {slot ? render(slot, i) : (placeholder ?? <Dash />)}
        </td>
      ))}
    </tr>
  );
};

const PlaceholderHeader: React.FC = () => (
  <div
    className="flex flex-col items-center justify-center text-center"
    style={{
      minHeight: 96,
      border: "2px dashed rgba(255,255,255,0.15)",
      borderRadius: 8,
      padding: "12px 8px",
    }}
  >
    <Plus size={20} color={TURQUOISE} />
    <div
      className="mt-2"
      style={{
        fontFamily: "'DM Sans', system-ui, sans-serif",
        fontSize: 12,
        color: "rgba(255,255,255,0.5)",
      }}
    >
      Select a test
    </div>
  </div>
);

export const ProviderComparisonTable: React.FC<ProviderComparisonTableProps> = ({ tests }) => {
  const columns = useMemo(() => {
    const seen = new Set<string>();
    const picked: CompareTestData[] = [];
    for (const t of tests) {
      if (seen.has(t.provider)) continue;
      seen.add(t.provider);
      picked.push(t);
    }
    return picked.slice(0, MAX_COLS);
  }, [tests]);

  // Note: when no providers are selected, the table still renders with placeholder
  // columns so users can see the structure they're filling in.

  const colCount = Math.min(MAX_COLS, Math.max(MIN_COLS, columns.length));
  const slots: Slot[] = Array.from({ length: colCount }, (_, i) => columns[i] ?? null);

  return (
    <div className="w-full">
      <style>{`
        @media (max-width: 640px) {
          .comparison-table th[scope="col"],
          .comparison-table th[scope="row"],
          .comparison-table td {
            padding: 10px 8px !important;
            font-size: 12px !important;
          }
          .comparison-table th[scope="row"],
          .comparison-table thead th:first-child {
            width: 108px !important;
            min-width: 108px !important;
          }
          .comparison-table thead th:not(:first-child) {
            min-width: 168px !important;
          }
          .comparison-table .provider-name {
            font-size: 12px !important;
            word-break: break-word;
          }
          .comparison-table .provider-test-name {
            font-size: 11px !important;
          }
        }
        .comparison-table .provider-name,
        .comparison-table .provider-test-name {
          overflow-wrap: anywhere;
          word-break: break-word;
        }
      `}</style>

      <div
        style={{
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(8,17,41,0.08)",
          border: `1px solid ${DIVIDER}`,
        }}
      >
        <table className="comparison-table" style={{ borderCollapse: "collapse", width: "100%", background: "#ffffff" }}>
          <thead>
            <tr>
              <th
                scope="col"
                className="sticky left-0 z-20"
                style={{
                  background: NAVY,
                  color: "#ffffff",
                  width: 160,
                  minWidth: 160,
                  padding: "20px 16px",
                  textAlign: "left",
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 13,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                Providers
              </th>
              {slots.map((test, i) => {
                if (!test) {
                  return (
                    <th
                      key={`ph-${i}`}
                      scope="col"
                      style={{
                        background: NAVY,
                        minWidth: 220,
                        padding: "20px 16px",
                        verticalAlign: "top",
                      }}
                    >
                      <PlaceholderHeader />
                    </th>
                  );
                }
                const parsed = parseCollection(test.features?.collection || "");
                const collNote = parsed.homeKit && parsed.clinic
                  ? "At-home kit & venous draw"
                  : parsed.homeKit
                  ? "At-home kit"
                  : parsed.clinic
                  ? "Venous draw"
                  : "";
                return (
                  <th
                    key={test.id}
                    scope="col"
                    style={{
                      background: NAVY,
                      color: "#ffffff",
                      minWidth: 220,
                      padding: "20px 16px",
                      textAlign: "left",
                      verticalAlign: "top",
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: "#ffffff", width: 48, height: 48, padding: 5 }}
                      >
                        {(() => {
                          const logo = resolveLogo(test);
                          return logo ? (
                            <img
                              src={logo}
                              alt={`${test.provider} logo`}
                              className="max-w-full max-h-full object-contain"
                            />
                          ) : (
                            <span
                              className="font-montserrat font-bold text-xs"
                              style={{ color: NAVY }}
                            >
                              {test.provider.slice(0, 2).toUpperCase()}
                            </span>
                          );
                        })()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="provider-name"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 600,
                            fontSize: 13,
                            color: TURQUOISE,
                          }}
                        >
                          {test.provider}
                        </div>
                        <div
                          className="provider-test-name line-clamp-2 mt-0.5"
                          style={{
                            fontFamily: "'DM Sans', system-ui, sans-serif",
                            fontSize: 12,
                            color: "#ffffff",
                            opacity: 0.85,
                          }}
                        >
                          {test.name.replace(/\s*\(\d+\s+Biomarkers?\)\s*$/i, "")}
                        </div>
                        <div
                          className="mt-2"
                          style={{
                            fontFamily: "'Montserrat', sans-serif",
                            fontWeight: 700,
                            fontSize: 20,
                            color: PINK,
                            lineHeight: 1,
                          }}
                        >
                          {formatPrice(test.price)}
                        </div>
                        {collNote && (
                          <div
                            style={{
                              fontFamily: "'DM Sans', system-ui, sans-serif",
                              fontSize: 11,
                              color: "rgba(255,255,255,0.65)",
                              marginTop: 4,
                            }}
                          >
                            {collNote}
                          </div>
                        )}
                      </div>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            <Row
              label="Biomarkers"
              index={0}
              slots={slots}
              render={(t) => <span className="font-semibold">{t.biomarkerCount ?? '—'}</span>}
            />
            <Row
              label="Turnaround Time"
              index={1}
              slots={slots}
              render={(t) => <span>{t.features?.turnaround || "—"}</span>}
            />
            <Row
              label="Sample Type"
              index={2}
              slots={slots}
              render={(t) => (
                <span>{t.sampleTypeCode ? SAMPLE_TYPE_LABELS[t.sampleTypeCode] : <Dash />}</span>
              )}
            />
            <Row
              label="Collection Method"
              index={3}
              slots={slots}
              render={(t) => {
                if (!t.collectionMethod) return <Dash />;
                return (
                  <span className="inline-flex items-center gap-1.5">
                    <Check size={14} color={TURQUOISE} />
                    <span>{COLLECTION_METHOD_LABELS[t.collectionMethod]}</span>
                  </span>
                );
              }}
            />
            <Row
              label="Additional Collection Fees"
              index={4}
              slots={slots}
              render={(t) => {
                const fee = formatCollectionFee(t.collectionFeeType, t.collectionFeeAmount);
                if (fee.isFree) {
                  return (
                    <span style={{ color: '#15803d', fontWeight: 600 }}>{fee.label}</span>
                  );
                }
                return (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {fee.label}
                  </span>
                );
              }}
            />
            <Row
              label="Total Expected Cost"
              index={5}
              slots={slots}
              render={(t) => {
                const total = computeTotalExpectedCost(
                  t.price,
                  t.collectionFeeType,
                  t.collectionFeeAmount,
                  t.clinicalReviewType,
                  t.clinicalReviewFee,
                );
                return (
                  <span style={{ color: NAVY, fontWeight: 800, fontSize: 16 }}>
                    {formatPrice(total)}
                  </span>
                );
              }}
            />
            <Row
              label="Clinical Review"
              index={6}
              slots={slots}
              render={(t) => {
                const r = formatClinicalReview(t.clinicalReviewType, t.clinicalReviewFee);
                if (!r.isAvailable) return <Dash />;
                if (r.isIncluded) {
                  return (
                    <span className="inline-flex items-center gap-1.5" style={{ color: '#15803d', fontWeight: 600 }}>
                      <Check size={14} /> {r.label}
                    </span>
                  );
                }
                return (
                  <span
                    style={{
                      display: 'inline-flex',
                      padding: '4px 10px',
                      borderRadius: 999,
                      background: '#fef3c7',
                      color: '#92400e',
                      fontWeight: 600,
                      fontSize: 12,
                    }}
                  >
                    {r.label}
                  </span>
                );
              }}
            />
            <Row
              label="Book"
              index={7}
              slots={slots}
              placeholder={
                <button
                  type="button"
                  disabled
                  className="block w-full rounded-full"
                  style={{
                    background: "transparent",
                    color: MUTED,
                    padding: "10px 14px",
                    fontSize: 13,
                    fontFamily: "'Montserrat', sans-serif",
                    fontWeight: 600,
                    border: `2px dashed ${DIVIDER}`,
                    cursor: "not-allowed",
                  }}
                >
                  Add test
                </button>
              }
              render={(t) => {
                const available = !!t.url && t.url !== "#";
                return available ? (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full text-center rounded-full"
                    style={{
                      background: PINK,
                      color: "#ffffff",
                      padding: "10px 14px",
                      fontSize: 13,
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#c40a5a")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = PINK)}
                  >
                    Book Now
                  </a>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="block w-full rounded-full"
                    style={{
                      background: "#cbd5e1",
                      color: "#ffffff",
                      padding: "10px 14px",
                      fontSize: 13,
                      fontFamily: "'Montserrat', sans-serif",
                      fontWeight: 600,
                      cursor: "not-allowed",
                    }}
                  >
                    Unavailable
                  </button>
                );
              }}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProviderComparisonTable;
