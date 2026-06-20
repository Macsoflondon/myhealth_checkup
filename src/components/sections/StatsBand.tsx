import { Link } from "react-router-dom";
import { ArrowRight, Heart, User, UserCheck, Droplet, Stethoscope, FlaskConical, Pill, Baby, Activity, ShieldCheck, Zap } from "lucide-react";

const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";
const NAVY = "#081129";

// Category routes are the REAL paths from your testRoutes.tsx
const CATEGORIES = [
  { label: "Women's Health", to: "/tests/womens-health", Icon: UserCheck, color: PINK },
  { label: "Men's Health", to: "/tests/mens-health", Icon: User, color: "#3a5f85" },
  { label: "Heart", to: "/tests/heart", Icon: Heart, color: "#ef4444" },
  { label: "Diabetes", to: "/tests/diabetes", Icon: Droplet, color: "#f59e0b" },
  { label: "Thyroid", to: "/thyroid", Icon: Stethoscope, color: "#7c3aed" },
  { label: "Hormones", to: "/hormones", Icon: FlaskConical, color: PINK },
  { label: "Vitamins", to: "/tests/vitamins", Icon: Pill, color: "#16a34a" },
  { label: "Fertility", to: "/fertility-tests", Icon: Baby, color: "#ec4899" },
  { label: "General Health", to: "/test/general-health", Icon: Activity, color: TURQUOISE },
  { label: "Cancer Screening", to: "/tests/cancer", Icon: ShieldCheck, color: "#0ea5e9" },
];

const STATS = [
  { value: "100%", label: "UKAS-accredited labs", Icon: ShieldCheck, color: TURQUOISE },
  { value: "200+", label: "Tests to compare", Icon: FlaskConical, color: PINK },
  { value: "No GP", label: "Referral needed", Icon: Stethoscope, color: "#3a5f85" },
  { value: "60 sec", label: "To compare & decide", Icon: Zap, color: "#16a34a" },
];

export default function StatsBand() {
  return (
    <section className="rounded-[28px] overflow-hidden bg-[#f7f7f8] border border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-6 sm:px-[30px] pt-[30px] pb-8">
      {/* 1 · category nav */}
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] font-[Montserrat] text-[#081129]/50">Browse by category</span>
        <Link to="/test-categories" className="inline-flex items-center gap-1.5 text-[12.5px] font-bold text-[#22c0d4] no-underline font-[Montserrat]">
          View all <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Link>
      </div>
      <div className="flex gap-2.5 flex-wrap mb-[26px]">
        {CATEGORIES.map(({ label, to, Icon, color }) => (
          <Link key={label} to={to}
            className="group inline-flex items-center gap-2.5 pl-[11px] pr-[15px] py-[9px] rounded-full no-underline bg-white border-[1.5px] border-[#081129]/10 hover:-translate-y-0.5 transition-all duration-200"
            style={{ ["--c" as string]: color }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = color; e.currentTarget.style.boxShadow = `0 8px 20px ${color}26`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(8,17,41,0.1)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(8,17,41,0.04)"; }}>
            <span className="w-[26px] h-[26px] rounded-full inline-flex items-center justify-center shrink-0" style={{ background: `${color}1a` }}>
              <Icon className="w-[15px] h-[15px]" style={{ color }} strokeWidth={2} />
            </span>
            <span className="text-[13.5px] font-semibold text-[#081129] font-[Montserrat]">{label}</span>
          </Link>
        ))}
      </div>

      {/* 2 · trust-stat tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mb-[26px]">
        {STATS.map(({ value, label, Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-[#081129]/[0.08] p-[18px] shadow-[0_4px_16px_rgba(8,17,41,0.05)]">
            <span className="w-[38px] h-[38px] rounded-[11px] inline-flex items-center justify-center mb-3" style={{ background: `${color}14` }}>
              <Icon className="w-[19px] h-[19px]" style={{ color }} strokeWidth={2} />
            </span>
            <div className="font-extrabold text-[26px] tracking-[-0.02em] text-[#081129] leading-none font-[Montserrat]">{value}</div>
            <div className="text-[13px] text-[#081129]/55 mt-[5px] font-[Lato]">{label}</div>
          </div>
        ))}
      </div>

      {/* 3 · navy asset band */}
      <div className="relative overflow-hidden rounded-[22px] bg-[#081129] px-[34px] py-[30px] flex items-center justify-between gap-6 flex-wrap">
        <div className="absolute -right-[50px] -top-[60px] w-[220px] h-[220px] rounded-full bg-[#22c0d4]/[0.12]" />
        <div className="absolute right-[120px] -bottom-[90px] w-[200px] h-[200px] rounded-full bg-[#e70d69]/10" />
        <div className="relative max-w-[560px]">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#22c0d4] font-[Montserrat]">Why test privately</span>
          <h2 className="font-extrabold text-[clamp(1.6rem,3vw,2.3rem)] tracking-[-0.03em] leading-[1.08] text-white mt-2.5 mb-2 font-[Montserrat]">
            Your health is your greatest <span className="text-[#22c0d4]">asset.</span>
          </h2>
          <p className="text-[15px] text-white/75 leading-[1.55] m-0 font-[Lato]">
            Compare private blood tests from the UK's most trusted providers — and book the right one with total confidence.
          </p>
        </div>
        <div className="relative flex gap-3 flex-wrap">
          {/* Find your test → assisted questionnaire */}
          <Link to="/find-test" className="inline-flex items-center gap-2 px-[30px] py-3.5 rounded-full bg-[#22c0d4] hover:bg-[#1aa9bc] text-white text-[15px] font-semibold no-underline transition-colors font-[Montserrat]">
            Find your test <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </Link>
          <Link to="/compare" className="inline-flex items-center px-[30px] py-3.5 rounded-full border-2 border-white/50 hover:border-white text-white text-[15px] font-semibold no-underline transition-colors font-[Montserrat]">
            Compare tests
          </Link>
        </div>
      </div>
    </section>
  );
}
