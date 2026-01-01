import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-[#081129] via-[#081129] to-[#1a0a1a]">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 border border-white/20 mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#22c0d4]" />
            <span className="text-xs sm:text-sm font-medium text-white">Start Your Journey Today</span>
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-white mb-4 sm:mb-6 px-2">
            Take Control of Your Health Today
          </h2>

          <p className="text-gray-300 font-sans text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
            Your health is your greatest asset. Compare trusted tests, find the right provider, and book with confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <Button 
              asChild 
              variant="shimmer"
              size="lg" 
              className="px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <Link to="/compare">
                Compare tests
                <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl backdrop-blur-sm w-full sm:w-auto min-h-[52px]"
            >
              <Link to="/assisted-test-finder">
                Take the health quiz
              </Link>
            </Button>
          </div>

          {/* Trust Points */}
          <p className="text-gray-400 font-sans text-sm">
            Free to use • No registration required • Fully independent
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
