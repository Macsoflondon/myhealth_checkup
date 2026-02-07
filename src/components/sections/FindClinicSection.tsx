import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";
import { Sparkles } from "lucide-react";

const FindClinicSection = () => {
  const stats = [
    { value: "200+", label: "Clinic Locations" },
    { value: "7", label: "Partner Networks" },
    { value: "UK-wide", label: "Coverage" },
  ];

  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto items-start">
          
          {/* Left Column - Find a Clinic */}
          <div>
            <SectionHeading
              title="Find a Clinic"
              gradientText="Near You"
              className="text-left [&>h2]:text-left"
            />

            <p className="text-gray-600 font-sans text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg">
              With over 200 partner clinic locations across the UK, getting a blood test has never been more convenient. Whether you prefer a home kit or in-clinic appointment, we've got you covered.
            </p>

            {/* Stats Row */}
            <div className="flex gap-6 sm:gap-8 mb-6 sm:mb-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl sm:text-3xl font-heading font-bold text-[#081129]">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-500 font-sans">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                asChild
                size="lg"
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
              >
                <Link to="/find-clinic">
                  Find your nearest clinic
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
              >
                <Link to="/find-clinic">
                  Browse all clinic locations
                </Link>
              </Button>
            </div>
          </div>

          {/* Right Column - Start Your Journey */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10">
            {/* Badge */}
            <div className="flex justify-center mb-4 sm:mb-5">
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#081129]/10 border border-[#081129]/20">
                <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#22c0d4]" />
                <span className="text-xs sm:text-sm font-medium text-[#081129]">Start Your Journey Today</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-[#081129] text-center mb-3 sm:mb-4">
              Take Control of Your{" "}
              <span className="bg-gradient-to-r from-[#22c0d4] to-[#e70d69] bg-clip-text text-transparent">
                Health Today
              </span>
            </h3>

            <p className="text-gray-600 font-sans text-sm sm:text-base text-center mb-6 sm:mb-8 max-w-md mx-auto">
              Your health is your greatest asset. Compare trusted tests, find the right provider, and book with confidence.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-5 sm:mb-6">
              <Button
                asChild
                size="lg"
                className="bg-[#22c0d4] hover:bg-[#e70d69] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300 shadow-lg"
              >
                <Link to="/compare">
                  Compare tests
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="bg-[#e70d69] hover:bg-[#22c0d4] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300 shadow-lg"
              >
                <Link to="/assisted-test-finder">
                  Take the health quiz
                </Link>
              </Button>
            </div>

            {/* Trust Points */}
            <p className="text-gray-500 font-sans text-xs sm:text-sm text-center">
              Free to use · No registration required · Fully independent
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindClinicSection;
