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
  variant?: "compact";
  size?: "default";
}

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

/** Compact, independently priced provider comparison with source timestamps. */
export const LiveCatalogueComparison = forwardRef<
  HTMLElement,
  LiveCatalogueComparisonProps
>(
  (
    { panel, className = "", variant = "compact", size = "default", ...props },
    ref,
  ) => (
    <article
      {...props}
      ref={ref}
      data-comparison-panel={panel?.slug ?? "unavailable"}
      data-variant={variant}
      data-size={size}
      className={`flex h-full min-w-0 flex-col rounded-[2rem] border border-brand-navy bg-white p-5 text-brand-navy shadow-[0_30px_80px_-20px_rgba(8,17,41,0.35),0_8px_24px_-8px_rgba(8,17,41,0.18)] ring-1 ring-slate-200/60 sm:p-6 ${className}`}
    >
      <header className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="m-0 font-heading text-lg font-bold leading-snug tracking-normal">
            {panel?.name ?? "Comparison unavailable"}
          </h3>
          {panel && (
            <p className="mb-0 mt-1 text-xs text-brand-navy/65">
              {panel.methodLabel}
            </p>
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
            className={`rounded-lg border p-3 ${index === 0 ? "border-brand-turquoise/20 bg-brand-turquoise/8" : "border-transparent border-b-brand-navy/5"}`}
          >
            {/* Two-column grid: text takes what's left, price stays natural
                width. The fee line lives under the row on mobile so it can't
                squeeze the text column into one-word-per-line wrapping. */}
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-heading text-sm font-bold">
                    {row.provider}
                  </span>
                  {index === 0 && (
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-pink px-2 py-0.5 text-xs font-semibold text-white">
                      Lowest shown
                    </span>
                  )}
                </div>
                <p className="mb-0 mt-1 text-xs leading-relaxed text-brand-navy/70">
                  {row.testName}
                </p>
                <p className="m-0 text-xs leading-relaxed text-brand-navy/65">
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
                <p className="mb-0 mt-1 text-xs text-brand-navy/60">
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
                  <div className="mt-1 hidden max-w-[11rem] text-xs leading-snug text-brand-navy/65 sm:block">
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
        {!panel && (
          <p className="text-sm text-brand-navy/70">
            Live prices are currently unavailable.
          </p>
        )}
      </div>
      <p className="my-4 text-xs leading-relaxed text-brand-navy/65">
        Prices are checked on provider websites about every 6 hours. Confirm the
        current price and any extra charges with the provider before booking.
      </p>
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
