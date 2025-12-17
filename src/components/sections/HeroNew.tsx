import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroBackground } from "@/components/common/ResponsiveImage";
const HeroNew = () => {
  return <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] flex items-center overflow-hidden">
      <HeroBackground src="/lovable-uploads/hero-bg-pink-tubes.jpeg" webpSrc="/lovable-uploads/hero-bg-pink-tubes.webp" alt="" overlayClassName="bg-[hsl(var(--navy))]/70" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-8 sm:py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[hsl(var(--navy))]/90 border border-[hsl(var(--primary))]/40 mb-4 sm:mb-6 animate-fade-in shadow-lg">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--primary))] animate-pulse" />
            <span className="text-[11px] sm:text-sm font-medium text-white">UK's #1 Health Test Comparison</span>
          </div>

          {/* Headline - optimized for mobile */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight animate-fade-in px-2 lg:text-5xl">Compare trusted private health tests across the UK     Clear pricing. Clear biomarkers. No confusion.
        </h1>

          {/* CTAs - full width on mobile */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-10 px-2 animate-fade-in">
            <Button asChild size="lg" className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl w-full sm:w-auto min-h-[52px] shadow-lg transition-all duration-200 active:scale-[0.98]">
              <Link to="/compare">Find a test</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-2 border-white/50 bg-white/15 text-white hover:bg-white hover:text-[hsl(var(--navy))] px-6 sm:px-8 py-5 sm:py-6 text-base rounded-xl backdrop-blur-md w-full sm:w-auto min-h-[52px] transition-all duration-200 active:scale-[0.98]">
              <Link to="/assisted-test-finder">Take the health quiz</Link>
            </Button>
          </div>

          {/* Trust Points - stack on mobile */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-white animate-fade-in justify-center px-2">
            <div className="flex items-center gap-1.5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 bg-[hsl(var(--navy))]/80 bg-primary">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[hsl(var(--primary))] bg-secondary" />
              <span className="text-xs sm:text-sm font-medium">Independent</span>
            </div>
            <div className="flex items-center gap-1.5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 bg-[hsl(var(--navy))]/80 bg-secondary">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[hsl(var(--secondary))] bg-primary" />
              <span className="text-xs sm:text-sm font-medium">Transparent</span>
            </div>
            <div className="flex items-center gap-1.5 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20 bg-[hsl(var(--navy))]/80 bg-primary">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-secondary" />
              <span className="text-xs sm:text-sm font-medium">Clear Pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default HeroNew;