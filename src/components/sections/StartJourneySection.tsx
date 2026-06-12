import { Link } from "react-router-dom";
import { useLiveComparisonPanel } from "@/hooks/useLiveComparisonPanel";

type BadgeVariant = "teal" | "pink" | "neutral";

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  teal: { background: "rgba(34,192,212,0.15)", color: "#22c0d4" },
  pink: { background: "rgba(231,13,105,0.15)", color: "#e70d69" },
  neutral: { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" },
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
      <div className="max-w-[2250px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 lg:gap-[144px] items-center">
          {/* Left column — existing card unchanged */}
          <div className="relative bg-white rounded-[2rem] border border-slate-100 shadow-[0_12px_60px_-16px_rgba(8,17,41,0.14)] overflow-hidden">
            <div className="p-12 sm:p-[60px] flex flex-col items-center text-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px w-9 bg-slate-200" />
                <span className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
                  Start Your Journey
                </span>
                <div className="h-px w-9 bg-slate-200" />
              </div>

              {/* Heading */}
              <h2 className="font-heading font-bold text-[#081129] leading-[1.15] tracking-tight text-3xl sm:text-[2.625rem] mb-4">
                Take Control of Your<br />Health Today
              </h2>
              <p className="text-base sm:text-xl text-slate-500 leading-relaxed max-w-sm mb-8">
                Compare trusted, accredited tests from leading UK providers in minutes.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col w-full gap-4 mb-12">
                <Link
                  to="/assisted-test-finder"
                  className="w-full h-[72px] inline-flex items-center justify-center bg-[#22c0d4] hover:bg-[#1da9bc] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(34,192,212,0.5)] hover:shadow-[0_10px_32px_-8px_rgba(34,192,212,0.6)] transition-all active:scale-[0.98]"
                >
                  Find your test
                </Link>
                <Link
                  to="/compare/goals"
                  className="w-full h-[72px] inline-flex items-center justify-center bg-[#e70d69] hover:bg-[#c50a5a] text-white font-semibold text-base rounded-full shadow-[0_8px_28px_-8px_rgba(231,13,105,0.45)] hover:shadow-[0_10px_32px_-8px_rgba(231,13,105,0.55)] transition-all active:scale-[0.98]"
                >
                  Compare by goal
                </Link>
                <Link
                  to="/compare"
                  className="w-full h-[72px] inline-flex items-center justify-center bg-white border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold text-base rounded-full transition-colors active:scale-[0.98]"
                >
                  Browse all tests
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col items-center gap-4 w-full">
                <div className="flex items-center gap-3">
                  <div className="h-px w-9 bg-slate-200" />
                  <span className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
                    Trust Indicators
                  </span>
                  <div className="h-px w-9 bg-slate-200" />
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-7 gap-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#22c0d4]" />
                    <span className="text-sm sm:text-base font-medium text-slate-600">Independent</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#e70d69]" />
                    <span className="text-sm sm:text-base font-medium text-slate-600">CQC Regulated</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#081129]" />
                    <span className="text-sm sm:text-base font-medium text-slate-600">Typical 3–5 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Accent Bar */}
            <div className="h-[9px] w-full flex" aria-hidden="true">
              <div className="h-full flex-1 bg-[#22c0d4]" />
              <div className="h-full flex-1 bg-[#e70d69]" />
              <div className="h-full flex-1 bg-[#081129]" />
            </div>
          </div>

          {/* Right column — Live Comparison */}
          <div>
            {/* Eyebrow row */}
            <div className="flex items-center justify-center gap-4 mb-5">
              <hr
                className="flex-1 border-0 h-px"
                style={{
                  maxWidth: "90px",
                  background: "linear-gradient(to right, transparent, rgba(34,192,212,0.35))",
                }}
              />
              <span
                style={{
                  color: "#22c0d4",
                  fontSize: "15px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                Live Comparison
              </span>
              <hr
                className="flex-1 border-0 h-px"
                style={{
                  maxWidth: "90px",
                  background: "linear-gradient(to right, rgba(34,192,212,0.35), transparent)",
                }}
              />
            </div>

            <h3
              className="font-heading text-center mb-9"
              style={{ fontWeight: 700, color: "#081129", fontSize: "36px" }}
            >
              Compare at a glance.
            </h3>

            <div
              className="float-card"
              style={{
                background: "rgba(8,17,41,0.97)",
                border: "1px solid rgba(34,192,212,0.2)",
                borderRadius: "24px",
                padding: "36px",
                boxShadow: "0 30px 90px rgba(8,17,41,0.28)",
              }}
            >
              <div
                style={{
                  paddingBottom: "18px",
                  borderBottom: "1px solid rgba(34,192,212,0.14)",
                }}
              >
                <span
                  style={{
                    fontSize: "16.5px",
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
                    gap: "18px",
                    alignItems: "center",
                    padding: "16.5px 0",
                    borderBottom:
                      i === providers.length - 1
                        ? "none"
                        : "1px solid rgba(255,255,255,0.055)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      className="font-heading"
                      style={{ fontSize: "19.5px", fontWeight: 700, color: "#ffffff" }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "16.5px",
                        color: "rgba(255,255,255,0.42)",
                        marginTop: "3px",
                      }}
                    >
                      {p.bio}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderRadius: "20px",
                      padding: "5px 12px",
                      whiteSpace: "nowrap",
                      ...badgeStyles[p.variant],
                    }}
                  >
                    {p.badge}
                  </span>
                  <div
                    className="font-heading"
                    style={{
                      fontSize: "22.5px",
                      fontWeight: 800,
                      color: "#ffffff",
                      textAlign: "right",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {p.price}
                  </div>
                </div>
              ))}

              <div
                style={{
                  borderTop: "1px solid rgba(34,192,212,0.1)",
                  paddingTop: "18px",
                  marginTop: 0,
                }}
              >
                <p
                  style={{
                    fontSize: "15px",
                    color: "rgba(255,255,255,0.28)",
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
    </section>
  );
};

export default StartJourneySection;
