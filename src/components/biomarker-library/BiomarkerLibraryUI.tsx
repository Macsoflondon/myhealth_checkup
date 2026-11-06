import { useEffect, useMemo, useState } from "react";
import { labelMidSentence, toSentenceCase } from "@/lib/display-label";
import {
  useInfiniteQuery,
  useQuery,
  keepPreviousData,
} from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { StandardPageHero } from "@/components/layout/StandardPageHero";
import {
  librarySummaryQuery,
  libraryEntryQuery,
  libraryPagesQuery,
  biomarkerProvidersQuery,
  biomarkerProviderCompareHref,
  type LibraryEntry,
} from "@/services/BiomarkerLibraryService";
import { getProviderName } from "@/constants/providers";
import {
  resolveRangeView,
  type RangeBand,
  type RangeKey,
  type Sex,
  type SexRangeContent,
  type SexRanges,
} from "./biomarker-ranges";
import { categoryIcon, resolveConsumerCategory } from "./biomarker-categories";

const COLORS = {
  navy: "#081129",
  accent: "#22c0d4",
  accentLight: "#e6f9fc",
  text: "#1f2937",
  muted: "#64748b",
  border: "#e2e8f0",
  lightBg: "#f6f8fb",
  low: "#2563eb",
  lowBg: "#dbeafe",
  normal: "#059669",
  normalBg: "#d1fae5",
  warn: "#d97706",
  warnBg: "#fef3c7",
  high: "#dc2626",
  highBg: "#fee2e2",
} as const;

const BAND_COLOUR: Record<RangeKey, { fg: string; bg: string }> = {
  low: { fg: COLORS.low, bg: COLORS.lowBg },
  borderline: { fg: COLORS.warn, bg: COLORS.warnBg },
  normal: { fg: COLORS.normal, bg: COLORS.normalBg },
  optimal: { fg: COLORS.normal, bg: COLORS.normalBg },
  elevated: { fg: COLORS.warn, bg: COLORS.warnBg },
  high: { fg: COLORS.high, bg: COLORS.highBg },
  veryHigh: { fg: COLORS.high, bg: COLORS.highBg },
};

// Sizes come from the shared type-* utilities in src/styles.css.
const headingStyle = {
  color: COLORS.accent,
  textTransform: "uppercase",
  marginBottom: 8,
} as const;
const bodyStyle = {
  color: COLORS.text,
  whiteSpace: "pre-line",
} as const;

const formatUkDate = (iso: string | null): string | null => {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("en-GB", { timeZone: "Europe/London" });
};

const TextSection = ({
  title,
  body,
}: {
  title: string;
  body: string | null;
}) => (
  <div>
    <h4 className="type-eyebrow" style={headingStyle}>
      {title}
    </h4>
    {body ? (
      <p className="type-body" style={bodyStyle}>
        {body}
      </p>
    ) : (
      <p
        className="type-body"
        style={{ ...bodyStyle, color: COLORS.muted, fontStyle: "italic" }}
      >
        Not yet available for this biomarker.
      </p>
    )}
  </div>
);

