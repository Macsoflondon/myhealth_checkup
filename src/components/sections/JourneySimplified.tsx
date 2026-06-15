import { Search, CheckCircle, ExternalLink, ClipboardList } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const steps = [
  {
    number: "01",
    icon: Search,
    title: "Search & Compare",
    description:
      "Choose a test category or by goals. Filter by price, sample method, turnaround time,.\nSee every option side by side.",
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
    <section className="pt-8 sm:pt-10 md:pt-12 lg:pt-14 sm:pb-3 md:pb-4 lg:pb-6 bg-card pb-[10px]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-8">
        <div className="text-center mb-3 sm:mb-4 md:mb-5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-6 bg-slate-200" />
            <span className="text-xs sm:text-sm font-semibold uppercase tracking-[0.25em] text-brand-turquoise">
              Simple Process
            </span>
            <div className="h-px w-6 bg-slate-200" />
          </div>
          <SectionHeading
            title="From search to results"
            gradientText="in four steps."
            titleClassName="text-tertiary"
          />
          <p className="text-base font-semibold text-tertiary mx-auto leading-snug mt-2 text-center">
            No account required. No subscription. Compare, choose, and book directly with the provider you trust — in minutes.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting line — desktop only */}
          <div className="hidden lg:block absolute top-9 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Step number — large light background numeral */}
                <div
                  className="font-heading font-black text-center leading-none mb-[-6px]"
                  style={{ fontSize: "42px", color: "#eef1f6", letterSpacing: "-0.04em" }}
                  aria-hidden="true"
                >
                  {step.number}
                </div>

                {/* Icon badge */}
                <div className="relative inline-flex mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-background border-2 border-brand-turquoise flex items-center justify-center shadow-md relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-turquoise/20">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-turquoise" />
                  </div>
                </div>

                <h3 className="text-base font-heading mb-1 text-brand-turquoise font-medium sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-1 text-base text-tertiary/80 max-w-xs mx-auto leading-snug whitespace-pre-line">
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
