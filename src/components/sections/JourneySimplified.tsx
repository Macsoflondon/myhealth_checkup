import { Search, GitCompare, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const JourneySimplified = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Tell us what you want to check",
      description: "Search by symptom, health goal, or specific biomarker to discover the private tests that match what you actually need."
    },
    {
      number: "02",
      icon: GitCompare,
      title: "Compare trusted tests & providers",
      description: "See prices, biomarkers, sample methods and turnaround times side-by-side from UKAS-accredited labs and CQC-regulated clinics."
    },
    {
      number: "03",
      icon: Calendar,
      title: "Book directly with the provider",
      description: "Click through to the provider you choose and complete your booking with them — we never see your medical data."
    }
  ];

  return (
    <section className="pt-8 sm:pt-10 md:pt-12 lg:pt-14 sm:pb-3 md:pb-4 lg:pb-6 bg-card pb-[10px]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-3 sm:mb-4 md:mb-5">
          {/* Eyebrow */}
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-px w-6 bg-slate-200" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-brand-turquoise">
              Your Health Journey Simplified
            </span>
            <div className="h-px w-6 bg-slate-200" />
          </div>
          <SectionHeading
            title="Your Health Journey"
            gradientText="Simplified"
            titleClassName="text-tertiary"
          />
          <p className="text-base font-semibold text-tertiary max-w-2xl mx-auto leading-snug mt-2 text-center">
            Three simple steps from "I'm not sure which test I need" to a confirmed booking with a trusted UK provider — no account required, no medical data stored with us.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-9 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Step icon badge */}
                <div className="relative inline-flex mb-2">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-background border-2 border-brand-turquoise flex items-center justify-center shadow-md relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-turquoise/20">
                    <step.icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-turquoise" />
                  </div>
                </div>

                <h3 className="text-base font-heading mb-1 text-brand-turquoise font-medium sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-tertiary/80 max-w-xs mx-auto leading-snug">
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
