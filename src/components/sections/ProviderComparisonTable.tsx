import { SectionHeading } from "@/components/ui/section-heading";

const rows = [
  { provider: "Medichecks", price: "From £29", method: "Fingerprick / venepuncture", time: "24–48 hrs", ukas: true, cqc: true, home: true, clinic: true, gp: true },
  { provider: "Thriva", price: "From £39", method: "Fingerprick (at-home)", time: "48–72 hrs", ukas: true, cqc: true, home: true, clinic: false, gp: true },
  { provider: "Randox Health", price: "From £49", method: "Venepuncture (clinic)", time: "48–72 hrs", ukas: true, cqc: true, home: false, clinic: true, gp: true },
  { provider: "London Medical Laboratory", price: "From £65", method: "Venepuncture (walk-in)", time: "24–48 hrs", ukas: true, cqc: false, home: false, clinic: true, gp: false },
  { provider: "Goodbody Health", price: "From £55", method: "Venepuncture (clinic)", time: "48–72 hrs", ukas: true, cqc: true, home: false, clinic: true, gp: false },
  { provider: "Lola Health", price: "From £89", method: "Venepuncture (clinic)", time: "48–72 hrs", ukas: true, cqc: true, home: false, clinic: true, gp: true },
];

const Check = ({ yes }: { yes: boolean }) =>
  yes ? <span className="text-brand-turquoise font-bold">✓</span> : <span className="text-[#d8dce6]">—</span>;

const ProviderComparisonTable = () => (
  <section className="bg-[#f5f8fc] py-14 sm:py-16 md:py-20">
    <div className="container mx-auto px-4 sm:px-6 lg:px-12">
      <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-8 sm:w-12" style={{ background: "rgba(231,13,105,0.4)" }} />
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#e70d69]">Side-by-Side</span>
          <div className="h-px w-8 sm:w-12" style={{ background: "rgba(231,13,105,0.4)" }} />
        </div>
        <SectionHeading
          title="Provider comparison"
          gradientText="— full picture."
          titleClassName="text-[#081129]"
          gradientClassName="text-brand-turquoise"
        />
        <p className="mt-3 text-base sm:text-lg text-[#081129]/65 leading-relaxed">
          A quick-glance comparison of key provider attributes for a standard full blood count test. Prices are indicative — always verify directly with the provider before booking.
        </p>
      </div>
      <div className="overflow-x-auto rounded-2xl" style={{ border: "1px solid #d8dce6", boxShadow: "0 2px 12px rgba(8,17,41,0.07)" }}>
        <table className="w-full border-collapse text-sm" style={{ minWidth: 680 }}>
          <thead>
            <tr style={{ background: "#081129" }}>
              {["Provider","Test Price","Sample Method","Results","UKAS","CQC","At-Home","Clinic","GP Letter"].map((h, i) => (
                <th key={h} className="px-4 py-3 text-left whitespace-nowrap font-heading text-[9px] font-bold uppercase tracking-[0.12em]" style={{ color: i === 0 ? "#22c0d4" : "rgba(255,255,255,0.62)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.provider} className="hover:bg-white transition-colors" style={{ background: i % 2 === 0 ? "#ffffff" : "#f9fafb", borderBottom: "1px solid #eef1f6" }}>
                <td className="px-4 py-3 font-heading font-bold text-xs text-[#081129] whitespace-nowrap">{r.provider}</td>
                <td className="px-4 py-3 font-heading font-extrabold text-[#081129] whitespace-nowrap">{r.price}</td>
                <td className="px-4 py-3 text-[#3d4659]">{r.method}</td>
                <td className="px-4 py-3 text-[#3d4659] whitespace-nowrap">{r.time}</td>
                <td className="px-4 py-3 text-center"><Check yes={r.ukas} /></td>
                <td className="px-4 py-3 text-center"><Check yes={r.cqc} /></td>
                <td className="px-4 py-3 text-center"><Check yes={r.home} /></td>
                <td className="px-4 py-3 text-center"><Check yes={r.clinic} /></td>
                <td className="px-4 py-3 text-center"><Check yes={r.gp} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-5 text-center text-xs text-[#8892a4] leading-relaxed">
        myhealth checkup is independent. No payments from listed providers influence ranking. Prices sourced from provider websites — verify before booking.
      </p>
    </div>
  </section>
);

export default ProviderComparisonTable;
