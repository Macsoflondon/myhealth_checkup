import React, { useMemo, useState } from "react";
import { CheckCircle, Heart, Plus } from "lucide-react";
import type { CompareTestData } from "@/types";

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

const Tick: React.FC = () => (
  <CheckCircle size={18} color={TURQUOISE} className="inline-block" aria-label="Yes" />
);

const Dash: React.FC = () => (
  <span style={{ color: MUTED }} aria-label="No">—</span>
);

const hasAccreditation = (test: CompareTestData, needle: string): boolean => {
  const list = test.accreditations || [];
  return list.some((a) => a.toLowerCase().includes(needle.toLowerCase()));
};

const hasDoctorReview = (test: CompareTestData): boolean => {
  if (hasAccreditation(test, "GP Review")) return true;
  const bio = test.features?.bioMarkers?.toLowerCase() || "";
  return bio.includes("doctor");
};

const formatPrice = (price: number): string => {
  if (price == null || Number.isNaN(price)) return "—";
  return `£${price.toFixed(2)}`;
};

type Slot = CompareTestData | null;

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
        className="font-montserrat text-left sticky left-0 z-10"
        style={{
          background: NAVY,
          color: "#ffffff",
          fontWeight: 500,
          fontSize: 14,
          width: 160,
          minWidth: 160,
          padding: "14px 16px",
          borderBottom: `1px solid ${DIVIDER}`,
        }}
      >
        {label}
      </th>
      {slots.map((slot, i) => (
        <td
          key={i}
          className="text-center"
          style={{
            background: bg,
            minWidth: 160,
            fontSize: 14,
            fontFamily: "'DM Sans', system-ui, sans-serif",
            padding: "14px 16px",
            color: NAVY,
          }}
        >
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
      border: "2px dashed rgba(255,255,255,0.2)",
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
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const columns = useMemo(() => {
    const seen = new Set<string>();
    const picked: CompareTestData[] = [];
    for (const t of tests) {
      const key = t.provider;
      if (seen.has(key)) continue;
      seen.add(key);
      picked.push(t);
    }
    return picked;
  }, [tests]);

  const colCount = Math.min(MAX_COLS, Math.max(MIN_COLS, columns.length));
  const slots: Slot[] = Array.from({ length: colCount }, (_, i) => columns[i] ?? null);

  const providerCount = columns.length;
  const testCount = tests.length;

  const toggleSave = (id: string) => {
    setSaved((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full" style={{ width: "100%", maxWidth: "100%" }}>
      {/* Info bar */}
      <div
        className="mb-4 font-['DM_Sans'] text-sm"
        style={{
          background: TINT,
          borderLeft: `4px solid ${TURQUOISE}`,
          padding: "12px 16px",
          color: "#475569",
          borderRadius: 6,
        }}
      >
        {providerCount === 0 ? (
          <>Select tests above to start comparing providers side-by-side. Prices shown are current at time of listing.</>
        ) : (
          <>
            Comparing {providerCount} provider{providerCount === 1 ? "" : "s"} across {testCount} test
            {testCount === 1 ? "" : "s"}. Prices shown are current at time of listing. Always confirm
            directly with the provider before booking.
          </>
        )}
      </div>

      <div
        className="overflow-x-auto rounded-lg"
        style={{
          boxShadow: "0 4px 20px rgba(8, 17, 41, 0.08)",
          border: `1px solid ${DIVIDER}`,
        }}
      >
        <table
          className="w-full border-collapse"
          style={{ tableLayout: "auto", background: "#ffffff" }}
        >
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
                  borderBottom: `1px solid rgba(255,255,255,0.08)`,
                }}
              >
                Providers
              </th>
              {slots.map((test, i) => (
                <th
                  key={test?.id ?? `ph-${i}`}
                  scope="col"
                  style={{
                    background: NAVY,
                    color: "#ffffff",
                    minWidth: 220,
                    padding: "20px 16px",
                    textAlign: "left",
                    verticalAlign: "top",
                    borderBottom: `1px solid rgba(255,255,255,0.08)`,
                  }}
                >
                  {test ? (
                    <div className="flex items-start gap-3">
                      <div
                        className="rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{
                          background: "#ffffff",
                          width: 40,
                          height: 40,
                          padding: 4,
                        }}
                      >
                        {test.providerLogo ? (
                          <img
                            src={test.providerLogo}
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
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div
                          className="font-montserrat font-semibold text-sm truncate"
                          style={{ color: TURQUOISE }}
                        >
                          {test.provider}
                        </div>
                        <div
                          className="font-['DM_Sans'] text-xs mt-0.5 line-clamp-2"
                          style={{ color: "#ffffff", opacity: 0.85 }}
                        >
                          {test.name}
                        </div>
                        <div
                          className="font-montserrat font-bold mt-2"
                          style={{ color: PINK, fontSize: 20, lineHeight: 1 }}
                        >
                          {formatPrice(test.price)}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <PlaceholderHeader />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <Row
              label="Biomarkers"
              index={0}
              slots={slots}
              render={(t) => <span>{(t.biomarkerCount ?? 0)} biomarkers</span>}
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
              render={(t) => <span>{t.features?.collection || "—"}</span>}
            />
            <Row
              label="Doctor review"
              index={3}
              slots={slots}
              render={(t) => (hasDoctorReview(t) ? <Tick /> : <Dash />)}
            />
            <Row
              label="UKAS accredited"
              index={4}
              slots={slots}
              render={(t) => (hasAccreditation(t, "UKAS") ? <Tick /> : <Dash />)}
            />
            <Row
              label="CQC regulated"
              index={5}
              slots={slots}
              render={(t) => (hasAccreditation(t, "CQC") ? <Tick /> : <Dash />)}
            />
            <Row
              label="Provider link"
              index={6}
              slots={slots}
              render={(t) =>
                t.url && t.url !== "#" ? (
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-['DM_Sans'] font-medium hover:underline"
                    style={{ color: TURQUOISE }}
                  >
                    Book now →
                  </a>
                ) : (
                  <Dash />
                )
              }
            />
            <Row
              label="Save"
              index={7}
              slots={slots}
              placeholder={
                <span
                  aria-hidden
                  className="inline-flex items-center justify-center rounded-full"
                  style={{
                    width: 36,
                    height: 36,
                    border: `1px solid ${DIVIDER}`,
                    background: "#ffffff",
                    opacity: 0.3,
                    cursor: "not-allowed",
                  }}
                >
                  <Heart size={18} color={PINK} fill="none" />
                </span>
              }
              render={(t) => {
                const isSaved = !!saved[t.id];
                return (
                  <button
                    type="button"
                    onClick={() => toggleSave(t.id)}
                    aria-label={isSaved ? "Remove from saved" : "Save"}
                    aria-pressed={isSaved}
                    className="inline-flex items-center justify-center rounded-full transition-colors"
                    style={{
                      width: 36,
                      height: 36,
                      border: `1px solid ${isSaved ? PINK : DIVIDER}`,
                      background: isSaved ? PINK : "#ffffff",
                    }}
                  >
                    <Heart
                      size={18}
                      color={isSaved ? "#ffffff" : PINK}
                      fill={isSaved ? "#ffffff" : "none"}
                    />
                  </button>
                );
              }}
            />
            <Row
              label="Book"
              index={8}
              slots={slots}
              placeholder={
                <button
                  type="button"
                  disabled
                  className="block w-full text-center font-montserrat font-semibold rounded-full"
                  style={{
                    background: "transparent",
                    color: MUTED,
                    padding: "10px 14px",
                    fontSize: 13,
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
                    className="block w-full text-center font-montserrat font-semibold rounded-full transition-colors"
                    style={{
                      background: PINK,
                      color: "#ffffff",
                      padding: "10px 14px",
                      fontSize: 13,
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
                    className="block w-full text-center font-montserrat font-semibold rounded-full"
                    style={{
                      background: "#cbd5e1",
                      color: "#ffffff",
                      padding: "10px 14px",
                      fontSize: 13,
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
