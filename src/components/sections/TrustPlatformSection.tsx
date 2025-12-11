import { Eye, Stethoscope, BadgeCheck } from "lucide-react";
const TrustPlatformSection = () => {
  const features = [{
    icon: Eye,
    title: "Independent & Transparent",
    description: "We're not owned by any provider. Our comparisons are unbiased, and we're upfront about how we make money."
  }, {
    icon: Stethoscope,
    title: "Clinically Led",
    description: "Our content is evidence-based and reviewed by registered healthcare professionals to ensure accuracy."
  }, {
    icon: BadgeCheck,
    title: "Quality Focused",
    description: "We only feature UKAS accredited laboratories, CQC regulated providers, and ISO 15189 certified facilities."
  }];
  return <section className="py-12 sm:py-16 md:py-20 bg-[hsl(var(--navy))]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4">
            Trusted Health Comparison Platform
          </h2>
          <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto font-medium md:text-2xl">
            Built on principles of transparency, clinical accuracy, and unwavering quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => <div key={index} style={{
          animationDelay: `${index * 100}ms`
        }} className="relative p-5 sm:p-6 backdrop-blur-sm border-white/10 transition-all duration-300 hover:-translate-y-1 group animate-fade-in bg-secondary-foreground border-2 rounded-xl">
              {/* Icon positioned inside the card, not overflowing */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[hsl(var(--primary))] flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-heading font-semibold mb-3 text-center text-[#081129]">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#081129] sm:text-lg font-semibold font-sans">
                {feature.description}
              </p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default TrustPlatformSection;