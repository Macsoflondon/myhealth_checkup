export default function StatsBand() {
  return (
    <section className="rounded-t-none rounded-b-[28px] overflow-hidden bg-[#F5F5F5] border border-t-0 border-[#081129]/[0.06] shadow-[0_30px_80px_rgba(8,17,41,0.10)] px-6 sm:px-[30px] pt-6 sm:pt-8 pb-[18px]">
      <div className="relative overflow-hidden rounded-[22px] bg-[#081129] px-6 sm:px-[34px] py-10 sm:py-[44px] flex items-center justify-center min-h-[160px] sm:min-h-[200px] text-center">
        <div className="absolute -right-[50px] -top-[60px] w-[260px] h-[260px] rounded-full bg-[#22c0d4]/[0.12]" />
        <div className="absolute right-[120px] -bottom-[110px] w-[240px] h-[240px] rounded-full bg-[#e70d69]/10" />
        <h2 className="relative font-extrabold text-[clamp(1.9rem,7.5vw,3rem)] tracking-[-0.02em] leading-[1.15] text-white m-0 font-[Montserrat] break-words max-w-4xl mx-auto">
          Your <span className="text-[#22c0d4]">health</span> is your greatest <span className="text-[#e70d69]">asset.</span>
        </h2>
      </div>
    </section>
  );
}
