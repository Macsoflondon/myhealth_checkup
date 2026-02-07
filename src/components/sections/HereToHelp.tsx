import { Heart, BookOpen, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { SectionHeading } from "@/components/ui/section-heading";

const HereToHelp = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Health Hub",
      description: "In-depth articles on tests, conditions and what your results mean.",
      link: "/blog"
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Answers to common questions about testing and our platform.",
      link: "/faqs"
    },
    {
      icon: MessageCircle,
      title: "Contact Us",
      description: "Get in touch with our team for personalised support.",
      link: "/contact"
    }
  ];

  return (
    <section className="pt-10 pb-8 sm:pt-12 sm:pb-10 md:pt-14 md:pb-12 lg:pt-16 lg:pb-14 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
            {/* Left Column - Heading & Description */}
            <div>
              {/* Badge */}
              <div className="flex mb-4 sm:mb-5">
                <div className="inline-flex items-center gap-2 text-[#e70d69]">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-xs sm:text-sm font-semibold">Here to Help</span>
                </div>
              </div>

              <SectionHeading
                title="You're Never Alone on Your"
                gradientText="Health Journey"
                className="text-left [&>h2]:text-left"
              />

              <p className="text-gray-600 font-sans text-sm sm:text-base md:text-lg max-w-lg mt-4">
                Whether you're testing for the first time or monitoring an ongoing condition, we're here to support you every step of the way.
              </p>
            </div>

            {/* Right Column - Stacked Resource Cards */}
            <div className="flex flex-col gap-4 sm:gap-5">
              {resources.map((resource, index) => (
                <Link
                  key={index}
                  to={resource.link}
                  className="flex items-start gap-4 sm:gap-5 bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-[#22c0d4]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#22c0d4] transition-colors">
                    <resource.icon className="w-5 h-5 sm:w-6 sm:h-6 text-[#22c0d4] group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-heading font-semibold text-[#081129] mb-1">
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
  );
};

export default HereToHelp;
