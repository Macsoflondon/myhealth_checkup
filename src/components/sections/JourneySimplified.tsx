import { Search, GitCompare, Calendar } from "lucide-react";

const JourneySimplified = () => {
  const steps = [
    {
      icon: Search,
      step: "1",
      title: "Search",
      description: "Browse our extensive catalogue of health tests or use our smart search to find what you need."
    },
    {
      icon: GitCompare,
      step: "2",
      title: "Compare",
      description: "Compare prices, turnaround times, and features across multiple accredited providers."
    },
    {
      icon: Calendar,
      step: "3",
      title: "Book",
      description: "Choose your preferred provider and book directly through their secure platform."
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="text-[hsl(var(--navy))]">Your Health Journey </span>
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
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
                <div className="hidden sm:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[hsl(var(--primary))]/40 via-[hsl(var(--secondary))]/30 to-transparent" />
              )}
              
              {/* Mobile connector - vertical line */}
              {index < steps.length - 1 && (
                <div className="sm:hidden absolute left-1/2 top-[90px] h-8 w-0.5 bg-gradient-to-b from-[hsl(var(--primary))]/40 to-transparent -translate-x-1/2" />
              )}
              
              <div className="relative inline-flex items-center justify-center w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-[hsl(var(--primary))]/10 mb-5 sm:mb-6 transition-transform duration-300 group-hover:scale-110">
                <step.icon className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(var(--primary))] transition-transform duration-300" />
                <span className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-[hsl(var(--primary))]/30">
                  {step.step}
                </span>
              </div>
              
              <h3 className="text-lg sm:text-xl font-heading font-semibold text-[hsl(var(--navy))] mb-2 sm:mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
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
