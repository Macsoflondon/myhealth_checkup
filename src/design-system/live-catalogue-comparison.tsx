import { forwardRef, type HTMLAttributes } from "react";

export interface CatalogueComparisonRow {
  id: string;
  provider: string;
  testName: string;
  price: number;
  biomarkers: number | null;
  /** Display text for the biomarker count; panel tests list their entries. */
  biomarkerLabel?: string | null;
  turnaround: string | null;
  /** When the provider site last confirmed the price. */
  priceCheckedAt: string | null;
  /** Collection fee line, e.g. "Includes blood draw from £30". */
  feeLabel?: string | null;
}

export interface CatalogueComparisonPanel {
  slug: string;
  name: string;
  methodLabel: string;
  rows: CatalogueComparisonRow[];
}

export interface LiveCatalogueComparisonProps extends HTMLAttributes<HTMLElement> {
  panel: CatalogueComparisonPanel | null;
  /**
   * True while prices are still loading. Shows placeholder rows the size of
   * real ones, so the card neither claims prices are unavailable nor grows
   * and pushes the page down when they arrive.
   */
  loading?: boolean;
  variant?: "compact";
  /**
   * "compact" tightens the card's vertical rhythm for slots where it sits
   * beside a text column and must not make the section taller than that
   * column. Every line of provider data stays visible — only the spacing,
   * small-text leading and panel padding shrink. "default" keeps the rhythm
   * the lower homepage slots and attached consumers already render.
   */
  size?: "default" | "compact";
}

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

/**
 * Vertical rhythm per size. Prices, provider names, test names, biomarker and
 * turnaround text, collection fees, the last-checked date and the compare link
 * are all rendered at both sizes; "compact" only shortens the space around
 * them, and never drops a row below the 12px small-text floor.
 */
const SIZE = {
  default: {
    card: "p-5 sm:p-6",
    header: "mb-4",
    title: "text-lg",
    method: "mt-1",
    row: "p-3",
    rowGrid: "gap-3",
    provider: "text-sm",
    copy: "leading-relaxed",
    gap: "mt-1",
    footer: "my-4",
  },
  compact: {
    card: "p-4 sm:p-5",
    header: "mb-3",
    title: "text-base",
    method: "mt-0.5",
    row: "p-2.5",
    rowGrid: "gap-2.5",
    provider: "text-[13px] leading-tight",
    copy: "leading-snug",
    gap: "mt-0.5",
    footer: "my-3",
  },
} as const;

/**
 * Placeholder sized like a typical loaded price row (heights measured on the
 * homepage at 390, 820 and 1440px): two-line test name, a meta line that
 * wraps on phones, the fee line under the row on phones and beside the price
 * from the sm breakpoint.
 */
const PlaceholderRow = ({ tight = false }: { tight?: boolean }) => (
  <div
    className={`rounded-lg border border-transparent border-b-brand-navy/5 ${tight ? "p-2.5" : "p-3"}`}
    aria-hidden="true"
  >
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="min-w-0">
        <div className="flex h-5 items-center">
          <span className="h-3.5 w-28 rounded bg-brand-navy/10" />
        </div>
        <div className="mt-1 flex h-10 flex-col justify-center gap-2">
          <span className="h-3 w-48 max-w-full rounded bg-brand-navy/5" />
          <span className="h-3 w-32 max-w-full rounded bg-brand-navy/5" />
        </div>
        <div className="flex h-10 items-center sm:h-5">
          <span className="h-3 w-52 max-w-full rounded bg-brand-navy/5" />
        </div>
        <div className="mt-1 flex h-4 items-center">
          <span className="h-3 w-32 rounded bg-brand-navy/5" />
        </div>
      </div>
      <div className="shrink-0 text-right">
        <div className="flex h-7 items-center justify-end">
          <span className="h-5 w-16 rounded bg-brand-navy/10" />
        </div>
        <div className="flex h-4 items-center justify-end">
          <span className="h-3 w-14 rounded bg-brand-navy/5" />
        </div>
        <div className="mt-1 hidden h-12 sm:block" />
      </div>
    </div>
    <div className="mt-2 h-5 sm:hidden" />
  </div>
);

/** Compact, independently priced provider comparison with source timestamps. */
export const LiveCatalogueComparison = forwardRef<
  HTMLElement,
  LiveCatalogueComparisonProps
