import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#081129]/10 border border-[#081129]/20 mb-4 sm:mb-6">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#22c0d4]" />
            <span className="text-xs sm:text-sm font-medium text-[#081129]">Start Your Journey Today</span>
          </div>

          <SectionHeading 
            title="Take Control of Your" 
            gradientText="Health Today"
            className="mb-4 sm:mb-6"
          />

          <p className="text-gray-600 font-sans text-sm sm:text-base md:text-lg mb-8 sm:mb-10 max-w-2xl mx-auto px-2">
            Your health is your greatest asset. Compare trusted tests, find the right provider, and book with confidence.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <Button 
              asChild 
              size="lg" 
              className="bg-[#22c0d4] text-white hover:bg-[#e70d69] px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300 shadow-elevation-2 hover:shadow-elevation-4"
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
              className="border-2 border-[#081129]/30 bg-[#081129]/10 text-[#081129] hover:bg-[#081129]/20 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <Link to="/assisted-test-finder">
                Take the health quiz
              </Link>
            </Button>
          </div>

          {/* Trust Points */}
          <p className="text-gray-500 font-sans text-sm">
            Free to use • No registration required • Fully independent
          </p>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
