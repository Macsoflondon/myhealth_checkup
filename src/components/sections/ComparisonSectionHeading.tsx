import { SectionHeading } from "@/components/ui/section-heading";

interface ComparisonSectionHeadingProps {
  showDisclaimer?: boolean;
  className?: string;
}

const ComparisonSectionHeading = ({
  showDisclaimer = true,
  className = "",
}: ComparisonSectionHeadingProps) => (
  <div className={className}>
    <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
      <div className="flex items-center justify-center gap-3 mb-4">
        <div className="h-px w-8 sm:w-12" style={{ background: "rgba(231,13,105,0.4)" }} />
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#e70d69]">
          Side-by-Side
        </span>
        <div className="h-px w-8 sm:w-12" style={{ background: "rgba(231,13,105,0.4)" }} />
      </div>
      <SectionHeading
        title="Provider comparison"
        gradientText="— full picture."
        titleClassName="text-[#081129]"
        gradientClassName="text-brand-turquoise"
      />
      <p className="mt-3 text-base sm:text-lg text-[#081129]/65 leading-relaxed">
        A quick-glance comparison of key provider attributes for a standard full blood count test.
        Prices are indicative — always verify directly with the provider before booking.
      </p>
    </div>
    {showDisclaimer && (
      <p className="mt-2 text-center text-xs text-[#8892a4] leading-relaxed max-w-3xl mx-auto">
        myhealth checkup is independent. No payments from listed providers influence ranking. Prices
        sourced from provider websites — verify before booking.
      </p>
    )}
  </div>
);

export default ComparisonSectionHeading;
