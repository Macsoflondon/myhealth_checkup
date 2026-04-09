import { Search, GitCompare, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const JourneySimplified = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Tell us what you want to check",
      description: "Search by symptom, condition, or browse test categories to find the right test."
    },
    {
      number: "02",
      icon: GitCompare,
      title: "Compare trusted tests & providers",
      description: "Compare prices, turnaround times, sample types, and inclusions side by side."
    },
    {
      number: "03",
      icon: Calendar,
      title: "Book directly with your chosen provider",
      description: "Book directly with your chosen provider. No middlemen, no markup."
    }
  ];

  return (
    <section className="pt-6 pb-4 sm:pt-8 sm:pb-6 md:pt-10 md:pb-8 lg:pt-12 lg:pb-10 bg-card">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <SectionHeading
            title="Your Health Journey"
            gradientText="Simplified"
          />
          <p className="text-foreground font-sans font-medium text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-4">
            Finding the right health test shouldn't be complicated. We've made it simple in three easy steps.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Step icon badge */}
                <div className="relative inline-flex mb-3">
                  <div className="w-20 h-20 rounded-2xl bg-background border-2 border-brand-turquoise flex items-center justify-center shadow-md relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-turquoise/20">
                    <step.icon className="w-8 h-8 text-brand-turquoise" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-2 text-brand-turquoise">
                  {step.title}
                </h3>
                <p className="text-foreground font-sans font-medium text-sm sm:text-base leading-relaxed max-w-[260px] mx-auto">
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
