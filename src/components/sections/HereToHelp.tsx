import { BookOpen, HelpCircle, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";


const HereToHelp = () => {
  const resources = [
    {
      icon: BookOpen,
      title: "Health Hub",
      description: "In-depth articles on tests, conditions and what your results mean.",
      link: "/blog",
      accent: "brand-turquoise"
    },
    {
      icon: HelpCircle,
      title: "FAQs",
      description: "Answers to common questions about testing and our platform.",
      link: "/faqs",
      accent: "brand-pink"
    },
    {
      icon: MessageCircle,
      title: "Contact Us",
      description: "Get in touch with our team for personalised support.",
      link: "/contact",
      accent: "brand-turquoise"
    }
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            
            {/* Left Column */}
            <div>
              <div className="flex items-center gap-2 mb-4 justify-center lg:justify-start">
                <div className="h-px w-6 bg-brand-pink" />
                <span className="text-brand-pink text-xs font-semibold uppercase tracking-wider">Here to Help</span>
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-center lg:text-left text-brand-pink">
                You're Never Alone on Your Health Journey
              </h2>

              <p className="text-gray-600 font-sans text-sm sm:text-base md:text-lg max-w-lg mt-4 text-center lg:text-left mx-auto lg:mx-0">
                Whether you're testing for the first time or monitoring an ongoing condition, we're here to support you every step of the way.
              </p>
            </div>

            {/* Right Column - Resource Cards */}
            <div className="flex flex-col gap-4">
              {resources.map((resource, index) => (
                <Link
                  key={index}
                  to={resource.link}
                  className="flex items-start gap-4 sm:gap-5 bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group border border-gray-100 hover:border-brand-turquoise/30"
                >
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors duration-300 ${
                    resource.accent === 'brand-turquoise' 
                      ? 'bg-brand-turquoise/10 group-hover:bg-brand-turquoise' 
                      : 'bg-brand-pink/10 group-hover:bg-brand-pink'
                  }`}>
                    <resource.icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-colors duration-300 ${
                      resource.accent === 'brand-turquoise'
                        ? 'text-brand-turquoise group-hover:text-white'
                        : 'text-brand-pink group-hover:text-white'
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
  );
};

export default HereToHelp;