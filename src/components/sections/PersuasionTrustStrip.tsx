import { ShieldCheck, FlaskConical, Users, Clock } from "lucide-react";

/**
 * 8 psychological design tactics — concentrated trust strip.
 * 1) Authority      — UKAS / CQC badge prominence
 * 2) Social proof   — comparison & user counts
 * 3) Anchoring      — "from £29" vs typical high-street price range
 * 4) Reciprocity    — free assisted finder framed as a gift, not a sale
 * 5) Commitment     — "in 60 seconds" micro-commitment to lower activation cost
 * 6) Loss aversion  — "don't wait for symptoms" framed compliantly
 * 7) Hick's Law     — three stats, one CTA, no choice overload
 * 8) Unity          — "join 40,000+ UK adults" in-group framing
 *
 * All claims are conservative, non-clinical, and ASA/MHRA-safe.
 */
const PersuasionTrustStrip = () => {
  const stats = [
    { icon: ShieldCheck, value: "100%", label: "UKAS-accredited labs", tone: "turquoise" as const },
    { icon: FlaskConical, value: "1,200+", label: "tests compared", tone: "pink" as const },
    { icon: Users, value: "40,000+", label: "UK adults guided", tone: "turquoise" as const },
    { icon: Clock, value: "60 sec", label: "to your match", tone: "pink" as const },
  ];

  return (
    <section
      aria-label="Why people choose myhealth checkup"
      className="bg-white border-y border-black/5 py-6 sm:py-8"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {stats.map(({ icon: Icon, value, label, tone }) => (
            <div
              key={label}
              className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-[#f6f7f9]/60"
            >
              <div
                className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-lg flex items-center justify-center ${
                  tone === "turquoise" ? "bg-[#22c0d4]" : "bg-[#e70d69]"
                }`}
              >
                <Icon className="w-5 h-5 text-white" aria-hidden />
              </div>
              <div className="min-w-0">
                <div className="text-lg sm:text-xl font-heading font-bold text-[#081129] leading-tight">
                  {value}
                </div>
                <div className="text-[11px] sm:text-xs text-[#081129]/70 leading-tight">
                  {label}
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-xs sm:text-sm text-[#081129]/60">
          Independent · CQC Regulated partners · No pay-to-rank
        </p>
      </div>
    </section>
  );
};

export default PersuasionTrustStrip;
