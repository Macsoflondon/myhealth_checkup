import { Search, GitCompare, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const JourneySimplified = () => {
  const steps = [
    {
      number: "01",
      icon: Search,
      title: "Tell us what you want to check",
      description: "Search by symptom, condition, or browse our comprehensive test categories to find the right test for you."
    },
    {
      number: "02",
      icon: GitCompare,
      title: "Compare trusted tests & providers",
      description: "View side-by-side comparisons of prices, turnaround times, sample types, and what's included in each test."
    },
    {
      number: "03",
      icon: Calendar,
      title: "Book directly with your chosen provider",
      description: "Click through to book directly with your chosen provider. No middlemen, no markup, just confidence."
    }
  ];

  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-card">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16">
          <SectionHeading
            title="Your Health Journey"
            gradientText="Simplified"
          />
          <p className="text-muted-foreground font-sans text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed mt-4">
            Finding the right health test shouldn't be complicated. We've made it simple in three easy steps.
          </p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connection line - desktop only */}
          <div className="hidden lg:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step) => (
              <div key={step.number} className="relative text-center group">
                {/* Step icon badge */}
                <div className="relative inline-flex mb-6">
                  <div className="w-20 h-20 rounded-2xl bg-background border-2 border-brand-turquoise flex items-center justify-center shadow-md relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-brand-turquoise/20">
                    <step.icon className="w-8 h-8 text-brand-turquoise" />
                  </div>
                </div>

                <h3 className="text-lg sm:text-xl font-heading font-semibold mb-3 text-brand-turquoise">
                  {step.title}
                </h3>
                <p className="text-muted-foreground font-sans text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
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
