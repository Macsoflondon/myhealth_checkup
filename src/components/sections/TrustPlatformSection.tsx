import { Eye, Stethoscope, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrustPlatformSectionProps {
  className?: string;
}

const TrustPlatformSection = ({ className }: TrustPlatformSectionProps) => {
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
  
  return (
    <section className={cn("pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-[#081129]", className)}>
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-14">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-white mb-3 sm:mb-4">
            Trusted Health Comparison Platform
          </h2>
          <p className="text-gray-300 font-sans text-sm sm:text-base md:text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            Built on principles of transparency, clinical accuracy, and unwavering quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{ animationDelay: `${index * 100}ms` }} 
              className="relative p-2 sm:p-3 bg-white rounded-lg border border-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group animate-fade-in"
            >
              {/* Icon container with brand turquoise */}
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-[#22c0d4] flex items-center justify-center mb-2 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h3 className="text-xs sm:text-sm font-heading font-semibold mb-1 text-[#081129]">
                {feature.title}
              </h3>
              <p className="text-[10px] sm:text-xs leading-relaxed text-gray-600 font-sans">
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