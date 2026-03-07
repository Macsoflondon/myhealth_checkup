import { Eye, Stethoscope, BadgeCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

interface TrustPlatformSectionProps {
  className?: string;
}

const TrustPlatformSection = ({ className }: TrustPlatformSectionProps) => {
  const features = [
    {
      icon: Eye,
      title: "Independent & Transparent",
      description: "We're not owned by any provider. Our comparisons are unbiased, and we're upfront about how we make money.",
      accent: "brand-turquoise"
    },
    {
      icon: Stethoscope,
      title: "Clinically Led",
      description: "Our content is evidence-based and reviewed by registered healthcare professionals to ensure accuracy.",
      accent: "brand-pink"
    },
    {
      icon: BadgeCheck,
      title: "Quality Focused",
      description: "We only feature UKAS accredited laboratories, CQC regulated providers, and ISO 15189 certified facilities.",
      accent: "brand-turquoise"
    }
  ];
  
  return (
    <section className={cn("py-12 sm:py-16 md:py-20 bg-brand-navy relative overflow-hidden", className)}>
      <NavyDecorativeCircles />
      
      <div className="container mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          {/* Section label */}
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
            <span className="text-brand-turquoise text-[10px] sm:text-xs font-semibold uppercase tracking-[0.25em]">
              Why Trust Us
            </span>
            <div className="h-px w-8 sm:w-12 bg-brand-turquoise/40" />
          </div>
          
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold mb-3">
            <span className="text-white">Trusted Health </span>
            <span className="text-white">
              Comparison Platform
            </span>
          </h2>
          <p className="text-white font-sans font-medium text-xs sm:text-sm md:text-base max-w-lg mx-auto leading-relaxed">
            Built on principles of transparency, clinical accuracy, and unwavering quality standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index} 
              style={{ animationDelay: `${index * 100}ms` }} 
              className="relative p-5 sm:p-7 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-brand-turquoise/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-turquoise/5 group animate-fade-in"
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-6 right-6 h-[2px] rounded-b-full ${
                feature.accent === 'brand-turquoise' ? 'bg-brand-turquoise' : 'bg-brand-pink'
              }`} />
              
              <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 ${
                feature.accent === 'brand-turquoise' ? 'bg-brand-turquoise' : 'bg-brand-pink'
              }`}>
                <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h3 className="text-sm sm:text-base font-heading font-semibold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-white/90 font-sans">
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