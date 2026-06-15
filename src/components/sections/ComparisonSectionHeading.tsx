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
        <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-[#e70d69]">
          Side-by-Side
        </span>
        <div className="mt-2 text-xl sm:text-2xl font-bold text-[#081129]">
          Provider comparison — full picture.
        </div>
      </div>
      <p className="mt-6 text-base sm:text-lg text-[#081129]/65 leading-relaxed">
        A quick-glance comparison of key provider attributes for a standard full blood count test.
        Prices are indicative — always verify directly with the provider before booking.
      </p>
    </div>
  </div>
);

export default ComparisonSectionHeading;
