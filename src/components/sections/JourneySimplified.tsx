import { Search, CheckCircle, ExternalLink, ClipboardList } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Compare",
    description:
      "Choose a test category or by goals. Filter by price, sample method, turnaround time.\nSee every option side by side.",
  },
  {
    number: "02",
    icon: CheckCircle,
    title: "Choose Your Provider",
    description:
      "Every listed provider is independently verified as UKAS-accredited or CQC-regulated. No hidden bias. No hidden fees.\u00a0 You choose based on facts.",
  },
  {
    number: "03",
    icon: ExternalLink,
    title: "Book Directly",
    description:
      "You are taken directly to the provider's booking page. myhealth checkup adds no price markup. What you see here is what you pay there.",
  },
  {
    number: "04",
    icon: ClipboardList,
    title: "Receive Your Results",
    description:
      "Results are delivered by your chosen provider, typically within 24 to 72 hours. Many providers include a clinical review or GP letter on request.",
  },
];

const JourneySimplified = () => {
  return (
    <section className="pt-6 sm:pt-7 md:pt-8 lg:pt-9 sm:pb-2 md:pb-3 lg:pb-4 bg-card pb-[6px]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="text-center mb-2 sm:mb-3 md:mb-4">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-px w-6 sm:w-9 bg-brand-pink" />
            <span className="text-sm sm:text-base font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
              Simple Process
            </span>
            <div className="h-px w-6 sm:w-9 bg-brand-pink" />
          </div>
          <SectionHeading
            title="From search to results"
            gradientText="in four steps."
            titleClassName="text-tertiary"
          />
          <p className="text-sm sm:text-base font-semibold text-tertiary mx-auto leading-snug mt-1.5 text-center">
            No account required. Compare, choose, and book directly with the
            provider you trust — in minutes.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-7 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Step number — large light background numeral */}
                <div
                  className="font-heading font-black text-center leading-none mb-[-4px]"
                  style={{
                    fontSize: "32px",
                    color: "#eef1f6",
                    letterSpacing: "-0.04em",
                  }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>

                {/* Icon badge */}
                <div className="relative inline-flex mb-1.5">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-background border-2 border-brand-turquoise flex items-center justify-center shadow-sm relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-brand-turquoise/20">
                    <step.icon
                      className="w-5 h-5 sm:w-6 sm:h-6 text-brand-turquoise"
                      aria-hidden="true"
                    />
                  </div>
                </div>

                <h3 className="text-sm sm:text-base font-heading mb-0.5 text-brand-turquoise font-medium">
                  {step.title}
                </h3>
                <p className="mt-0.5 text-sm text-tertiary/80 max-w-xs mx-auto leading-snug whitespace-pre-line">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JourneySimplified;
