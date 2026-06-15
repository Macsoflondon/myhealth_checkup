import React, { useMemo } from "react";
import { CheckCircle, Plus, Home, Building2 } from "lucide-react";
import type { CompareTestData } from "@/types";
import { PROVIDER_LOGOS } from "@/constants/providers";

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

  const colCount = Math.min(MAX_COLS, Math.max(MIN_COLS, columns.length));
  const slots: Slot[] = Array.from({ length: colCount }, (_, i) => columns[i] ?? null);

  const providerCount = columns.length;
  const testCount = tests.length;

  return (
    <div className="w-full">
      <div
        className="mb-4"
        style={{
          background: "#f0f4fa",
          borderLeft: `4px solid ${TURQUOISE}`,
          padding: "12px 16px",
          color: "#475569",
          borderRadius: 6,
          fontFamily: "'DM Sans', system-ui, sans-serif",
          fontSize: 13,
        }}
      >
        {providerCount === 0 ? (
          <>Select a test above to begin comparing providers side by side.</>
        ) : (
          <>
            Comparing {providerCount} provider{providerCount === 1 ? "" : "s"} across {testCount} test
            {testCount === 1 ? "" : "s"}. Prices shown are current at time of listing. Always confirm
            directly with the provider before booking.
          </>
        )}
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: 12,
          boxShadow: "0 4px 20px rgba(8,17,41,0.08)",
          border: `1px solid ${DIVIDER}`,
        }}
      >
        <table style={{ borderCollapse: "collapse", width: "100%", background: "#ffffff" }}>
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
                          className="line-clamp-2 mt-0.5"
                          style={{
                            fontFamily: "'DM Sans', system-ui, sans-serif",
                            fontSize: 12,
                            color: "#ffffff",
                            opacity: 0.85,
                          }}
                        >
                          {test.name}
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
                              color: MUTED,
                              opacity: 0.6,
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
              render={(t) => <span>{t.biomarkerCount ?? 0} biomarkers</span>}
            />
            <Row
              label="Turnaround"
              index={1}
              slots={slots}
              render={(t) => <span>{t.features?.turnaround || "—"}</span>}
            />
            <Row
              label="Sample method"
              index={2}
              slots={slots}
              render={(t) => {
                const p = parseCollection(t.features?.collection || "");
                return (
                  <span className="inline-flex items-center gap-1.5 justify-center">
                    {p.homeKit && <Home size={14} color={TURQUOISE} />}
                    {p.clinic && <Building2 size={14} color={TURQUOISE} />}
                    <span>{p.label}</span>
                  </span>
                );
              }}
            />
            <Row
              label="At-home kit"
              index={3}
              slots={slots}
              render={(t) => {
                const p = parseCollection(t.features?.collection || "");
                if (!p.homeKit) return <Dash />;
                return (
                  <div>
                    <div style={{ color: NAVY, fontWeight: 700 }}>{formatPrice(t.price)}</div>
                    <div style={noteStyle}>
                      at-home kit{p.clinic && p.homeKit ? " (combined price)" : ""}
                    </div>
                  </div>
                );
              }}
            />
            <Row
              label="Venous draw"
              index={4}
              slots={slots}
              render={(t) => {
                const p = parseCollection(t.features?.collection || "");
                if (!p.clinic) return <Dash />;
                return (
                  <div>
                    <div style={{ color: NAVY, fontWeight: 700 }}>{formatPrice(t.price)}</div>
                    <div style={noteStyle}>
                      venous draw{p.clinic && p.homeKit ? " (combined price)" : ""}
                    </div>
                  </div>
                );
              }}
            />
            <Row
              label="Doctor review"
              index={5}
              slots={slots}
              render={(t) => (hasAccreditation(t, "GP Review") ? <Tick /> : <Dash />)}
            />
            <Row
              label="Book"
              index={6}
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
