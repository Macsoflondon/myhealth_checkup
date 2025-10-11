import { Search, Shield, CheckCircle, Award } from "lucide-react";
const HowItWorks = () => {
  return <section className="bg-white py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 lg:p-12 mb-12">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="mb-4 text-4xl lg:text-5xl font-bold text-[#22c0d4]">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-lg lg:text-xl font-medium text-[#081129]">
              Four Simple Steps - Booking your test in just a few clicks couldn't be easier!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {[{
            step: "1",
            title: "Search & Compare",
            description: "Explore tests, review biomarkers, compare pricing",
            icon: Search
          }, {
            step: "2",
            title: "Choose Provider",
            description: "Choose a trusted provider that fits your needs and budget",
            icon: Shield
          }, {
            step: "3",
            title: "Book Appointment",
            description: "Securely Book and Attend your appointment with instant confirmation",
            icon: CheckCircle
          }, {
            step: "4",
            title: "Get Results",
            description: "Receive your results and recommendations securely online within 3-5 days",
            icon: Award
          }].map((item, index) => <div 
                key={index} 
                className="group relative bg-white rounded-xl border-l-4 border-gray-200 hover:border-[#22c0d4] shadow-md hover:shadow-xl transition-all duration-300 p-6 lg:p-8"
              >
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-[#FA6980] to-[#22c0d4] shadow-lg z-10">
                  <span className="text-white font-bold text-lg">{item.step}</span>
                </div>

                {/* Icon Container */}
                <div className="mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#FA6980] to-[#4A6FA5] rounded-2xl flex items-center justify-center mx-auto transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold mb-3 text-[#22c0d4] text-center">
                  {item.title}
                </h3>
                <p className="text-center text-[#081129] text-base lg:text-lg leading-relaxed">
                  {item.description}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;