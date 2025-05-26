
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute inset-0 z-0 wave-pattern opacity-10"></div>
      
      <div className="container mx-auto px-4 py-20 sm:py-24 lg:py-32 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fadeIn">
            🧬 Start Your Journey Towards{" "}
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-health-600 to-wellness-600">
              Health, Wellness & Longevity
            </span>{" "}
            🧬
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed animate-slideUp">
            Welcome to the future of proactive wellbeing, grounded in medical precision, guided by your lifestyle.
            We offer hospital-grade diagnostics, expert-led prevention strategies, and comprehensive comparisons across trusted providers, empowering you to make informed choices and take control of your long-term health.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="text-lg px-8 py-6 bg-health-600 hover:bg-health-700 shadow-lg shadow-health-200/50">
              Explore Tests
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button variant="outline" className="text-lg px-8 py-6 border-health-300 text-health-700 hover:bg-health-50">
              View Subscriptions
            </Button>
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-health-700">3-5 days</p>
              <p className="text-gray-500">Fast Results</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-health-700">300+</p>
              <p className="text-gray-500">Test Locations</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-health-700">5⭐</p>
              <p className="text-gray-500">Customer Rating</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-health-700">UKAS</p>
              <p className="text-gray-500">Accredited Labs</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-50 to-transparent"></div>
    </div>
  );
};

export default Hero;
