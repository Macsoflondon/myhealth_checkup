import { Search, GitCompare, Calendar } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";

const JourneySimplified = () => {
  const steps = [
    {
      icon: Search,
      step: "1",
      title: "Tell us what you want to check",
      description: "Search by symptom, condition, or browse our comprehensive test categories to find the right test for you."
    },
    {
      icon: GitCompare,
      step: "2",
      title: "Compare trusted tests & providers",
      description: "View side-by-side comparisons of prices, turnaround times, sample types, and what's included in each test."
    },
    {
      icon: Calendar,
      step: "3",
      title: "Book directly with your chosen provider",
      description: "Click through to book directly with your chosen provider. No middlemen, no markup, just confidence."
    }
  ];

  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-[hsl(224,67%,10%,0.03)]">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
          <SectionHeading 
            title="Your Health Journey" 
            gradientText="Simplified" 
          />
          <p className="text-gray-600 font-sans text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed mt-4">
            Finding the right health test shouldn't be complicated. We've made it simple in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 md:gap-10 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index} 
              className="text-center relative group animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Connector line - visible on desktop */}
              {index < steps.length - 1 && (
                <div className="hidden sm:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[#22c0d4]/40 via-[#e70d69]/30 to-transparent" />
              )}
              
              {/* Mobile connector - vertical line */}
              {index < steps.length - 1 && (
                <div className="sm:hidden absolute left-1/2 top-[90px] h-8 w-0.5 bg-gradient-to-b from-[#22c0d4]/40 to-transparent -translate-x-1/2" />
              )}
              
              <div className="relative inline-flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[#22c0d4]/15 border-2 border-[#22c0d4]/30 mb-5 sm:mb-6 transition-all duration-300 group-hover:scale-110 group-hover:border-[#22c0d4] group-hover:shadow-lg group-hover:shadow-[#22c0d4]/20">
                <span className="text-2xl sm:text-3xl font-bold text-[#22c0d4]">
                  {step.step}
                </span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-heading font-semibold text-[#081129] mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 font-sans text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySimplified;
