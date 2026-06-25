import { useMemo } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import type { TestRecord } from "@/types/testFinder";
import {
  AdditionalFeesCell,
  ClinicalReviewCell,
  CollectionMethodCell,
  SampleTypeCell,
  TotalCostCell,
} from "./cells";
import { VerificationMark, VerificationLegend } from "./VerificationMark";
import { formatGBP } from "@/lib/testFinder/cost";

interface Props {
  tests: TestRecord[];
}

interface Row {
  label: string;
  render: (t: TestRecord) => React.ReactNode;
}

const buildRows = (): Row[] => [
  {
    label: "Biomarkers",
    render: (t) => (
      <VerificationMark status={t.verification.biomarkers}>
        <span className="text-ink font-semibold">{t.biomarkers}</span>
      </VerificationMark>
    ),
  },
  {
    label: "Turnaround time",
    render: (t) => <span className="text-ink text-sm">{t.turnaround_label}</span>,
  },
  { label: "Sample type", render: (t) => <SampleTypeCell test={t} /> },
  { label: "Collection method", render: (t) => <CollectionMethodCell test={t} /> },
  { label: "Additional collection fees", render: (t) => <AdditionalFeesCell test={t} /> },
  { label: "Clinical review", render: (t) => <ClinicalReviewCell test={t} /> },
  { label: "Total expected cost", render: (t) => <TotalCostCell test={t} /> },
];

const ProviderHeaderCell = ({ test }: { test: TestRecord }) => (
  <div className="bg-[#0F2238] p-4 rounded-t-lg">
    <div className="text-brand-turquoise font-semibold text-base leading-tight">
      {test.provider}
    </div>
    <div className="text-white font-semibold text-sm mt-1 leading-snug">{test.name}</div>
    <div className="mt-2">
      <VerificationMark status={test.verification.price}>
        <span className="text-brand-pink font-bold text-2xl">{formatGBP(test.price)}</span>
      </VerificationMark>
    </div>
  </div>
);

const BookButton = ({ test }: { test: TestRecord }) => (
  <a
    href={test.book_url || test.source_url || "#"}
    target="_blank"
    rel="noopener noreferrer"
    className="block w-full text-center bg-brand-pink hover:bg-brand-pink/90 text-white font-semibold text-sm uppercase tracking-wide px-4 py-2.5 rounded-full transition-colors"
  >
    Book now
  </a>
);

/** Spec §4 — redesigned comparison table with sticky label rail. */
export const ComparisonTable = ({ tests }: Props) => {
  const rows = useMemo(buildRows, []);
  const isMobile = useIsMobile();

  if (!tests.length) {
    return (
      <div className="rounded-2xl bg-[#0F2238] border border-white/10 p-10 text-center text-white/60">
        Add tests to compare from the recommendations or filters.
      </div>
    );
  }

  // Mobile: stacked cards for ≤2 tests, snap-scroll for 3+
  if (isMobile) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end px-1">
          <VerificationLegend />
        </div>
        <div
          className={
            tests.length >= 3
              ? "flex gap-3 overflow-x-auto snap-x snap-mandatory -mx-4 px-4 pb-2"
              : "space-y-4"
          }
        >
          {tests.map((t) => (
            <div
              key={t.id}
              className={`bg-white rounded-2xl shadow-sm overflow-hidden ${
                tests.length >= 3 ? "min-w-[82%] snap-start" : ""
              }`}
            >
              <ProviderHeaderCell test={t} />
              <div className="divide-y divide-black/5">
                {rows.map((r) => (
                  <div key={r.label} className="p-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-[#8A97A6] mb-1">
                      {r.label}
                    </div>
                    <div>{r.render(t)}</div>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-[#EEF3FA]">
                <BookButton test={t} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop grid: sticky label column + column-per-test
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <VerificationLegend />
      </div>
      <div className="rounded-2xl overflow-hidden bg-[#0F2238] border border-white/10">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `200px repeat(${tests.length}, minmax(220px, 1fr))`,
          }}
        >
          {/* Header row */}
          <div className="bg-[#081129] p-4 border-b border-white/10" />
          {tests.map((t) => (
            <div key={t.id} className="border-b border-white/10">
              <ProviderHeaderCell test={t} />
            </div>
          ))}

          {/* Data rows */}
          {rows.map((row, idx) => (
            <div key={row.label} className="contents">
              <div
                className={`sticky left-0 z-10 bg-[#081129] text-white/70 text-xs font-semibold uppercase tracking-wide p-4 flex items-center border-b border-white/5`}
              >
                {row.label}
              </div>
              {tests.map((t) => (
                <div
                  key={t.id + row.label}
                  className={`p-4 border-b border-black/5 flex items-center ${
                    idx % 2 === 0 ? "bg-white" : "bg-[#EEF3FA]"
                  }`}
                >
                  {row.render(t)}
                </div>
              ))}
            </div>
          ))}

          {/* Book row */}
          <div className="sticky left-0 z-10 bg-[#081129] p-4" />
          {tests.map((t) => (
            <div key={t.id + "-book"} className="bg-white p-4">
              <BookButton test={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
