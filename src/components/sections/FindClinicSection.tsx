import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { MapPin, Building2, Globe } from "lucide-react";

const FindClinicSection = () => {
  const stats = [
    { value: "200+", label: "Clinic Locations", icon: MapPin },
    { value: "7", label: "Partner Networks", icon: Building2 },
    { value: "UK-wide", label: "Coverage", icon: Globe },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[hsl(187,72%,97%)] to-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 max-w-6xl mx-auto items-center">
          
          {/* Left Column - Find a Clinic */}
          <div>
            <SectionHeading
              title="Find a Clinic"
              gradientText="Near You"
              className="lg:text-left lg:[&>h2]:text-left"
            />

            <p className="text-gray-600 font-sans text-sm sm:text-base md:text-lg mb-8 max-w-lg text-center lg:text-left mx-auto lg:mx-0">
              With over 200 partner clinic locations across the UK, getting a blood test has never been more convenient. Whether you prefer a home kit or in-clinic appointment, we've got you covered.
            </p>

            {/* Stats Row */}
            <div className="flex gap-6 sm:gap-8 mb-8 justify-center lg:justify-start">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 rounded-lg bg-brand-turquoise/10 flex items-center justify-center mx-auto mb-2">
                    <stat.icon className="w-5 h-5 text-brand-turquoise" />
                  </div>
                  <p className="text-xl sm:text-2xl font-heading font-bold text-brand-navy">{stat.value}</p>
                  <p className="text-xs text-gray-500 font-sans">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center lg:items-start">
              <Button
                asChild
                size="lg"
                className="bg-brand-turquoise hover:bg-brand-pink text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
              >
                <Link to="/find-clinic">
                  Find your nearest clinic
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-brand-pink hover:bg-brand-turquoise text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
              >
                <Link to="/find-clinic">
                  Browse all clinic locations
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - CTA Card */}
          <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-turquoise/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-pink/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              {/* Badge */}
              <div className="flex justify-center mb-5">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-turquoise/30 bg-brand-turquoise/10">
                  <span className="text-xs sm:text-sm font-medium text-brand-turquoise">Start Your Journey Today</span>
                </div>
              </div>

              <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-white text-center mb-4">
                Take Control of Your{" "}
                <span className="bg-gradient-to-r from-brand-turquoise to-brand-pink bg-clip-text text-transparent">
                  Health Today
                </span>
              </h3>

              <p className="text-white/70 font-sans text-sm sm:text-base text-center mb-8 max-w-md mx-auto">
                Your health is your greatest asset. Compare trusted tests, find the right provider, and book with confidence.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-5">
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-turquoise hover:bg-brand-pink text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
                >
                  <Link to="/compare">
                    Compare tests
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  className="bg-brand-pink hover:bg-brand-turquoise text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
                >
                  <Link to="/assisted-test-finder">
                    Take the health quiz
                  </Link>
                </Button>
              </div>

              {/* Trust Points */}
              <p className="text-white/40 font-sans text-xs sm:text-sm text-center">
                Free to use · No registration required · Fully independent
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindClinicSection;