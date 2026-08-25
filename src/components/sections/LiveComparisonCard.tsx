import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useDynamicComparisonPanels } from "@/hooks/useDynamicComparisonPanels";

export type LiveComparisonPanelData = {
  name: string;
  /** Panel slug backing this card (see COMPARE_PANELS). Drives the CTA. */
  canonical?: string;
  collectionMethod?: "at_home" | "clinic";
  methodLabel?: string;
  providers: {
    name: string;
    options: { label: string; price: string }[];
  }[];
  lastScrapedAt?: string | null;
};

function formatVerified(iso?: string | null): string {
  if (!iso)
    return "Prices refreshed automatically every 6 hours from provider websites. Always confirm current pricing before booking.";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then))
    return "Prices refreshed automatically from provider websites. Always confirm current pricing before booking.";
  const diffMin = Math.max(0, Math.round((Date.now() - then) / 60000));
  let rel: string;
  if (diffMin < 1) rel = "moments ago";
  else if (diffMin < 60)
    rel = `${diffMin} minute${diffMin === 1 ? "" : "s"} ago`;
  else if (diffMin < 60 * 24) {
    const h = Math.round(diffMin / 60);
    rel = `${h} hour${h === 1 ? "" : "s"} ago`;
  } else {
    const d = Math.round(diffMin / (60 * 24));
    rel = `${d} day${d === 1 ? "" : "s"} ago`;
  }
  return `Prices verified ${rel} from provider websites. Always confirm current pricing before booking.`;
}

export const DEFAULT_LIVE_COMPARISON_PANELS: LiveComparisonPanelData[] = [
  {
    name: "Full Blood Count",
    canonical: "full-blood-count",
    collectionMethod: "at_home",
    methodLabel: "At-home test kit",
    providers: [
      {
        name: "Clinilabs",
        options: [{ label: "At-home test kit", price: "£50" }],
      },
      {
        name: "Medichecks",
        options: [{ label: "At-home test kit", price: "£59" }],
      },
      {
        name: "Goodbody Health",
        options: [{ label: "At-home test kit", price: "£69" }],
      },
      {
        name: "Medical Diagnosis",
        options: [{ label: "At-home test kit", price: "£69" }],
      },
    ],
  },
  {
    name: "Thyroid Function",
    canonical: "thyroid",
    collectionMethod: "at_home",
    methodLabel: "At-home test kit",
    providers: [
      {
        name: "Randox Health",
        options: [{ label: "At-home test kit", price: "£33" }],
      },
      {
        name: "London Health Co",
        options: [{ label: "At-home test kit", price: "£34" }],
      },
      {
        name: "Medichecks",
        options: [{ label: "At-home test kit", price: "£45" }],
      },
      {
        name: "Clinilabs",
        options: [{ label: "At-home test kit", price: "£45" }],
      },
      {
        name: "Goodbody Health",
        options: [{ label: "At-home test kit", price: "£49" }],
      },
    ],
  },
  {
    name: "Male Hormone Panel",
    canonical: "male-hormones",
    collectionMethod: "at_home",
    methodLabel: "At-home test kit",
    providers: [
      {
        name: "London Health Co",
        options: [{ label: "At-home test kit", price: "£42" }],
      },
      {
        name: "Randox Health",
        options: [{ label: "At-home test kit", price: "£46" }],
      },
      {
        name: "Medichecks",
        options: [{ label: "At-home test kit", price: "£79" }],
      },
      {
        name: "Goodbody Health",
        options: [{ label: "At-home test kit", price: "£79" }],
      },
    ],
  },
  {
    name: "Female Hormone Panel",
    canonical: "female-hormones",
    collectionMethod: "at_home",
    methodLabel: "At-home test kit",
    providers: [
      {
        name: "Randox Health",
        options: [{ label: "At-home test kit", price: "£46" }],
      },
      {
        name: "London Health Co",
        options: [{ label: "At-home test kit", price: "£48" }],
      },
      {
        name: "Medichecks",
        options: [{ label: "At-home test kit", price: "£79" }],
      },
      {
        name: "Goodbody Health",
        options: [{ label: "At-home test kit", price: "£79" }],
      },
    ],
  },
];

