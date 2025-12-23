import { Button } from "@/components/ui/button";
import { Sparkles, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroBackground } from "@/components/common/ResponsiveImage";

const HeroNew = () => {
  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:min-h-[75vh] flex items-center overflow-hidden">
      <HeroBackground 
        src="/lovable-uploads/hero-bg-pink-tubes.jpeg" 
        webpSrc="/lovable-uploads/hero-bg-pink-tubes.webp" 
        alt="" 
        overlayClassName="bg-[hsl(var(--navy))]/70" 
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-8 sm:py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge - Turquoise themed */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[hsl(var(--secondary))] mb-5 sm:mb-7 animate-fade-in shadow-lg">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white animate-pulse" />
            <span className="text-[11px] sm:text-sm font-semibold text-white tracking-wide">UK's #1 Health Test Comparison</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white mb-5 sm:mb-7 leading-tight animate-fade-in px-2">
            Find the right private health test for you
          </h1>

          {/* CTAs - Balanced proportions */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 px-2 animate-fade-in">
            <Button 
              asChild 
              size="lg" 
              className="bg-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/90 text-white px-8 py-6 text-base font-semibold rounded-xl w-full sm:w-auto min-w-[200px] shadow-lg transition-all duration-200 active:scale-[0.98]"
            >
              <Link to="/compare">Find a test</Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-2 border-[hsl(var(--secondary))] bg-transparent text-white hover:bg-[hsl(var(--secondary))] hover:text-white px-8 py-6 text-base font-semibold rounded-xl w-full sm:w-auto min-w-[200px] transition-all duration-200 active:scale-[0.98]"
            >
              <Link to="/assisted-test-finder">Take the health quiz</Link>
            </Button>
          </div>

          {/* Trust Points - All turquoise themed */}
          <div className="flex flex-wrap gap-3 sm:gap-4 text-white animate-fade-in justify-center px-2">
            <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] px-4 py-2 rounded-full shadow-md">
              <Check className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-medium">Independent</span>
            </div>
            <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] px-4 py-2 rounded-full shadow-md">
              <Check className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-medium">Transparent</span>
            </div>
            <div className="flex items-center gap-2 bg-[hsl(var(--secondary))] px-4 py-2 rounded-full shadow-md">
              <Check className="w-4 h-4 text-white" />
              <span className="text-xs sm:text-sm font-medium">Clear Pricing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;