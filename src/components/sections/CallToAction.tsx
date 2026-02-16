import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeading } from "@/components/ui/section-heading";

interface CallToActionProps {
  className?: string;
}

const CallToAction = ({ className }: CallToActionProps) => {
  const navigate = useNavigate();
  
  return <section className={cn("py-16 bg-[#081129] relative overflow-hidden", className)}>
      {/* Decorative half-circles */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-brand-turquoise/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-brand-pink/5 rounded-full translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 right-0 w-44 h-44 bg-brand-turquoise/5 rounded-full translate-x-1/2" />
      <div className="absolute bottom-0 left-1/4 w-36 h-36 bg-brand-pink/5 rounded-full translate-y-1/2" />

      <div className="container mx-auto px-4 relative">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeading 
            title="Take Control of" 
            gradientText="Your Health Today" 
            className="mb-6"
            titleClassName="text-white"
          />
          <p className="text-xl mb-8 text-white/90 my-0 py-0">
            Join thousands of customers who've discovered health insights that made a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/assisted-test-finder')}
              className="bg-[#22c0d4] hover:bg-[#e70d69] text-white font-semibold rounded-xl shadow-lg transition-colors duration-300"
            >
              Find Your Perfect Test
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/compare')}
              className="bg-[#e70d69] hover:bg-[#22c0d4] text-white font-semibold rounded-xl shadow-lg transition-colors duration-300"
            >
              Browse All 300+ Tests
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;