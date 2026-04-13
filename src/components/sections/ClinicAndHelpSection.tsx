import { Link } from "react-router-dom";
import { BookOpen, HelpCircle, MessageCircle, MapPin, Building2, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import ukMapImage from "@/assets/uk-map-clinics.png";

const stats = [
  { value: "200+", label: "Clinic Locations" },
  { value: "7", label: "Partner Networks" },
  { value: "UK-wide", label: "Coverage" },
];

const trustPoints = [
  "CQC Regulated",
  "200+ Locations",
  "Walk-in Available",
];

const resources = [
  {
    icon: BookOpen,
    title: "Health Hub",
    description: "In-depth articles on tests, conditions and what your results mean.",
    link: "/blog",
    accent: "turquoise" as const,
  },
  {
    icon: HelpCircle,
    title: "FAQs",
    description: "Answers to common questions about testing and our platform.",
    link: "/faqs",
    accent: "pink" as const,
  },
  {
    icon: MessageCircle,
    title: "Contact Us",
    description: "Get in touch with our team for personalised support.",
    link: "/contact",
    accent: "turquoise" as const,
  },
];

const ClinicAndHelpSection = () => {
  return (
    <div>
      {/* Find a Clinic Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[hsl(187,72%,97%)] to-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto items-center">
            {/* Left Column - Map */}
            <div className="flex flex-col items-center">
              <img
                src={ukMapImage}
                alt="Interactive map showing clinic locations across the United Kingdom"
                loading="lazy"
                width={600}
                height={800}
                className="w-full max-w-[400px] lg:max-w-[450px] h-auto"
              />
              <p className="text-sm text-muted-foreground font-medium mt-3">Interactive Map</p>
            </div>

            {/* Right Column - Navy Card */}
            <div className="bg-brand-navy rounded-2xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-turquoise/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-pink/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative">
                {/* Badge */}
                <div className="flex items-center gap-2 mb-5 justify-center">
                  <div className="h-px w-6 bg-brand-turquoise" />
                  <span className="text-brand-turquoise text-xs sm:text-sm font-semibold uppercase tracking-wider">
                    Find Your Clinic
                  </span>
                  <div className="h-px w-6 bg-brand-turquoise" />
                </div>


                <p className="text-white/80 font-sans text-sm sm:text-base text-center mb-8 max-w-md mx-auto leading-relaxed">
                  With over 200 partner clinic locations across the UK, getting a blood test has never been more convenient. Whether you prefer a home kit or in-clinic appointment, we've got you covered.
                </p>

                {/* Stats Row */}
                <div className="flex justify-center gap-6 sm:gap-10 mb-8">
                  {stats.map((stat, i) => (
                    <div key={i} className="text-center">
                      <p className="text-xl sm:text-2xl font-heading font-bold text-brand-turquoise">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-white/60 font-sans">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6">
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-turquoise hover:bg-brand-pink text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
                  >
                    <Link to="/find-clinic">Find your nearest clinic</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-pink hover:bg-brand-turquoise text-white px-6 sm:px-8 py-5 sm:py-6 text-sm sm:text-base rounded-xl w-full sm:w-auto min-h-[52px] transition-colors duration-300"
                  >
                    <Link to="/find-clinic">Browse all clinic locations</Link>
                  </Button>
                </div>

                {/* Trust Points */}
                <div className="flex flex-wrap justify-center gap-x-5 gap-y-2">
                  {trustPoints.map((point, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-brand-turquoise" />
                      <span className="text-xs sm:text-sm text-white/70 font-sans">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Here to Help Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
              {/* Left Column */}
              <div>
                <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                  <div className="h-px w-6 bg-brand-pink" />
                  <span className="text-brand-pink text-xs font-semibold uppercase tracking-wider">Here to Help</span>
                  <div className="h-px w-6 bg-brand-pink" />
                </div>

                <SectionHeading
                  title="You're Never Alone on Your"
                  gradientText="Health Journey"
                  className="lg:text-left lg:[&>h2]:text-left"
                />

                <p className="text-gray-600 font-sans text-sm sm:text-base md:text-lg max-w-lg mt-4 text-center lg:text-left mx-auto lg:mx-0">
                  Whether you're testing for the first time or proactively monitoring your health, we're here to support you every step of the way.
                </p>
              </div>

              {/* Right Column - Resource Cards */}
              <div className="flex flex-col gap-4">
                {resources.map((resource, index) => (
                  <Link
                    key={index}
                    to={resource.link}
                    className="relative flex items-start gap-4 sm:gap-5 bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group border border-gray-100 hover:border-brand-turquoise/30 overflow-hidden"
                  >
                    <div className={`absolute top-0 left-6 right-6 h-[2px] rounded-b-full ${
                      resource.accent === "turquoise" ? "bg-brand-turquoise" : "bg-brand-pink"
                    }`} />
                    <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                      resource.accent === "turquoise"
                        ? "bg-brand-turquoise/10 group-hover:bg-brand-turquoise"
                        : "bg-brand-pink/10 group-hover:bg-brand-pink"
                    }`}>
                      <resource.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                        resource.accent === "turquoise"
                          ? "text-brand-turquoise group-hover:text-white"
                          : "text-brand-pink group-hover:text-white"
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-heading font-semibold text-brand-navy mb-1">
                        {resource.title}
                      </h3>
                      <p className="text-gray-600 font-sans text-xs sm:text-sm leading-relaxed">
                        {resource.description}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClinicAndHelpSection;
