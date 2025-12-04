import { Eye, Stethoscope, BadgeCheck } from "lucide-react";

const TrustPlatformSection = () => {
  const features = [
    {
      icon: Eye,
      title: "Independent & Transparent",
      description: "We're not owned by any provider. Our comparisons are unbiased, and we're upfront about how we make money."
    },
    {
      icon: Stethoscope,
      title: "Clinically Led",
      description: "Our content is evidence-based and reviewed by registered healthcare professionals to ensure accuracy."
    },
    {
      icon: BadgeCheck,
      title: "Quality Focused",
      description: "We only feature UKAS accredited laboratories, CQC regulated providers, and ISO 15189 certified facilities."
    }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-[hsl(var(--navy))]">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-3 sm:mb-4 px-2">
            Trusted Health Comparison Platform
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2">
            Built on principles of transparency, clinical accuracy, and unwavering quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="relative rounded-xl sm:rounded-2xl p-4 sm:p-6 bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center mb-3 sm:mb-4 -mt-6 sm:-mt-10 ml-0">
                <feature.icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white mb-2 sm:mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustPlatformSection;
