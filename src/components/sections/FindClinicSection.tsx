import { Button } from "@/components/ui/button";
import { Navigation, List, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const FindClinicSection = () => {
  const stats = [
    { value: "200+", label: "Clinic Locations" },
    { value: "7+", label: "Partner Networks" },
    { value: "UK-wide", label: "Coverage" }
  ];

  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#e70d69]/10 text-[#e70d69]">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Nationwide Coverage</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-[#081129] mb-2">
              Find a Clinic
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent inline-block" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Near You
            </h2>
          </div>

          <p className="text-center text-gray-600 font-sans text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
            With over 500 partner clinic locations across the UK, getting a blood test has never been more convenient.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-10">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-2 sm:p-4 rounded-lg sm:rounded-xl border-2 border-[#22c0d4]/30 hover:border-[#22c0d4] hover:shadow-lg hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-lg sm:text-2xl md:text-3xl font-heading font-bold text-[#22c0d4]">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-sm text-gray-600 font-sans mt-0.5 sm:mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Button 
              asChild 
              size="lg" 
              className="bg-[#22c0d4] hover:bg-[#22c0d4]/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <Link to="/find-clinic">
                <Navigation className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Find nearest clinic
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-2 border-[#081129]/20 text-[#081129] hover:bg-gray-50 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px]"
            >
              <Link to="/find-clinic">
                <List className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Browse all locations
              </Link>
            </Button>
          </div>
        </div>

        {/* Interactive Map Placeholder - optimized for mobile */}
        <div className="mt-8 sm:mt-12 max-w-4xl mx-auto px-2">
          <div className="bg-gradient-to-br from-[#22c0d4]/5 to-[#e70d69]/5 rounded-xl sm:rounded-2xl p-6 sm:p-12 text-center">
            <div className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl bg-[#22c0d4]/10 flex items-center justify-center">
              <MapPin className="w-7 h-7 sm:w-10 sm:h-10 text-[#22c0d4]" />
            </div>
            <h3 className="text-lg sm:text-xl font-heading font-semibold text-[#081129] mb-2">
              Interactive Map
            </h3>
            <p className="text-sm sm:text-base text-gray-600 font-sans">
              Explore clinic locations from Medichecks, Goodbody, Randox, and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindClinicSection;
