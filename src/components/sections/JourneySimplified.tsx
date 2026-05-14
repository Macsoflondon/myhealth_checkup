import { Search, GitCompare, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const JourneySimplified = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Tell us what you want to check",
      description: ""
    },
    {
      number: "02",
      icon: GitCompare,
      title: "Compare trusted tests & providers",
      description: "​"
    },
    {
      number: "03",
      icon: Calendar,
      title: "Book directly with your chosen provider",
      description: "Book directly with your chosen provider. No middlemen, no markup."
    }
  ];

  return (
    <section className="pt-3 sm:pt-4 sm:pb-3 md:pt-6 md:pb-4 lg:pt-8 lg:pb-6 bg-card pb-[10px]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-3 sm:mb-4 md:mb-5">
          <SectionHeading
            title="Your Health Journey"
            gradientText="Simplified"
            titleClassName="text-tertiary"
          />
          <p className="text-tertiary font-sans font-medium text-xs sm:text-sm md:text-base max-w-2xl mx-auto leading-snug mt-2">
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

                <h3 className="text-base sm:text-lg font-heading font-semibold mb-1 text-brand-turquoise">
                  {step.title}
                </h3>
                <p className="h-px w-8 sm:w-12 bg-brand-turquoise/40 font-semibold">
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
