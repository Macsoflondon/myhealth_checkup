import { useEffect, useState } from "react";

export type LiveComparisonPanelData = {
  name: string;
  providers: {
    name: string;
    options: { label: string; price: string }[];
  }[];
};

// Default 4-panel rotation for the standalone instance.
// Prices mirror the source-of-truth `TESTS` array in StartJourneySection.
export const DEFAULT_LIVE_COMPARISON_PANELS: LiveComparisonPanelData[] = [
  {
    name: "Male Hormone Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£99" }, { label: "Clinic-based", price: "£159" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£155" }, { label: "Clinic-based", price: "£139" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£117" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£139" }, { label: "Clinic-based", price: "£169" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£89" }, { label: "Clinic-based", price: "£99" }] },
    ],
  },
  {
    name: "Female Hormone Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£109" }, { label: "Clinic-based", price: "£169" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£165" }, { label: "Clinic-based", price: "£149" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£127" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£149" }, { label: "Clinic-based", price: "£179" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£95" }, { label: "Clinic-based", price: "£109" }] },
    ],
  },
  {
    name: "Thyroid Health Panel",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£45" }, { label: "Clinic-based", price: "£89" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£102" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£59" }, { label: "Clinic-based", price: "£99" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£55" }, { label: "Clinic-based", price: "£69" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£79" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£139" }, { label: "Clinic-based", price: "£119" }] },
    ],
  },
  {
    name: "Vitamin D Test",
    providers: [
      { name: "Medichecks", options: [{ label: "At-home kit", price: "£29" }, { label: "Clinic-based", price: "£49" }] },
      { name: "Thriva", options: [{ label: "At-home kit", price: "£45" }] },
      { name: "Randox Health", options: [{ label: "At-home kit", price: "£35" }, { label: "Clinic-based", price: "£45" }] },
      { name: "Goodbody Health", options: [{ label: "At-home kit", price: "£39" }, { label: "Clinic-based", price: "£45" }] },
      { name: "London Medical Laboratory", options: [{ label: "Clinic-based", price: "£49" }] },
      { name: "Lola Health", options: [{ label: "At-home nurse visit", price: "£89" }, { label: "Clinic-based", price: "£75" }] },
    ],
  },
];

interface LiveComparisonCardProps {
  panels: LiveComparisonPanelData[];
  rotateMs?: number;
  eyebrow?: string;
  className?: string;
}

const LiveComparisonCard = ({
  panels,
  rotateMs = 60000,
  eyebrow = "Live Comparison",
  className = "",
}: LiveComparisonCardProps) => {
  const [idx, setIdx] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (panels.length <= 1) return;
    const interval = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setIdx((i) => (i + 1) % panels.length);
        setFading(false);
      }, 500);
    }, rotateMs);
    return () => clearInterval(interval);
  }, [panels.length, rotateMs]);

  const test = panels[idx];
  if (!test) return null;

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
          {test.name}
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
              {test.name}
            </span>
          </div>

          <div className="flex-1" style={{ padding: "0 20px" }}>
            {test.providers.map((provider, pi) => {
              const multiPrice = provider.options.length > 1;
              return (
                <div
                  key={provider.name}
                  style={{
                    paddingTop: "14px",
                    paddingBottom: "14px",
                    borderBottom: pi === test.providers.length - 1 ? "none" : "1px solid rgba(8,17,41,0.07)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "4px" }}>
                    <span className="font-heading" style={{ fontSize: "16px", fontWeight: 700, color: "#081129" }}>
                      {provider.name}
                    </span>
                    {multiPrice && (
                      <span style={{ fontSize: "12px", fontWeight: 600, color: "rgba(8,17,41,0.45)", letterSpacing: "0.02em" }}>
                        From
                      </span>
                    )}
                  </div>

                  {provider.options.map((opt) => (
                    <div key={opt.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "2px" }}>
                      <span style={{ fontSize: "14px", color: "rgba(8,17,41,0.55)" }}>{opt.label}</span>
                      <span className="font-heading" style={{ fontSize: "17px", fontWeight: 800, color: "#081129" }}>
                        {opt.price}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div style={{ padding: "12px 20px", borderTop: "1px solid rgba(8,17,41,0.07)", background: "#fafbfc" }}>
            <p style={{ fontSize: "11px", color: "rgba(8,17,41,0.4)", textAlign: "center", margin: 0 }}>
              Prices verified June 2026 from provider websites. Always confirm current pricing before booking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveComparisonCard;