const RangeBar = ({ bands }: { bands: RangeBand[] }) => (
  <div
    style={{
      display: "flex",
      borderRadius: 8,
      overflow: "hidden",
      marginBottom: 12,
    }}
  >
    {bands.map((b, i) => (
      <div
        key={b.key}
        style={{
          flex: 1,
          background: BAND_COLOUR[b.key].bg,
          borderLeft: i > 0 ? "2px solid #fff" : "none",
          padding: "8px 10px",
          textAlign: "center",
          fontSize: 11,
          fontWeight: 800,
          color: BAND_COLOUR[b.key].fg,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {b.label}
      </div>
    ))}
  </div>
);

const StructuredRanges = ({ data }: { data: SexRanges }) => (
  <>
    {data.phases.length > 0 && (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px,1fr))",
          gap: 8,
          marginBottom: 16,
        }}
      >
        {data.phases.map((p) => (
          <div
            key={p.title}
            style={{
              background: COLORS.lightBg,
              borderRadius: 10,
              padding: "10px 14px",
            }}
          >
            <div style={{ fontWeight: 700, color: COLORS.navy, fontSize: 14 }}>
              {p.title}
            </div>
            <div
              style={{ color: COLORS.accent, fontWeight: 800, fontSize: 14 }}
            >
              {p.range}
            </div>
          </div>
        ))}
      </div>
    )}
    {data.stages.length > 0 && (
      <div style={{ marginBottom: 16 }}>
        {data.stages.map((s) => (
          <div
            key={s.title}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              background: COLORS.lightBg,
              borderRadius: 10,
              padding: "10px 14px",
              marginBottom: 6,
            }}
          >
            <span
              style={{
                fontWeight: 800,
                color: COLORS.navy,
                fontSize: 14,
                minWidth: 130,
              }}
            >
              {s.title}: {s.range}
            </span>
            {s.meaning && (
              <span style={{ color: COLORS.muted, fontSize: 14 }}>
                {s.meaning}
              </span>
            )}
          </div>
        ))}
      </div>
    )}
    {data.ageRanges.length > 0 && (
      <div style={{ overflowX: "auto", marginBottom: 16 }}>
        <table
          style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}
        >
          <thead>
            <tr style={{ background: COLORS.lightBg }}>
              {["Age group", "Normal", "Borderline", "Elevated"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "8px 14px",
                    textAlign: "left",
                    fontSize: 12,
                    color: COLORS.muted,
                    fontWeight: 700,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.ageRanges.map((row) => (
              <tr
                key={row.range}
                style={{ borderTop: `1px solid ${COLORS.border}` }}
              >
                {[
                  [row.range, COLORS.navy],
                  [row.normal, COLORS.normal],
                  [row.borderline, COLORS.warn],
                  [row.high, COLORS.high],
                ].map(([v, c], i) => (
                  <td
                    key={i}
                    style={{
                      padding: "10px 14px",
                      fontWeight: 700,
                      color: c,
                      fontSize: 14,
                    }}
                  >
                    {v}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
    {data.bands.length > 0 && (
      <>
        <RangeBar bands={data.bands} />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 10,
            marginBottom: 20,
          }}
        >
          {data.bands.map((b) => (
            <div
              key={b.key}
              style={{
                background: BAND_COLOUR[b.key].bg,
                border: `1px solid ${BAND_COLOUR[b.key].fg}30`,
                borderRadius: 12,
                padding: "14px 16px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                  marginBottom: 4,
                  fontWeight: 800,
                  color: BAND_COLOUR[b.key].fg,
                  fontSize: 14,
                }}
              >
                <span>{b.label}</span>
                <span>{b.range}</span>
              </div>
              {b.meaning && (
                <p
                  style={{
                    color: COLORS.text,
                    fontSize: 14,
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {b.meaning}
                </p>
              )}
            </div>
          ))}
        </div>
      </>
    )}
  </>
);

const SEX_LABEL: Record<Sex, string> = { male: "Male", female: "Female" };
const OTHER_SEX: Record<Sex, Sex> = { male: "female", female: "male" };

const noteStyle = {
  background: COLORS.lightBg,
  borderRadius: 10,
  padding: "12px 14px",
  color: COLORS.muted,
  fontSize: 14,
  margin: 0,
} as const;

const TextRangeBox = ({
  label,
  value,
  unit,
}: {
  label: string | null;
  value: string;
  unit: string | null;
}) => (
  <div
    style={{
      background: COLORS.normalBg,
      borderRadius: 12,
      padding: "14px 16px",
      color: COLORS.normal,
      fontWeight: 700,
      fontSize: 14,
      marginBottom: 16,
    }}
  >
    {label ? `${label}: ` : ""}
    {value}
    {unit ? ` ${unit}` : ""}
  </div>
);

const SexContent = ({
  sex,
  content,
  unit,
}: {
  sex: Sex;
  content: SexRangeContent;
  unit: string | null;
}) => (
  <>
    {content.structured && <StructuredRanges data={content.structured} />}
    {content.text && (
      <TextRangeBox label={SEX_LABEL[sex]} value={content.text} unit={unit} />
    )}
  </>
);

/**
 * Shows the Male / Female toggle only when both sexes have a range. A range
 * for one sex is labelled as that sex. An unlabelled range is shown as it is,
 * with no claim that it applies to both sexes.
 */
export const ReferenceRanges = ({
  entry,
}: {
  entry: Pick<
    LibraryEntry,
    "referenceRanges" | "normalRangeMale" | "normalRangeFemale" | "unit"
  >;
}) => {
  const view = useMemo(
    () => resolveRangeView(entry),
    [entry.referenceRanges, entry.normalRangeMale, entry.normalRangeFemale],
  );
  const [sex, setSex] = useState<Sex>("male");

  return (
    <div style={{ marginBottom: 20 }} data-testid="reference-ranges">
      <h4
        className="type-eyebrow"
        style={{ ...headingStyle, marginBottom: 12 }}
      >
        Reference ranges
      </h4>
      {view.kind === "none" && (
        <p style={noteStyle}>
          Reference range not yet available. Each laboratory publishes its own
          range with your results, so use the range printed on your report.
        </p>
      )}
      {view.kind === "shared" && <StructuredRanges data={view.shared} />}
      {view.kind === "single-sex" && (
        <>
          <p
            style={{
              color: COLORS.navy,
              fontWeight: 700,
              fontSize: 14,
              marginBottom: 12,
            }}
          >
            {SEX_LABEL[view.sex]} range
          </p>
          <SexContent sex={view.sex} content={view.content} unit={entry.unit} />
          {view.shared && <StructuredRanges data={view.shared} />}
          <p style={noteStyle}>
            No {SEX_LABEL[OTHER_SEX[view.sex]].toLowerCase()} range is listed
            for this biomarker.
          </p>
        </>
      )}
      {view.kind === "split" && (
        <>
          <div
            role="group"
            aria-label="Show reference ranges for"
            style={{
              display: "flex",
              gap: 8,
              marginBottom: 16,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 14,
                color: COLORS.muted,
                lineHeight: "32px",
                marginRight: 4,
              }}
            >
              View ranges for:
            </span>
            {(["male", "female"] as const).map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={sex === s}
                onClick={() => setSex(s)}
                style={{
                  background: sex === s ? COLORS.navy : COLORS.lightBg,
                  color: sex === s ? "#fff" : COLORS.text,
                  border: "none",
                  borderRadius: 8,
                  padding: "6px 16px",
                  minHeight: 32,
                  fontWeight: 700,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                {SEX_LABEL[s]}
              </button>
            ))}
          </div>
          <SexContent sex={sex} content={view[sex]} unit={entry.unit} />
        </>
      )}
    </div>
  );
};

const ProviderLinks = ({ entry }: { entry: LibraryEntry }) => {
  const q = useQuery(biomarkerProvidersQuery(entry.id));
  const providers = q.data ?? [];
  if (q.isPending) {
    return (
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 16 }}>
        Loading providers…
      </p>
    );
  }
  if (q.isError) {
    return (
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 16 }}>
        We could not load the tests for this biomarker. Please try again.
      </p>
    );
  }
  if (providers.length === 0) {
    return (
      <p style={{ color: COLORS.muted, fontSize: 14, marginBottom: 16 }}>
        No current test from the providers we compare lists this biomarker.
      </p>
    );
  }
  const totalTests = providers.reduce((sum, p) => sum + p.testCount, 0);
  return (
    <div style={{ marginBottom: 16 }}>
      <h4
        className="type-eyebrow"
        style={{ ...headingStyle, marginBottom: 12 }}
      >
        In {totalTests} test{totalTests === 1 ? "" : "s"} from{" "}
        {providers.length} provider{providers.length === 1 ? "" : "s"}
      </h4>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 8,
        }}
      >
        {providers.map((p) => (
          <a
            key={p.providerId}
            href={biomarkerProviderCompareHref(entry.id, p.providerId)}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
              minHeight: 44,
              padding: "10px 14px",
              border: `1px solid ${COLORS.accent}`,
              borderRadius: 10,
              color: COLORS.navy,
              fontWeight: 700,
              fontSize: 14,
              textDecoration: "none",
              background: "#fff",
            }}
          >
            <span>{getProviderName(p.providerId)}</span>
            <span style={{ color: COLORS.muted, fontWeight: 600 }}>
              {p.testCount} test{p.testCount === 1 ? "" : "s"} →
            </span>
          </a>
        ))}
      </div>
      {providers.length > 1 && (
        <a
          href={biomarkerProviderCompareHref(entry.id)}
          style={{
            display: "inline-block",
            marginTop: 12,
            color: COLORS.accent,
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Compare all {totalTests} tests →
        </a>
      )}
    </div>
  );
};

const BiomarkerCard = ({
  entry,
  isExpanded,
  onToggle,
}: {
  entry: LibraryEntry;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const subtitle = [
    entry.consumerCategory ? toSentenceCase(entry.consumerCategory) : null,
    entry.unit,
  ]
    .filter(Boolean)
    .join(" · ");
  const primaryText = entry.whatItMeasures ?? entry.description;
  const reviewed = formatUkDate(entry.lastReviewedAt);
  const facts = [
    entry.biomaterial ? `Sample: ${entry.biomaterial}` : null,
    entry.bodySystem ? `Body system: ${entry.bodySystem}` : null,
  ].flatMap((f) => (f ? [f] : []));

  return (
    <div
      id={`biomarker-${entry.slug}`}
      style={{
        background: "#fff",
        border: `1px solid ${isExpanded ? COLORS.accent : COLORS.border}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.2s",
        boxShadow: isExpanded
          ? "0 8px 32px rgba(34,192,212,0.10)"
          : "0 2px 6px rgba(8,17,41,0.05)",
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isExpanded}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "18px 24px",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: COLORS.accentLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          {categoryIcon(entry.consumerCategory)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <span className="type-card-title" style={{ color: COLORS.navy }}>
              {entry.name}
            </span>
            {entry.abbreviation && entry.abbreviation !== entry.name && (
              <span
                style={{
                  background: COLORS.navy + "12",
                  color: COLORS.navy,
                  borderRadius: 6,
                  padding: "2px 8px",
                  fontSize: 11,
                  fontWeight: 800,
                }}
              >
                {entry.abbreviation}
              </span>
            )}
          </div>
          {subtitle && (
            <div style={{ color: COLORS.muted, fontSize: 14, marginTop: 3 }}>
              {subtitle}
            </div>
          )}
        </div>
        <div
          style={{
            color: COLORS.accent,
            fontSize: 20,
            flexShrink: 0,
            transform: isExpanded ? "rotate(180deg)" : "none",
            transition: "transform 0.2s",
          }}
        >
          ⌄
        </div>
      </button>
      {isExpanded && (
        <div
          style={{ borderTop: `1px solid ${COLORS.border}`, padding: "24px" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: 20,
              marginBottom: 24,
            }}
          >
            <TextSection title="What it measures" body={primaryText} />
            <TextSection title="Why it matters" body={entry.whyItMatters} />
            <TextSection title="What affects it" body={entry.whatAffectsIt} />
            <TextSection title="When to retest" body={entry.whenToRetest} />
            <TextSection
              title="Clinical significance"
              body={entry.clinicalSignificance}
            />
          </div>
          <ReferenceRanges key={entry.id} entry={entry} />
          {(entry.synonyms.length > 0 || facts.length > 0) && (
            <div style={{ marginBottom: 16 }}>
              {entry.synonyms.length > 0 && (
                <>
                  <h4
                    className="type-eyebrow"
                    style={{ ...headingStyle, color: COLORS.muted }}
                  >
                    Also known as
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
                    {entry.synonyms.map((s) => (
                      <span
                        key={s}
                        style={{
                          background: COLORS.navy + "10",
                          color: COLORS.navy,
                          border: `1px solid ${COLORS.navy}20`,
                          borderRadius: 20,
                          padding: "4px 12px",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </>
              )}
              {facts.length > 0 && (
                <p style={{ color: COLORS.muted, fontSize: 14 }}>
                  {facts.join(" · ")}
                </p>
              )}
            </div>
          )}
          <ProviderLinks entry={entry} />
          <p style={{ color: COLORS.muted, fontSize: 12, marginBottom: 12 }}>
            {reviewed ? `Last reviewed ${reviewed}` : "Not yet reviewed"}
          </p>
          <div
            style={{
              padding: "10px 14px",
              background: "#fff8ed",
              border: "1px solid #fde68a",
              borderRadius: 10,
            }}
          >
            <p style={{ color: "#92400e", fontSize: 12, margin: 0 }}>
              ⚕️ Reference ranges are for guidance only. Always discuss your
              results with a qualified healthcare professional.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export interface BiomarkerLibrarySearch {
  search?: string;
  category?: string;
  biomarker?: string;
}

export default function BiomarkerLibraryUI() {
  const params = useSearch({ from: "/biomarker-database" });
  const navigate = useNavigate({ from: "/biomarker-database" });
  const search = params.search ?? "";
  // Old links carry raw labels ("Cardiac Markers"); map them to the consumer
  // category so they land on the merged group.
  const category = resolveConsumerCategory(params.category) ?? "";
  const openSlug = params.biomarker ?? null;

  const [input, setInput] = useState(search);
  useEffect(() => setInput(search), [search]);
  useEffect(() => {
    if (input.trim() === search) return;
    const t = setTimeout(() => {
      void navigate({
        search: (prev) => ({ ...prev, search: input.trim() || undefined }),
        replace: true,
      });
    }, 300);
    return () => clearTimeout(t);
  }, [input, search, navigate]);

  const pages = useInfiniteQuery({
    ...libraryPagesQuery(search, category),
    placeholderData: keepPreviousData,
  });
  // Loads with the main list so the section shows without paging through
  // every biomarker first.
  const otherPages = useInfiniteQuery({
    ...libraryPagesQuery(search, "", "other"),
    enabled: !category && pages.isSuccess,
  });
  const otherLoaded = useMemo(
    () => otherPages.data?.pages.flatMap((p) => p.entries) ?? [],
    [otherPages.data],
  );
  const summaryQ = useQuery(librarySummaryQuery());
  const pinnedQ = useQuery({
    ...libraryEntryQuery(openSlug ?? ""),
    enabled: Boolean(openSlug),
  });

  const loaded = useMemo(
    () => pages.data?.pages.flatMap((p) => p.entries) ?? [],
    [pages.data],
  );
  const total = pages.data?.pages[0]?.total ?? 0;
  const otherTotal = otherPages.data?.pages[0]?.total ?? 0;
  const summary = summaryQ.data;
  const categories = summary?.categories ?? [];
  const pinned =
    pinnedQ.data && !loaded.some((e) => e.slug === pinnedQ.data?.slug)
      ? pinnedQ.data
      : null;

  const grouped = useMemo(() => {
    const g = new Map<string, LibraryEntry[]>();
    loaded.forEach((e) => {
      const key = e.consumerCategory;
      g.set(key, [...(g.get(key) ?? []), e]);
    });
    return Array.from(g.entries());
  }, [loaded]);

  useEffect(() => {
    if (!openSlug || typeof document === "undefined") return;
    const el = document.getElementById(`biomarker-${openSlug}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    // Only scroll when the requested card first becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSlug, Boolean(pinnedQ.data)]);

  const toggle = (slug: string) =>
    void navigate({
      search: (prev) => ({
        ...prev,
        biomarker: prev.biomarker === slug ? undefined : slug,
      }),
      replace: true,
      resetScroll: false,
    });

  const renderCard = (e: LibraryEntry) => (
    <BiomarkerCard
      key={e.id}
      entry={e}
      isExpanded={openSlug === e.slug}
      onToggle={() => toggle(e.slug)}
    />
  );

  return (
    <div
      style={{
        fontFamily: "Montserrat,'Helvetica Neue',sans-serif",
        background: COLORS.lightBg,
        minHeight: "100vh",
      }}
    >
      <StandardPageHero
        title="Complete biomarker reference library"
        strapline="What every blood test marker means, in plain English and grounded in clinical evidence."
        stats={[
          ...(summary && summary.biomarkerTotal > 0
            ? [`${summary.biomarkerTotal.toLocaleString("en-GB")} biomarkers`]
            : []),
          ...(categories.length > 0 ? [`${categories.length} categories`] : []),
          "Linked to live UK test listings",
        ]}
      />
      <div
        style={{
          background: "#fff",
          borderBottom: `1px solid ${COLORS.border}`,
          padding: "16px 24px",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 2px 12px rgba(8,17,41,0.06)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            gap: 8,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", flex: "1 1 auto", minWidth: 0 }}>
            <span
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 16,
                color: COLORS.accent,
              }}
            >
              🔍
            </span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Search biomarkers"
              placeholder="Search biomarkers... e.g. Haemoglobin, TSH, ALT"
              style={{
                width: "100%",
                padding: "10px 12px 10px 38px",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                fontSize: 14,
                outline: "none",
                color: COLORS.navy,
              }}
            />
          </div>
          <div style={{ position: "relative", flex: "0 0 auto" }}>
            <select
              aria-label="Filter by category"
              value={category}
              onChange={(e) =>
                void navigate({
                  search: (prev) => ({
                    ...prev,
                    category: e.target.value || undefined,
                  }),
                  replace: true,
                })
              }
              style={{
                appearance: "none",
                WebkitAppearance: "none",
                maxWidth: "min(220px, 42vw)",
                padding: "10px 30px 10px 14px",
                border: `1px solid ${COLORS.border}`,
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 600,
                color: COLORS.navy,
                background: COLORS.lightBg,
                cursor: "pointer",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              <option value="">All categories</option>
              {categories.map((c) => (
                <option key={c.label} value={c.label}>
                  {toSentenceCase(c.label)} ({c.count})
                </option>
              ))}
            </select>
            <span
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 10,
                color: COLORS.muted,
                pointerEvents: "none",
              }}
            >
              ▼
            </span>
          </div>
        </div>
      </div>
      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "20px 24px 4px" }}
      >
        {pages.isSuccess && (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            Showing{" "}
            <strong style={{ color: COLORS.navy }}>{loaded.length}</strong> of{" "}
            <strong style={{ color: COLORS.navy }}>{total}</strong> biomarkers
            {category ? ` in ${labelMidSentence(category)}` : ""}
            {search ? ` matching "${search}"` : ""}
          </p>
        )}
      </div>
      <div
        style={{ maxWidth: 1100, margin: "0 auto", padding: "12px 24px 64px" }}
      >
        {pinned && <div style={{ marginBottom: 32 }}>{renderCard(pinned)}</div>}
        {pages.isPending && (
          <p style={{ color: COLORS.muted, fontSize: 14 }}>
            Loading biomarkers…
          </p>
        )}
        {pages.isError && (
          <p style={{ color: COLORS.high, fontSize: 14 }}>
            The biomarker library could not be loaded. Please try again.
          </p>
        )}
        {grouped.map(([cat, items]) => (
          <div key={cat} style={{ marginBottom: 48 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 20,
                paddingBottom: 12,
                borderBottom: `2px solid ${COLORS.accent}30`,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: COLORS.accentLight,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                {categoryIcon(cat)}
              </div>
              <h2 className="type-section-title" style={{ color: COLORS.navy }}>
                {toSentenceCase(cat)}
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {items.map(renderCard)}
            </div>
          </div>
        ))}
        {pages.hasNextPage && (
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <button
              type="button"
              onClick={() => void pages.fetchNextPage()}
              disabled={pages.isFetchingNextPage}
              style={{
                background: COLORS.accent,
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 28px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {pages.isFetchingNextPage ? "Loading…" : "Show more"}
            </button>
          </div>
        )}
        {!category && otherLoaded.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2
              className="type-section-title"
              style={{ color: COLORS.navy, marginBottom: 6 }}
            >
              Allergens and infection markers
            </h2>
            <p
              className="type-body"
              style={{ color: COLORS.muted, marginBottom: 20 }}
            >
              {otherTotal.toLocaleString("en-GB")} allergen extracts and
              infection tests{search ? ` matching "${search}"` : ""}. They are
              not biomarkers, so we list them separately.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {otherLoaded.map(renderCard)}
            </div>
            {otherPages.hasNextPage && (
              <div style={{ textAlign: "center", marginTop: 16 }}>
                <button
                  type="button"
                  onClick={() => void otherPages.fetchNextPage()}
                  disabled={otherPages.isFetchingNextPage}
                  style={{
                    background: COLORS.accent,
                    color: "#fff",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px 28px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {otherPages.isFetchingNextPage ? "Loading…" : "Show more"}
                </button>
              </div>
            )}
          </div>
        )}
        {pages.isSuccess &&
          loaded.length === 0 &&
          (category || (otherPages.isSuccess && otherLoaded.length === 0)) && (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>🔬</div>
              <h3
                className="type-card-title"
                style={{ color: COLORS.navy, marginBottom: 8 }}
              >
                No biomarkers found
              </h3>
              <button
                type="button"
                onClick={() => {
                  setInput("");
                  void navigate({ search: () => ({}), replace: true });
                }}
                style={{
                  marginTop: 20,
                  background: COLORS.accent,
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 24px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Reset filters
              </button>
            </div>
          )}
      </div>
      <div style={{ background: COLORS.navy, padding: "32px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
          <p style={{ color: "#8fa3bf", fontSize: 14, lineHeight: 1.8 }}>
            ⚕️ <strong style={{ color: "#c8d8e8" }}>Medical disclaimer:</strong>{" "}
            This library is for educational purposes only and does not
            constitute medical advice. Always discuss results with a qualified
            healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
}