interface LiveComparisonCardProps {
  panels?: LiveComparisonPanelData[];
  rotateMs?: number;
  eyebrow?: string;
  className?: string;
  panelIndex?: number;
}

const LiveComparisonCard = ({
  panels: externalPanels,
  rotateMs = 60000,
  eyebrow = "Live Comparison",
  className = "",
  panelIndex,
}: LiveComparisonCardProps) => {
  const { panels: dynamicPanels } = useDynamicComparisonPanels();
  const panels =
    externalPanels && externalPanels.length > 0
      ? externalPanels
      : dynamicPanels.length > 0
        ? dynamicPanels
        : DEFAULT_LIVE_COMPARISON_PANELS;
  const controlled = panelIndex !== undefined;
  const [internalIdx, setInternalIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (controlled || panels.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setInternalIdx((i) => (i + 1) % panels.length);
        setFading(false);
      }, 500);
    }, rotateMs);
    return () => clearInterval(interval);
  }, [panels.length, rotateMs, controlled]);

  useEffect(() => {
    if (!controlled) return;
    setFading(true);
    const t = setTimeout(() => setFading(false), 500);
    return () => clearTimeout(t);
  }, [panelIndex, controlled]);

  const idx = controlled ? panelIndex! % panels.length : internalIdx;
  const test = panels[idx];
  if (!test) return null;

  return (
    <div
      className={`relative bg-[#F8FAFC] rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_-20px_rgba(8,17,41,0.22),0_8px_24px_-8px_rgba(8,17,41,0.10)] ring-1 ring-slate-200/60 overflow-hidden h-full transition-transform duration-700 ease-out hover:-translate-y-1 ${className}`}
    >
      <div className="p-6 sm:p-8 md:p-10 flex flex-col h-full">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="h-px w-8 sm:w-12 bg-brand-pink" />
          <span className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] text-brand-turquoise">
            {eyebrow}
          </span>
          <div className="h-px w-8 sm:w-12 bg-brand-pink" />
        </div>
        <h3
          className="font-heading font-bold text-brand-navy tracking-tight text-2xl sm:text-3xl text-center mb-6 transition-all duration-500 ease-in-out"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {test.name}
        </h3>
        <div
          className="flex-1 flex flex-col transition-all duration-500 ease-in-out bg-white border border-slate-100 rounded-[20px] overflow-hidden"
          style={{ opacity: fading ? 0 : 1 }}
        >
          <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/70">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand-turquoise">
                {test.name}
              </span>
              {test.methodLabel && (
                <span className="font-heading text-[11px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  {test.methodLabel}
                </span>
              )}
            </div>
          </div>
          <div className="flex-1 px-5">
            {test.providers.map((provider, pi) => (
              <div
                key={provider.name}
                className="py-3.5 border-b border-slate-100 last:border-b-0"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-heading text-base font-bold text-slate-700">
                    {provider.name}
                  </span>
                  {provider.options.length > 1 && (
                    <span className="text-xs font-semibold text-slate-400">
                      From
                    </span>
                  )}
                </div>
                {provider.options.map((opt) => (
                  <div
                    key={opt.label}
                    className={`flex items-center mt-0.5 ${test.methodLabel ? "justify-end" : "justify-between"}`}
                  >
                    {!test.methodLabel && (
                      <span className="text-sm text-slate-500">
                        {opt.label}
                      </span>
                    )}
                    <span className="font-heading text-[17px] font-extrabold text-brand-turquoise">
                      {opt.price}
                    </span>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {test.canonical && (
            <div className="px-5 pb-4 pt-1">
              <Link
                to="/compare/results"
                search={{ panel: test.canonical }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand-turquoise px-6 py-3 font-heading text-sm font-bold uppercase tracking-[0.08em] text-white shadow-[0_10px_24px_-12px_rgba(8,17,41,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-pink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink focus-visible:ring-offset-2"
              >
                Compare all providers
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}
          <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70">
            <p className="text-[11px] text-slate-500 text-center m-0">
              {formatVerified(test.lastScrapedAt)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveComparisonCard;
