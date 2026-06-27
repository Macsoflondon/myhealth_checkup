import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AccreditedProvidersBar from "@/components/sections/AccreditedProvidersBar";

export default function StatsBand() {
  return (
    <section className="rounded-t-none rounded-b-[28px] overflow-hidden bg-[#F5F5F5] border border-t-0 border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-6 sm:px-[30px] pt-6 sm:pt-8 pb-[18px]">
      <div className="relative overflow-hidden rounded-[22px] bg-[#081129] px-[34px] py-[42px] sm:py-[56px] flex items-center justify-between gap-6 flex-wrap min-h-[180px] sm:min-h-[220px]">
        <div className="absolute -right-[50px] -top-[60px] w-[260px] h-[260px] rounded-full bg-[#22c0d4]/[0.12]" />
        <div className="absolute right-[120px] -bottom-[110px] w-[240px] h-[240px] rounded-full bg-[#e70d69]/10" />
        <div className="relative">
          <h2 className="font-extrabold text-[clamp(1.4rem,2.6vw,2.1rem)] tracking-[-0.03em] leading-[1.08] text-white m-0 font-[Montserrat] whitespace-nowrap">
            Your <span className="text-[#22c0d4]">health</span> is your greatest <span className="text-[#e70d69]">asset.</span>
          </h2>
        </div>
        <div className="relative flex gap-3 flex-wrap">
          <Link to="/find-test" className="inline-flex items-center gap-2 px-[30px] py-3.5 rounded-full bg-[#22c0d4] hover:bg-[#1aa9bc] text-[#081129] text-[15px] font-semibold no-underline transition-colors font-[Montserrat]">
            Find your test <ArrowRight className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </Link>
          <Link to="/compare" className="inline-flex items-center px-[30px] py-3.5 rounded-full border-2 border-white/50 hover:border-white text-white text-[15px] font-semibold no-underline transition-colors font-[Montserrat]">
            Compare tests
          </Link>
        </div>
      </div>

      <div className="pt-4 rounded-[14px] overflow-hidden">
        <AccreditedProvidersBar />
      </div>
    </section>
  );
}
