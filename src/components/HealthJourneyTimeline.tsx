import { CheckCircle2, Calendar, FlaskConical, FileCheck, Heart } from "lucide-react";
import { useTranslation } from "react-i18next";

const HealthJourneyTimeline = () => {
  const { t } = useTranslation();

  const timelineSteps = [
    {
      icon: Calendar,
      title: "First Week",
      subtitle: "Book Your Test",
      description: "Choose from 100+ tests and book online in minutes. At-home or clinic options available.",
      duration: "Same day",
      color: "text-[#22c0d4]",
      bgColor: "bg-[#22c0d4]/10"
    },
    {
      icon: FlaskConical,
      title: "Days 2-3",
      subtitle: "Take Your Test",
      description: "Convenient home kit delivery or visit a nearby clinic. Sample collection made simple.",
      duration: "24-48 hours",
      color: "text-[#e70d69]",
      bgColor: "bg-[#e70d69]/10"
    },
    {
      icon: FileCheck,
      title: "Days 3-7",
      subtitle: "Get Your Results",
      description: "Fast, accurate results from UKAS-accredited labs. Clear explanations in plain language.",
      duration: "2-5 days",
      color: "text-[#22c0d4]",
      bgColor: "bg-[#22c0d4]/10"
    },
    {
      icon: Heart,
      title: "Ongoing",
      subtitle: "Take Action",
      description: "Expert guidance on next steps. Many tests include GP consultation recommendations.",
      duration: "Lifetime support",
      color: "text-[#e70d69]",
      bgColor: "bg-[#e70d69]/10"
    }
  ];

  return (
    <section className="w-full relative py-12 sm:py-16 md:py-20 overflow-hidden">
      {/* Background gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white" />
      
      {/* Faded blood tubes background image */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'url(/lovable-uploads/blood-tubes-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#081129] mb-4">
            Your Health Journey <span className="text-[#e70d69]">Simplified</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            From booking to results, we make private health testing seamless and stress-free
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Connection line - hidden on mobile */}
          <div className="hidden md:block absolute top-16 left-0 right-0 h-1 bg-gradient-to-r from-[#22c0d4] via-[#e70d69] to-[#22c0d4] opacity-20" 
               style={{ top: '80px' }} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {timelineSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Mobile connector line */}
                  {index < timelineSteps.length - 1 && (
                    <div className="md:hidden absolute left-10 top-20 bottom-0 w-0.5 bg-gradient-to-b from-[#22c0d4] to-[#e70d69] opacity-30" 
                         style={{ height: 'calc(100% + 24px)' }} />
                  )}

                  <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full group hover:scale-105">
                    {/* Icon container */}
                    <div className={`${step.bgColor} ${step.color} w-16 h-16 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative z-10`}>
                      <Icon className="w-8 h-8" />
                    </div>

                    {/* Step number */}
                    <div className="absolute top-4 right-4 text-4xl font-bold text-gray-100">
                      {index + 1}
                    </div>

                    {/* Content */}
                    <div className="space-y-2">
                      <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        {step.title}
                      </div>
                      <h3 className="text-xl font-bold text-[#081129]">
                        {step.subtitle}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                      <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${step.bgColor} ${step.color}`}>
                        {step.duration}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats section */}
        <div className="mt-12 sm:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl sm:text-4xl font-bold text-[#22c0d4] mb-2">95%</div>
            <div className="text-sm text-gray-600">Feel more in control of their health</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl sm:text-4xl font-bold text-[#e70d69] mb-2">2-5</div>
            <div className="text-sm text-gray-600">Days for most results</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl sm:text-4xl font-bold text-[#22c0d4] mb-2">100+</div>
            <div className="text-sm text-gray-600">Tests available nationwide</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-md">
            <div className="text-3xl sm:text-4xl font-bold text-[#e70d69] mb-2">24/7</div>
            <div className="text-sm text-gray-600">Online booking available</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HealthJourneyTimeline;
