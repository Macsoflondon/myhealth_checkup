import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, FlaskConical, Stethoscope, Zap } from "lucide-react";

const TURQUOISE = "#22c0d4";
const PINK = "#e70d69";

const STATS = [
  { value: "100%",   label: "UKAS-accredited labs",  Icon: ShieldCheck,  color: TURQUOISE },
  { value: "200+",   label: "Tests to compare",      Icon: FlaskConical, color: PINK },
  { value: "No GP",  label: "Referral needed",       Icon: Stethoscope,  color: "#3a5f85" },
  { value: "60 sec", label: "To compare & decide",   Icon: Zap,          color: "#16a34a" },
];

export default function StatsBand() {
  return (
    <section className="rounded-t-none rounded-b-[28px] overflow-hidden bg-[#f7f7f8] border border-t-0 border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-6 sm:px-[30px] pt-0 pb-[18px]">
      <div className="relative overflow-hidden rounded-[22px] bg-[#081129] px-[34px] py-[15px] flex items-center justify-between gap-6 flex-wrap">
        <div className="absolute -right-[50px] -top-[60px] w-[220px] h-[220px] rounded-full bg-[#22c0d4]/[0.12]" />
        <div className="absolute right-[120px] -bottom-[90px] w-[200px] h-[200px] rounded-full bg-[#e70d69]/10" />
        <div className="relative">
          <h2 className="font-extrabold text-[clamp(1.2rem,2.2vw,1.7rem)] tracking-[-0.03em] leading-[1.08] text-white m-0 font-[Montserrat] whitespace-nowrap">
            Your <span className="text-[#22c0d4]">health</span> is your greatest <span className="text-[#e70d69]">asset.</span>
          </h2>
        </div>
        <div className="relative flex gap-3 flex-wrap">
          <Link to="/find-test" className="inline-flex items-center gap-2 px-[30px] py-3.5 rounded-full bg-[#22c0d4] hover:bg-[#1aa9bc] text-white text-[15px] font-semibold no-underline transition-colors font-[Montserrat]">
            Find your test <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </Link>
          <Link to="/compare" className="inline-flex items-center px-[30px] py-3.5 rounded-full border-2 border-white/50 hover:border-white text-white text-[15px] font-semibold no-underline transition-colors font-[Montserrat]">
            Compare tests
          </Link>
        </div>
      </div>

      <div className="pt-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {STATS.map(({ value, label, Icon, color }) => (
            <div key={label} className="bg-white rounded-xl border border-[#081129]/[0.08] p-2 shadow-[0_4px_16px_rgba(8,17,41,0.05)] flex flex-row items-center gap-2">
              <span className="w-[22px] h-[22px] rounded-[7px] inline-flex items-center justify-center shrink-0" style={{ background: `${color}14` }}>
                <Icon className="w-[12px] h-[12px]" style={{ color }} strokeWidth={2} />
              </span>
              <div className="flex flex-col min-w-0">
                <div className="font-extrabold text-[14px] tracking-[-0.02em] text-[#081129] leading-none font-[Montserrat]">{value}</div>
                <div className="text-[9px] text-[#081129]/55 mt-0.5 font-[Lato] leading-tight">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
