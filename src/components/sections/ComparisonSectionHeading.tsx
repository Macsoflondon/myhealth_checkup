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
      <div className="flex flex-col items-center justify-center mb-4">
        <span className="inline-flex items-center gap-3 text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#e70d69] whitespace-nowrap">
          <span aria-hidden="true" className="inline-block h-px w-6 sm:w-8 bg-[#e70d69]/60" />
          <span>Side-by-Side</span>
          <span aria-hidden="true" className="inline-block h-px w-6 sm:w-8 bg-[#e70d69]/60" />
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-heading font-bold leading-tight text-[#081129]">
          Provider comparison — full picture.
        </h2>
      </div>
      <p className="mt-6 text-base sm:text-lg text-white/70 leading-relaxed">
        A quick-glance comparison of key provider attributes for a standard full blood count test.
        Prices are indicative — always verify directly with the provider before booking.
      </p>
    </div>
  </div>
);

export default ComparisonSectionHeading;
