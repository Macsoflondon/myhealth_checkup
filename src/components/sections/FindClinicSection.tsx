import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";

const FindClinicSection = () => {
  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Heading */}
          <SectionHeading 
            title="Find a Clinic" 
            gradientText="Near You" 
          />

          <p className="text-center text-gray-600 font-sans text-sm sm:text-base md:text-lg mb-6 sm:mb-10 max-w-2xl mx-auto px-2">
            With over 500 partner clinic locations across the UK, getting a blood test has never been more convenient.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
            <Button 
              asChild 
              size="lg" 
              className="bg-[#22c0d4] hover:bg-[#e70d69] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
            >
              <Link to="/find-clinic">
                Find nearest clinic
              </Link>
            </Button>
            <Button 
              asChild 
              size="lg" 
              className="bg-[#e70d69] hover:bg-[#22c0d4] text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
            >
              <Link to="/find-clinic">
                Browse all locations
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FindClinicSection;