>(
  (
    {
      panel,
      loading = false,
      className = "",
      variant = "compact",
      size = "default",
      ...props
    },
    ref,
  ) => (
    <article
      {...props}
      ref={ref}
      data-comparison-panel={
        panel?.slug ?? (loading ? "loading" : "unavailable")
      }
      aria-busy={loading && !panel ? true : undefined}
      data-variant={variant}
      data-size={size}
      className={`flex h-full min-w-0 flex-col rounded-[2rem] border border-brand-navy bg-white ${SIZE[size].card} text-brand-navy shadow-[0_30px_80px_-20px_rgba(8,17,41,0.35),0_8px_24px_-8px_rgba(8,17,41,0.18)] ring-1 ring-slate-200/60 ${className}`}
    >
      <header
        className={`${SIZE[size].header} flex items-start justify-between gap-3`}
      >
        <div className="min-w-0">
          <h3
            className={`m-0 font-heading ${SIZE[size].title} font-bold leading-snug tracking-normal`}
          >
            {panel?.name ??
              (loading ? "Loading live prices" : "Comparison unavailable")}
          </h3>
          {panel ? (
            <p
              className={`mb-0 ${SIZE[size].method} text-xs text-brand-navy/65`}
            >
              {panel.methodLabel}
            </p>
          ) : (
            loading && <div className="mt-1 h-4" aria-hidden="true" />
          )}
        </div>
        <span className="shrink-0 rounded-full bg-brand-turquoise/10 px-2 py-1 text-xs font-semibold">
          Live catalogue
        </span>
      </header>
      <div className="flex-1">
        {panel?.rows.map((row, index) => (
          <div
            key={row.id}
            className={`rounded-lg border ${SIZE[size].row} ${index === 0 ? "border-brand-turquoise/20 bg-brand-turquoise/8" : "border-transparent border-b-brand-navy/5"}`}
          >
            {/* Two-column grid: text takes what's left, price stays natural
                width. The fee line lives under the row on mobile so it can't
                squeeze the text column into one-word-per-line wrapping. */}
            <div
              className={`grid grid-cols-[minmax(0,1fr)_auto] items-start ${SIZE[size].rowGrid}`}
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span
                    className={`font-heading ${SIZE[size].provider} font-bold`}
                  >
                    {row.provider}
                  </span>
                  {index === 0 && (
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-pink px-2 py-0.5 text-xs font-semibold text-white">
                      Lowest shown
                    </span>
                  )}
                </div>
                <p
                  className={`mb-0 ${SIZE[size].gap} text-xs ${SIZE[size].copy} text-brand-navy/70`}
                >
                  {row.testName}
                </p>
                <p
                  className={`m-0 text-xs ${SIZE[size].copy} text-brand-navy/65`}
                >
                  {row.biomarkerLabel
                    ? row.biomarkerLabel
                    : row.biomarkers === null
                      ? "Biomarkers not stated"
                      : `${row.biomarkers} biomarkers`}{" "}
                  ·{" "}
                  {row.turnaround
                    ? `Typical results: ${row.turnaround}`
                    : "Turnaround not stated"}
                </p>
                <p
                  className={`mb-0 ${SIZE[size].gap} text-xs text-brand-navy/60`}
                >
                  {row.priceCheckedAt &&
                  !Number.isNaN(Date.parse(row.priceCheckedAt))
                    ? `Price checked ${new Date(row.priceCheckedAt).toLocaleDateString("en-GB", { timeZone: "Europe/London" })}`
                    : "Update date not available"}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <div className="whitespace-nowrap font-heading text-lg font-extrabold tabular-nums">
                  {currency.format(row.price)}
                </div>
                <div className="text-xs text-brand-navy/65">Total cost</div>
                {row.feeLabel && (
                  <div
                    className={`${SIZE[size].gap} hidden max-w-[11rem] text-xs leading-snug text-brand-navy/65 sm:block`}
                  >
                    {row.feeLabel}
                  </div>
                )}
              </div>
            </div>
            {row.feeLabel && (
              <div className="mt-2 text-xs leading-snug text-brand-navy/65 sm:hidden">
                {row.feeLabel}
              </div>
            )}
          </div>
        ))}
        {!panel &&
          loading &&
          [0, 1, 2, 3].map((i) => (
            <PlaceholderRow key={i} tight={size === "compact"} />
          ))}
        {!panel && !loading && (
          <p className="text-sm text-brand-navy/70">
            Live prices are currently unavailable.
          </p>
        )}
      </div>
      <p
        className={`${SIZE[size].footer} text-xs leading-relaxed text-brand-navy/65`}
      >
        Prices are checked on provider websites about every 6 hours. Confirm the
        current price and any extra charges with the provider before booking.
      </p>
      {!panel && loading && (
        <div className="mt-auto min-h-11" aria-hidden="true" />
      )}
      {panel && (
        <a
          href={`/compare/results?panel=${encodeURIComponent(panel.slug)}`}
          className="mt-auto inline-flex min-h-11 items-center gap-2 self-start rounded-sm text-sm font-semibold text-brand-pink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-turquoise"
        >
          Compare {panel.name.toLowerCase()} tests{" "}
          <span aria-hidden="true">→</span>
        </a>
      )}
    </article>
  ),
);
LiveCatalogueComparison.displayName = "LiveCatalogueComparison";
