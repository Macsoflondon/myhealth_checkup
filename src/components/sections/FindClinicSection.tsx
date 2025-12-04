import { Button } from "@/components/ui/button";
import { Navigation, List, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const FindClinicSection = () => {
  const stats = [
    { value: "500+", label: "Clinic Locations" },
    { value: "8+", label: "Partner Networks" },
    { value: "UK-wide", label: "Coverage" }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-xs sm:text-sm font-medium">Nationwide Coverage</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-center mb-4 sm:mb-6 px-2">
            <span className="text-[hsl(var(--navy))]">Find a Clinic </span>
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Near You
            </span>
          </h2>

          <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
            With over 500 partner clinic locations across the UK, getting a blood test has never been more convenient.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8 sm:mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-2 sm:p-4 rounded-lg sm:rounded-xl border border-gray-100">
                <div className="text-lg sm:text-2xl md:text-3xl font-bold text-[hsl(var(--primary))]">
                  {stat.value}
                </div>
                <div className="text-[10px] sm:text-sm text-gray-600 mt-0.5 sm:mt-1">
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
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto"
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
              className="border-[hsl(var(--navy))]/20 text-[hsl(var(--navy))] hover:bg-gray-50 px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto"
            >
              <Link to="/find-clinic">
                <List className="mr-2 w-4 h-4 sm:w-5 sm:h-5" />
                Browse all locations
              </Link>
            </Button>
          </div>
        </div>

        {/* Interactive Map Placeholder */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-[hsl(var(--primary))]/5 to-[hsl(var(--secondary))]/5 rounded-2xl p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-[hsl(var(--primary))]" />
            </div>
            <h3 className="text-xl font-semibold text-[hsl(var(--navy))] mb-2">
              Interactive Map
            </h3>
            <p className="text-gray-600">
              Explore clinic locations from Medichecks, Goodbody, Randox, and more.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindClinicSection;
