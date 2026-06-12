import { Link } from "react-router-dom";

type BadgeVariant = "teal" | "pink" | "neutral";

const badgeStyles: Record<BadgeVariant, React.CSSProperties> = {
  teal: { background: "rgba(34,192,212,0.15)", color: "#22c0d4" },
  pink: { background: "rgba(231,13,105,0.15)", color: "#e70d69" },
  neutral: { background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.55)" },
};

const providers: Array<{
  name: string;
  bio: string;
  badge: string;
  variant: BadgeVariant;
  price: string;
}> = [
  { name: "Medichecks", bio: "At-home kit · UKAS · 24–48h", badge: "UKAS", variant: "teal", price: "£29" },
  { name: "Thriva", bio: "At-home kit · Subscription option", badge: "AT-HOME", variant: "neutral", price: "£39" },
  { name: "Randox Health", bio: "Clinic-based · UKAS · 48–72h", badge: "POPULAR", variant: "pink", price: "£49" },
  { name: "Goodbody Health", bio: "Walk-in UK clinics · CQC", badge: "WALK-IN", variant: "neutral", price: "£55" },
  { name: "London Medical Laboratory", bio: "Walk-in London · ISO 15189", badge: "UKAS", variant: "teal", price: "£65" },
  { name: "Lola Health", bio: "Women's health · CQC · 48–72h", badge: "CQC", variant: "pink", price: "£89" },
  { name: "Medichecks", bio: "Advanced thyroid panel · UKAS", badge: "UKAS", variant: "teal", price: "£45" },
  { name: "Thriva", bio: "Heart health panel · UKAS", badge: "UKAS", variant: "teal", price: "£49" },
  { name: "Randox Health", bio: "Vitamin D & B12 · UKAS", badge: "UKAS", variant: "teal", price: "£79" },
  { name: "Goodbody Health", bio: "Health MOT · full screen · CQC", badge: "CQC", variant: "pink", price: "£149" },
];

const StartJourneySection = () => {
  return (
    <section className="w-full bg-gradient-to-b from-slate-50 to-white py-12 sm:py-16">
      <style>{`
        @keyframes float-card {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .float-card { animation: float-card 5s ease-in-out infinite; }
      `}</style>
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column — existing card unchanged */}
          <div className="relative bg-white rounded-3xl border border-slate-100 shadow-[0_8px_40px_-12px_rgba(8,17,41,0.12)] overflow-hidden">
            <div className="p-8 sm:p-10 flex flex-col items-center text-center">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-5">
                <div className="h-px w-6 bg-slate-200" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
                  Start Your Journey
                </span>
                <div className="h-px w-6 bg-slate-200" />
              </div>

              {/* Heading */}
              <h2 className="font-heading font-bold text-[#081129] leading-[1.15] tracking-tight text-2xl sm:text-3xl mb-3">
                Take Control of Your<br />Health Today
              </h2>
              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xs mb-8">
                Compare trusted, accredited tests from leading UK providers in minutes.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col w-full gap-3 mb-8">
                <Link
                  to="/assisted-test-finder"
                  className="w-full h-12 inline-flex items-center justify-center bg-[#22c0d4] hover:bg-[#1da9bc] text-white font-semibold text-sm rounded-full shadow-[0_6px_20px_-6px_rgba(34,192,212,0.5)] hover:shadow-[0_8px_24px_-6px_rgba(34,192,212,0.6)] transition-all active:scale-[0.98]"
                >
                  Find your test
                </Link>
                <Link
                  to="/compare/goals"
                  className="w-full h-12 inline-flex items-center justify-center bg-[#e70d69] hover:bg-[#c50a5a] text-white font-semibold text-sm rounded-full shadow-[0_6px_20px_-6px_rgba(231,13,105,0.45)] hover:shadow-[0_8px_24px_-6px_rgba(231,13,105,0.55)] transition-all active:scale-[0.98]"
                >
                  Compare by goal
                </Link>
                <Link
                  to="/compare"
                  className="w-full h-12 inline-flex items-center justify-center bg-white border-2 border-[#081129] text-[#081129] hover:bg-[#081129] hover:text-white font-semibold text-sm rounded-full transition-colors active:scale-[0.98]"
                >
                  Browse all tests
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col items-center gap-3 w-full">
                <div className="flex items-center gap-2">
                  <div className="h-px w-6 bg-slate-200" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                    Trust Indicators
                  </span>
                  <div className="h-px w-6 bg-slate-200" />
                </div>
                <div className="flex flex-wrap justify-center items-center gap-x-5 gap-y-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#22c0d4]" />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-600">Independent</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#e70d69]" />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-600">CQC Regulated</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#081129]" />
                    <span className="text-[11px] sm:text-xs font-medium text-slate-600">Typical 3–5 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Accent Bar */}
            <div className="h-1.5 w-full flex" aria-hidden="true">
              <div className="h-full flex-1 bg-[#22c0d4]" />
              <div className="h-full flex-1 bg-[#e70d69]" />
              <div className="h-full flex-1 bg-[#081129]" />
            </div>
          </div>

          {/* Right column — Live Comparison */}
          <div>
            {/* Eyebrow row */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <hr
                className="flex-1 border-0 h-px"
                style={{
                  maxWidth: "60px",
                  background: "linear-gradient(to right, transparent, rgba(34,192,212,0.35))",
                }}
              />
              <span
                style={{
                  color: "#22c0d4",
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                }}
              >
                Updated regularly
              </span>
              <hr
                className="flex-1 border-0 h-px"
                style={{
                  maxWidth: "60px",
                  background: "linear-gradient(to right, rgba(34,192,212,0.35), transparent)",
                }}
              />
            </div>

            <h3
              className="font-heading text-center mb-6"
              style={{ fontWeight: 700, color: "#081129", fontSize: "24px" }}
            >
              Compare at a glance.
            </h3>

            <div
              className="float-card"
              style={{
                background: "rgba(8,17,41,0.97)",
                border: "1px solid rgba(34,192,212,0.2)",
                borderRadius: "16px",
                padding: "24px",
                boxShadow: "0 20px 60px rgba(8,17,41,0.25)",
              }}
            >
              <div
                style={{
                  paddingBottom: "12px",
                  borderBottom: "1px solid rgba(34,192,212,0.14)",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: "#22c0d4",
                  }}
                >
                  Live Comparison — Full Blood Count Panel
                </span>
              </div>

              {providers.map((p, i) => (
                <div
                  key={p.name}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto",
                    gap: "12px",
                    alignItems: "center",
                    padding: "11px 0",
                    borderBottom:
                      i === providers.length - 1
                        ? "none"
                        : "1px solid rgba(255,255,255,0.055)",
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      className="font-heading"
                      style={{ fontSize: "13px", fontWeight: 700, color: "#ffffff" }}
                    >
                      {p.name}
                    </div>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "rgba(255,255,255,0.42)",
                        marginTop: "2px",
                      }}
                    >
                      {p.bio}
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      borderRadius: "20px",
                      padding: "3px 8px",
                      whiteSpace: "nowrap",
                      ...badgeStyles[p.variant],
                    }}
                  >
                    {p.badge}
                  </span>
                  <div
                    className="font-heading"
                    style={{
                      fontSize: "15px",
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
                  paddingTop: "12px",
                  marginTop: 0,
                }}
              >
                <p
                  style={{
                    fontSize: "10px",
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
