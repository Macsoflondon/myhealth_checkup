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
        <span className="inline-flex items-center gap-3 text-base sm:text-lg font-semibold uppercase tracking-[0.25em] text-brand-turquoise whitespace-nowrap">
          <span aria-hidden="true" className="inline-block h-px w-8 sm:w-12 bg-brand-pink" />
          <span>Side-by-Side</span>
          <span aria-hidden="true" className="inline-block h-px w-8 sm:w-12 bg-brand-pink" />
        </span>
        <h2 className="mt-2 text-2xl sm:text-3xl md:text-4xl font-heading font-bold leading-tight text-[#081129]">
          Provider comparison — full picture.
        </h2>
      </div>
      <p className="mt-6 text-base sm:text-lg text-[#081129]/70 leading-relaxed">
        {"\n"}
      </p>
    </div>
  </div>
);

export default ComparisonSectionHeading;
