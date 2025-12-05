import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroBackground } from "@/components/common/ResponsiveImage";

const HeroNew = () => {
  return (
    <section className="relative min-h-[70vh] sm:min-h-[85vh] flex items-center overflow-hidden">
      {/* Optimized Background Image with WebP and srcset */}
      <HeroBackground
        src="/lovable-uploads/hero-bg-pink-tubes.jpeg"
        webpSrc="/lovable-uploads/hero-bg-pink-tubes.webp"
        alt=""
        overlayClassName="bg-[hsl(var(--navy))]/70"
      />

      <div className="container mx-auto px-3 sm:px-4 relative z-10 py-8 sm:py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[hsl(var(--navy))]/80 border border-[hsl(var(--primary))]/30 mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[hsl(var(--primary))]" />
            <span className="text-xs sm:text-sm font-medium text-white">UK's #1 Health Test Comparison Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Compare trusted private health tests across the UK
          </h1>

          {/* Subheadline */}
          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-2">
            Your health is your greatest asset. Compare accredited providers in one place and book with confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-10 px-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl w-full sm:w-auto"
            >
              <Link to="/compare">
                Find a test
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl backdrop-blur-sm w-full sm:w-auto"
            >
              <Link to="/assisted-test-finder">
                Take the health quiz
              </Link>
            </Button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 md:gap-8 text-white/80 text-xs sm:text-sm px-4">
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[hsl(var(--primary))]" />
              <span>Independent & transparent</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[hsl(var(--primary))]" />
              <span>UKAS accredited labs</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[hsl(var(--primary))]" />
              <span>Free to use</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
