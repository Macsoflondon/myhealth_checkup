import { Link } from "react-router-dom";
import { useLiveComparisonPanel } from "@/hooks/useLiveComparisonPanel";

type BadgeVariant = "teal" | "pink" | "neutral";

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  teal: { background: "rgba(34,192,212,0.12)", color: "#22c0d4" },
  pink: { background: "rgba(231,13,105,0.12)", color: "#e70d69" },
  neutral: { background: "rgba(8,17,41,0.06)", color: "rgba(8,17,41,0.55)" },
};

const FALLBACK_PANEL = {
  panel_name: "Full Blood Count Panel",
  rows: [
    { name: "Medichecks", bio: "At-home kit · UKAS · 24–48h", badge: "UKAS", variant: "teal" as const, price: "£29" },
    { name: "Thriva", bio: "At-home kit · Subscription option", badge: "AT-HOME", variant: "neutral" as const, price: "£39" },
    { name: "Randox Health", bio: "Clinic-based · UKAS · 48–72h", badge: "POPULAR", variant: "pink" as const, price: "£49" },
    { name: "Goodbody Health", bio: "Walk-in UK clinics · CQC", badge: "WALK-IN", variant: "neutral" as const, price: "£55" },
    { name: "London Medical Laboratory", bio: "Walk-in London · ISO 15189", badge: "UKAS", variant: "teal" as const, price: "£65" },
  ],
};

const StartJourneySection = () => {
  const livePanel = useLiveComparisonPanel();
  const panel = livePanel ?? FALLBACK_PANEL;
  const providers = panel.rows;

  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16">
      <style>{`
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-card { animation: float-card 5s ease-in-out infinite; }
      `}</style>
      <div className="max-w-[1480px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-stretch">
          {/* Left column — Start Your Journey */}
          <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_12px_60px_-16px_rgba(8,17,41,0.14)] overflow-hidden h-full">
            <div className="p-6 sm:p-8 md:p-10 flex flex-col items-center text-center h-full">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-5">
                <div className="h-px w-9 bg-slate-200" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
                  Start Your Journey
                </span>
                <div className="h-px w-9 bg-slate-200" />
              </div>

              {/* Heading */}
              <h2 className="font-heading font-bold text-[#081129] leading-[1.15] tracking-tight text-3xl sm:text-[2.25rem] mb-4">
                Take Control of Your<br />Health Today
              </h2>
              <p className="text-base sm:text-lg text-slate-500 leading-relaxed max-w-md mb-6">
                Compare trusted, accredited tests from leading UK providers in minutes.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col w-full gap-3 mt-auto">
                <Link
                  to="/assisted-test-finder"
                  className="w-full h-[60px] inline-flex items-center justify-center bg-[#22c0d4] hover:bg-[#1da9bc] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(34,192,212,0.5)] hover:shadow-[0_10px_32px_-8px_rgba(34,192,212,0.6)] transition-all active:scale-[0.98]"
                >
                  Find your test
                </Link>
                <Link
                  to="/compare/goals"
                  className="w-full h-[60px] inline-flex items-center justify-center bg-[#e70d69] hover:bg-[#c50a5a] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(231,13,105,0.45)] hover:shadow-[0_10px_32px_-8px_rgba(231,13,105,0.55)] transition-all active:scale-[0.98]"
                >
                  Compare by goal
                </Link>
                <Link
                  to="/compare"
                  className="w-full h-[60px] inline-flex items-center justify-center bg-white border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold text-base rounded-full transition-colors active:scale-[0.98]"
                >
                  Browse all tests
                </Link>
              </div>
            </div>
          </div>

          {/* Right column — Live Comparison */}
          <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_12px_60px_-16px_rgba(8,17,41,0.14)] overflow-hidden h-full">
            <div className="p-6 sm:p-8 md:p-10 flex flex-col h-full">
              {/* Eyebrow row */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <div className="h-px w-9 bg-slate-200" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
                  Live Comparison
                </span>
                <div className="h-px w-9 bg-slate-200" />
              </div>

              <h3 className="font-heading font-bold text-[#081129] leading-[1.15] tracking-tight text-3xl sm:text-[2.25rem] text-center mb-6">
                Compare at a Glance
              </h3>

              <div
                className="float-card flex-1 flex flex-col"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(8,17,41,0.08)",
                  borderRadius: "20px",
                  padding: "24px",
                  boxShadow: "0 12px 40px -16px rgba(8,17,41,0.12)",
                }}
              >
                <div style={{ paddingBottom: "14px", borderBottom: "1px solid rgba(8,17,41,0.08)" }}>
                  <span
                    style={{
                      fontSize: "13px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.14em",
                      color: "#22c0d4",
                    }}
                  >
                    Updated regularly — {panel.panel_name}
                  </span>
                </div>

                {providers.map((p, i) => (
                  <div
                    key={p.name}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr auto auto",
                      gap: "14px",
                      alignItems: "center",
                      padding: "12px 0",
                      borderBottom:
                        i === providers.length - 1
                          ? "none"
                          : "1px solid rgba(8,17,41,0.06)",
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <div
                        className="font-heading"
                        style={{ fontSize: "16px", fontWeight: 700, color: "#081129" }}
                      >
                        {p.name}
                      </div>
                      <div
                        style={{
                          fontSize: "13px",
                          color: "rgba(8,17,41,0.55)",
                          marginTop: "2px",
                        }}
                      >
                        {p.bio}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        borderRadius: "20px",
                        padding: "4px 10px",
                        whiteSpace: "nowrap",
                        ...badgeStyles[p.variant],
                      }}
                    >
                      {p.badge}
                    </span>
                    <div
                      className="font-heading"
                      style={{
                        fontSize: "18px",
                        fontWeight: 800,
                        color: "#081129",
                        textAlign: "right",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {p.price}
                    </div>
                  </div>
                ))}

                <div style={{ borderTop: "1px solid rgba(8,17,41,0.06)", paddingTop: "14px", marginTop: "auto" }}>
                  <p
                    style={{
                      fontSize: "12px",
                      color: "rgba(8,17,41,0.45)",
                      textAlign: "center",
                      margin: 0,
                    }}
                  >
                    Prices sourced directly from provider websites. Always verify before booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StartJourneySection;
