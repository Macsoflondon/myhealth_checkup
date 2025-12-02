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
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Nationwide Coverage</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-center mb-6">
            <span className="text-[hsl(var(--navy))]">Find a Clinic </span>
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Near You
            </span>
          </h2>

          <p className="text-center text-gray-600 text-lg mb-10 max-w-2xl mx-auto">
            With over 500 partner clinic locations across the UK, getting a blood test has never been more convenient. Whether you prefer a home kit or in-clinic appointment, we've got you covered.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-4 rounded-xl border border-gray-100">
                <div className="text-2xl md:text-3xl font-bold text-[hsl(var(--primary))]">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              asChild 
              size="lg" 
              className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 text-white px-8 py-6 text-base rounded-xl"
            >
              <Link to="/find-clinic">
                <Navigation className="mr-2 w-5 h-5" />
                Find nearest clinic
              </Link>
            </Button>
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-[hsl(var(--navy))]/20 text-[hsl(var(--navy))] hover:bg-gray-50 px-8 py-6 text-base rounded-xl"
            >
              <Link to="/find-clinic">
                <List className="mr-2 w-5 h-5" />
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
