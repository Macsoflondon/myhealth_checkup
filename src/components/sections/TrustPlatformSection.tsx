import { Eye, Stethoscope, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";

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
    <section className={cn("py-6 sm:py-8 md:py-10 bg-white", className)}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-4 sm:mb-5 md:mb-6">
          <SectionHeading 
            title="Trusted Health" 
            gradientText="Comparison Platform" 
            className="mb-2 sm:mb-3"
          />
          <p className="text-gray-600 font-sans text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Built on principles of transparency, clinical accuracy, and unwavering quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{ animationDelay: `${index * 100}ms` }} 
              className="relative p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group animate-fade-in"
            >
              {/* Icon container with brand turquoise */}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#22c0d4] flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-heading font-semibold mb-1.5 sm:mb-2 text-[#081129]">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-gray-600 font-sans">
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