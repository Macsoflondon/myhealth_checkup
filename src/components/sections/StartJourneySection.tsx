import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import LiveComparisonCard, {
  DEFAULT_LIVE_COMPARISON_PANELS,
  type LiveComparisonPanelData,
} from "@/components/sections/LiveComparisonCard";
import { supabase } from "@/integrations/supabase/client";

// ── Hardcoded fallback (used only if DB fetch fails) ────────────────────────
const FALLBACK_RIGHT: LiveComparisonPanelData[] = [
  {
    name: "Full Blood Count Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£59" }, { label: "Clinic-based", price: "£59" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£89" }, { label: "Clinic-based", price: "£99" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£59" }, { label: "Clinic-based", price: "£65" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£75" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£155" }, { label: "Clinic-based", price: "£129" }] },
    ],
  },
];

const SYNC_ROTATE_MS = 30000;

type DbRow = { name: string; bio?: string; price: string; url?: string };
type DbPanel = {
  slug: string;
  panel_name: string;
  display_order: number;
  rows: DbRow[] | null;
  last_scraped_at: string | null;
};

function dbPanelToPanelData(p: DbPanel): LiveComparisonPanelData {
  return {
    name: p.panel_name,
    lastScrapedAt: p.last_scraped_at,
    providers: (p.rows ?? []).map((r) => {
      // Extract a label from bio (e.g. "At-home kit · UKAS · 24–48h" → "At-home kit")
      const label = (r.bio?.split("·")[0]?.trim()) || "Test";
      return {
        name: r.name,
        options: [{ label, price: r.price }],
      };
    }),
  };
}

const StartJourneySection = () => {
  const [dbPanels, setDbPanels] = useState<LiveComparisonPanelData[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase
        .from("live_comparison_panels")
        .select("slug, panel_name, display_order, rows, last_scraped_at")
        .order("display_order", { ascending: true });
      if (cancelled || error || !data?.length) return;
      setDbPanels((data as unknown as DbPanel[]).map(dbPanelToPanelData));
    })();
    return () => { cancelled = true; };
  }, []);

  // Split panels evenly between the two cards; fall back to defaults.
  const { leftPanels, rightPanels } = useMemo(() => {
    if (dbPanels && dbPanels.length >= 2) {
      const mid = Math.ceil(dbPanels.length / 2);
      return { leftPanels: dbPanels.slice(0, mid), rightPanels: dbPanels.slice(mid) };
    }
    return { leftPanels: DEFAULT_LIVE_COMPARISON_PANELS, rightPanels: FALLBACK_RIGHT };
  }, [dbPanels]);

  const maxLen = Math.max(leftPanels.length, rightPanels.length);
  const [syncIdx, setSyncIdx] = useState(0);
  useEffect(() => {
    if (maxLen <= 1) return;
    const interval = setInterval(() => setSyncIdx((i) => (i + 1) % maxLen), SYNC_ROTATE_MS);
    return () => clearInterval(interval);
  }, [maxLen]);




  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16">
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6">

        {/* ── ROW 1 — Take Control (full width, horizontal) ─────────────── */}
        <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_-20px_rgba(8,17,41,0.35),0_8px_24px_-8px_rgba(8,17,41,0.18)] ring-1 ring-slate-200/60 overflow-hidden mb-8 lg:mb-12 transition-transform duration-700 ease-out hover:-translate-y-1">
          <div className="p-6 sm:p-8 md:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">

            {/* Left: text */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
                <span className="text-base sm:text-lg font-semibold uppercase tracking-[0.25em] text-brand-turquoise">
                  Start Your Journey
                </span>
                <div className="h-px w-8 sm:w-12 bg-brand-pink" />
              </div>
              <h2 className="font-heading font-bold text-[#081129] leading-[1.15] tracking-tight text-3xl sm:text-[2.25rem] lg:text-[2.5rem] mb-3">
                Take Control of Your Health Today
              </h2>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Compare trusted, accredited tests from leading UK providers in minutes.
              </p>
            </div>

            {/* Right: CTAs side-by-side */}
            <div className="flex flex-col sm:flex-row lg:flex-row gap-3 lg:flex-shrink-0 lg:max-w-[640px] w-full lg:w-auto">
              <Link
                to="/assisted-test-finder"
                className="flex-1 h-[60px] inline-flex items-center justify-center px-6 bg-[#22c0d4] hover:bg-[#1da9bc] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(34,192,212,0.5)] hover:shadow-[0_10px_32px_-8px_rgba(34,192,212,0.6)] transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Find your test
              </Link>
              <Link
                to="/compare/goals"
                className="flex-1 h-[60px] inline-flex items-center justify-center px-6 bg-[#e70d69] hover:bg-[#c50a5a] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(231,13,105,0.45)] hover:shadow-[0_10px_32px_-8px_rgba(231,13,105,0.55)] transition-all active:scale-[0.98] whitespace-nowrap"
              >
                Compare by goal
              </Link>
              <Link
                to="/compare"
                className="flex-1 h-[60px] inline-flex items-center justify-center px-6 bg-white border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold text-base rounded-full transition-colors active:scale-[0.98] whitespace-nowrap"
              >
                Browse all tests
              </Link>
            </div>
          </div>
        </div>
        {/* ── ROW 2 — Two Live Comparison panels ─────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
          <LiveComparisonCard panels={LEFT_PANELS} panelIndex={syncIdx} />
          <LiveComparisonCard panels={RIGHT_PANELS} panelIndex={syncIdx} />

        </div>
      </div>
    </section>
  );
};

export default StartJourneySection;

