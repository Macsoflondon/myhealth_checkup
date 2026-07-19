import { useEffect, useState } from "react";
import type { LiveComparisonPanel } from "@/hooks/useLiveComparisonPanel";

export type LiveComparisonPanelData = LiveComparisonPanel;

interface LiveComparisonCardProps {
  panels: LiveComparisonPanel[];
  rotateMs?: number;
  eyebrow?: string;
  className?: string;
  /** When provided, disables internal rotation and uses this index instead. */
  panelIndex?: number;
}

function formatVerified(iso: string | null): string {
  if (!iso) return "Prices refreshed automatically from provider websites. Always confirm current pricing before booking.";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "Prices refreshed automatically from provider websites. Always confirm current pricing before booking.";
  const diffMs = Date.now() - then;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  let when: string;
  if (hours < 1) when = "in the last hour";
  else if (hours < 24) when = `${hours} hour${hours === 1 ? "" : "s"} ago`;
  else if (days === 1) when = "yesterday";
  else if (days < 7) when = `${days} days ago`;
  else {
    when = new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  return `Prices verified ${when} from provider websites. Always confirm current pricing before booking.`;
}

const LiveComparisonCard = ({
  panels,
  rotateMs = 60000,
  eyebrow = "Live Comparison",
  className = "",
  panelIndex,
}: LiveComparisonCardProps) => {
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

  if (!panels.length) return null;
  const idx = controlled ? (panelIndex! % panels.length) : internalIdx;
  const panel = panels[idx];
  if (!panel) return null;

  const rows = Array.isArray(panel.rows) ? panel.rows : [];

  return (
    <div
      className={`relative bg-white rounded-[2rem] border border-slate-200 shadow-[0_30px_80px_-20px_rgba(8,17,41,0.35),0_8px_24px_-8px_rgba(8,17,41,0.18)] ring-1 ring-slate-200/60 overflow-hidden h-full transition-transform duration-700 ease-out hover:-translate-y-1 ${className}`}
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
          className="font-heading font-bold text-[#081129] tracking-tight text-2xl sm:text-3xl text-center mb-6 transition-all duration-500 ease-in-out"
          style={{ opacity: fading ? 0 : 1 }}
        >
          {panel.panel_name}
        </h3>

        <div
          className="flex-1 flex flex-col transition-all duration-500 ease-in-out"
          style={{
            opacity: fading ? 0 : 1,
            border: "1px solid rgba(8,17,41,0.08)",
            borderRadius: "20px",
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(8,17,41,0.07)", background: "#fafbfc" }}>
            <span style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.16em", color: "#22c0d4" }}>
              {panel.panel_name}
            </span>
          </div>

          <div className="flex-1" style={{ padding: "0 20px" }}>
            {rows.map((row, i) => (
              <div
                key={`${row.name}-${i}`}
                style={{
                  paddingTop: "14px",
                  paddingBottom: "14px",
                  borderBottom: i === rows.length - 1 ? "none" : "1px solid rgba(8,17,41,0.07)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                  <span className="font-heading" style={{ fontSize: "16px", fontWeight: 700, color: "#081129" }}>
                    {row.name}
                  </span>
                  <span className="font-heading" style={{ fontSize: "17px", fontWeight: 800, color: "#081129" }}>
                    {row.price}
                  </span>
                </div>
                {row.bio && (
                  <div style={{ fontSize: "13px", color: "rgba(8,17,41,0.55)" }}>{row.bio}</div>
                )}
              </div>
            ))}
          </div>

          <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(8,17,41,0.07)", background: "#fafbfc" }}>
            <p style={{ fontSize: "11px", color: "rgba(8,17,41,0.4)", textAlign: "center", margin: 0 }}>
              {formatVerified(panel.last_scraped_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveComparisonCard;
