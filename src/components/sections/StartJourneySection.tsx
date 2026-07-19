import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import LiveComparisonCard from "@/components/sections/LiveComparisonCard";
import type { LiveComparisonPanel } from "@/hooks/useLiveComparisonPanel";

const SYNC_ROTATE_MS = 30000;

async function fetchAllPanels(): Promise<LiveComparisonPanel[]> {
  const { data, error } = await supabase
    .from("live_comparison_panels")
    .select("slug, panel_name, display_order, rows, last_scraped_at")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as LiveComparisonPanel[];
}

const StartJourneySection = () => {
  const { data: allPanels = [] } = useQuery({
    queryKey: ["live-comparison-panels"],
    queryFn: fetchAllPanels,
    staleTime: 5 * 60 * 1000,
  });

  const { leftPanels, rightPanels } = useMemo(() => {
    // Interleave into two columns so both cards rotate through the full catalogue
    // without ever showing the same test in both at once.
    const left: LiveComparisonPanel[] = [];
    const right: LiveComparisonPanel[] = [];
    allPanels.forEach((p, i) => (i % 2 === 0 ? left : right).push(p));
    return { leftPanels: left, rightPanels: right };
  }, [allPanels]);

  const maxLen = Math.max(leftPanels.length, rightPanels.length, 1);
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
        {allPanels.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
            {leftPanels.length > 0 && (
              <LiveComparisonCard panels={leftPanels} panelIndex={syncIdx} />
            )}
            {rightPanels.length > 0 && (
              <LiveComparisonCard panels={rightPanels} panelIndex={syncIdx} />
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default StartJourneySection;
