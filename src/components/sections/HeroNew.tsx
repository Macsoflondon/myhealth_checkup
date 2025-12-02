import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const HeroNew = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture>
          <source srcSet="/lovable-uploads/hero-bg-pink-tubes.webp" type="image/webp" />
          <img 
            src="/lovable-uploads/hero-bg-pink-tubes.jpeg"
            alt=""
            className="w-full h-full object-cover"
          />
        </picture>
        <div className="absolute inset-0 bg-[hsl(var(--navy))]/70" />
      </div>

      <div className="container mx-auto px-4 relative z-10 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--navy))]/80 border border-[hsl(var(--primary))]/30 mb-6">
            <Sparkles className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span className="text-sm font-medium text-white">UK's #1 Health Test Comparison Platform</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-6 leading-tight">
            Compare trusted private health tests across the UK
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Your health is your greatest asset. Compare accredited providers in one place and book with confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button 
              asChild 
              size="lg" 
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-8 py-6 text-lg rounded-xl"
            >
              <Link to="/compare">
                Find a test
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-xl backdrop-blur-sm"
            >
              <Link to="/assisted-test-finder">
                Take the health quiz
              </Link>
            </Button>
          </div>

          {/* Trust Points */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
              <span>Independent & transparent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
              <span>UKAS accredited labs</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[hsl(var(--primary))]" />
              <span>Free to use</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroNew;
