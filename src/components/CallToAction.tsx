import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";

const CallToAction = () => {
  const navigate = useNavigate();
  
  return <section className="py-16 bg-[#081129]">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center text-[#22c0d4]">
            Take Control of Your Health Today
          </h2>
          <p className="text-xl mb-8 text-white/90 my-0 py-0">
            Join thousands of customers who've discovered health insights that made a difference.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/assisted-test-finder')}
              className="bg-[#e70d69] hover:bg-[#e70d69]/90 text-white font-semibold rounded-xl shadow-lg group"
            >
              Find Your Perfect Test
              <Search className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              onClick={() => navigate('/compare-tests')}
              variant="outline" 
              className="border-2 border-white text-white hover:bg-white hover:text-[#081129] bg-transparent font-semibold rounded-xl group"
            >
              Browse All 300+ Tests
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
export default CallToAction;