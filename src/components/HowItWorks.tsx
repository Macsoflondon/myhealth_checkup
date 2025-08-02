import { Search, Shield, CheckCircle, Award } from "lucide-react";

const HowItWorks = () => {
  return (
    <section className="py-20 luxury-gradient">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2A3656] mb-4 heading">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Simple, transparent, and secure - book your health services in just a few clicks
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: "1",
              title: "Search & Compare",
              description: "Explore tests, review biomarkers, compare pricing",
              icon: Search
            },
            {
              step: "2",
              title: "Choose Provider",
              description: "Choose a trusted provider that fits your needs and budget",
              icon: Shield
            },
            {
              step: "3",
              title: "Book Appointment",
              description: "Securely Book and Attend your appointment with instant confirmation",
              icon: CheckCircle
            },
            {
              step: "4",
              title: "Get Results",
              description: "Arrange your test and send your sample",
              icon: Award
            }
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-[#FA6980] to-[#4A6FA5] rounded-full flex items-center justify-center mx-auto">
                  <item.icon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#2A3656] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-[#2A3656] mb-2 heading">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;