import { Heart, BookOpen, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const HereToHelp = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Health Guides",
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
      description: "Get in touch with our friendly support team.",
      link: "/contact"
    }
  ];

  return (
    <section className="py-10 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="inline-flex items-center gap-2 text-[hsl(var(--secondary))]">
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-xs sm:text-sm font-semibold">Here to Help</span>
            </div>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-heading font-bold text-center mb-4 sm:mb-6 px-2">
            <span className="text-[hsl(var(--navy))]">You're Never Alone on Your </span>
            <span className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--secondary))] bg-clip-text text-transparent">
              Health Journey
            </span>
          </h2>

          <p className="text-center text-gray-600 text-sm sm:text-base md:text-lg mb-8 sm:mb-12 max-w-2xl mx-auto px-2">
            Whether you're testing for the first time or monitoring an ongoing condition, we're here to support you every step of the way.
          </p>

          {/* Resource Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            {resources.map((resource, index) => (
              <Link
                key={index}
                to={resource.link}
                className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:shadow-md hover:-translate-y-1 transition-all group"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center mb-3 sm:mb-4 group-hover:bg-[hsl(var(--primary))] transition-colors">
                  <resource.icon className="w-5 h-5 sm:w-7 sm:h-7 text-[hsl(var(--primary))] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[hsl(var(--navy))] mb-1 sm:mb-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                  {resource.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HereToHelp;
