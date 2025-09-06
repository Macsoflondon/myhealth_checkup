import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Clock, Award, Users } from "lucide-react";
const EnhancedHero = () => {
  return <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 rounded-none px-[10px] py-[10px] mx-[100px]">
      <div className="container mx-auto px-4 py-16 sm:py-20 relative z-10 rounded-xl bg-[#081129] text-center my-[100px] font-semibold text-3xl text-white">
        <div className="max-w-4xl mx-auto text-center bg-[0#] bg-[#081129] rounded-xl">
          <h1 className="text-3xl md:text-5xl mb-6 lg:text-5xl text-[#081129] text-center font-bold">MyHealth Checkup</h1>
          
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Find the best blood tests, health checks, and diagnostic services across the UK. Compare prices, reviews, and book instantly.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input type="text" placeholder="Search for blood tests, providers, or conditions..." className="w-full px-6 py-4 rounded-lg text-lg border-0 shadow-lg focus:ring-2 focus:ring-blue-300 pr-16" />
              <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white px-6">
                Search Tests
              </Button>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-blue-100">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              NHS Approved Labs
            </div>
            <div className="flex items-center">
              <Award className="w-4 h-4 mr-2" />
              UKAS Accredited
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              50,000+ Tests Booked
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              Free GP Consultation
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default EnhancedHero;