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
      </div>
      <p className="mt-2 text-center text-xs text-[#8892a4] leading-relaxed">
        myhealth checkup is independent. No payments from listed providers influence ranking. Prices sourced from provider websites — verify before booking.
      </p>
    </div>
  </section>
);

export default ProviderComparisonTable;
