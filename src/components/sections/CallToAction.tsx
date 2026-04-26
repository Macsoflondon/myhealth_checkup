import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";
import { NavyDecorativeCircles } from "@/components/ui/navy-decorative-circles";

interface CallToActionProps {
  className?: string;
}

const CallToAction = ({ className }: CallToActionProps) => {
  const navigate = useNavigate();
  
  return <section className={cn("py-10 bg-[#081129] relative overflow-hidden", className)}>
      <NavyDecorativeCircles />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeading 
            title="Take Control of" 
            gradientText="Your Health Today" 
            className="mb-6"
            titleClassName="text-white"
          />
          <p className="text-xl mb-5 text-white/90 my-0 py-0">
            Join thousands of customers who've discovered health insights that made a difference.
          </p>
          <div className="flex flex-row gap-2 sm:gap-3 justify-center items-center flex-wrap">
            <Button 
              size="sm" 
              onClick={() => navigate('/assisted-test-finder')}
              className="flex-1 sm:flex-none sm:w-56 max-w-[48%] bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold rounded-xl shadow-lg transition-colors duration-300"
            >
              Find Your Perfect Test
            </Button>
            <Button 
              size="sm" 
              onClick={() => navigate('/compare')}
              className="flex-1 sm:flex-none sm:w-56 max-w-[48%] bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold rounded-xl shadow-lg transition-colors duration-300"
            >
              Browse All 300+ Tests
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;