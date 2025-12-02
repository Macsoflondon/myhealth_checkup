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
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            <span className="text-[hsl(var(--navy))]">Your Health Journey </span>
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Simplified
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Finding the right health test shouldn't be complicated. We've made it simple in three easy steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center relative">
              {/* Connector line - hidden on mobile */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-[hsl(var(--primary))]/30 to-transparent" />
              )}
              
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-[hsl(var(--primary))]/10 mb-6">
                <step.icon className="w-8 h-8 text-[hsl(var(--primary))]" />
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[hsl(var(--primary))] text-white text-sm font-bold flex items-center justify-center">
                  {step.step}
                </span>
              </div>
              
              <h3 className="text-xl font-semibold text-[hsl(var(--navy))] mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
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
