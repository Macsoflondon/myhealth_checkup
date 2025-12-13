import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroBackground } from "@/components/common/ResponsiveImage";
const HeroNew = () => {
  return <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      {/* Optimized Background Image with WebP and srcset */}
      <HeroBackground src="/lovable-uploads/hero-bg-pink-tubes.jpeg" webpSrc="/lovable-uploads/hero-bg-pink-tubes.webp" alt="" overlayClassName="bg-[hsl(var(--navy))]/70" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-10 sm:py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge with animation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--navy))]/90 border border-[hsl(var(--primary))]/40 mb-5 sm:mb-6 animate-fade-in shadow-lg bg-secondary">
            <Sparkles className="w-4 h-4 text-[hsl(var(--primary))] animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-white">UK's  #1  Health  Test  Comparison  Platform</span>
          </div>

          {/* Headline with improved mobile sizing */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-5 sm:mb-6 leading-tight animate-fade-in [animation-delay:100ms]">
            Compare trusted private health tests across the UK
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-8 sm:mb-10 max-w-3xl mx-auto leading-relaxed animate-fade-in [animation-delay:200ms]">
            Your health is your greatest asset. Compare accredited providers in one place and book with confidence.
          </p>

          {/* CTAs with improved visibility and touch targets */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10 sm:mb-12 px-2 animate-fade-in [animation-delay:300ms]">
            <Button asChild size="lg" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-8 py-6 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px] shadow-lg shadow-[hsl(var(--primary))]/30 hover:shadow-xl hover:shadow-[hsl(var(--primary))]/40 transition-all duration-300 hover:-translate-y-0.5">
              <Link to="/compare">
                Find a test
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white/50 bg-white/15 text-white hover:bg-white hover:text-[hsl(var(--navy))] px-8 py-6 text-base sm:text-lg rounded-xl backdrop-blur-md w-full sm:w-auto min-h-[52px] transition-all duration-300 hover:-translate-y-0.5 shadow-lg">
              <Link to="/assisted-test-finder">
                Take the health quiz
              </Link>
            </Button>
          </div>

          {/* Trust Points with improved layout and visibility */}
          <div className="flex flex-wrap gap-3 sm:gap-4 text-white animate-fade-in [animation-delay:400ms] justify-center">
            <div className="flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/20 bg-primary">
              <div className="w-2 h-2 rounded-full shrink-0 bg-secondary" />
              <span className="text-base font-sans font-semibold text-primary-foreground">Independent </span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/20 bg-primary">
              <div className="w-2 h-2 rounded-full bg-[#e70d69] shrink-0" />
              <span className="text-base font-sans font-semibold text-primary-foreground">Transparent</span>
            </div>
            <div className="flex items-center gap-2 backdrop-blur-sm px-4 py-2 rounded-full border-2 border-white/20 bg-primary">
              <div className="w-2 h-2 rounded-full shrink-0 bg-secondary" />
              <span className="text-base font-sans font-semibold text-primary-foreground">Free to use</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroNew;