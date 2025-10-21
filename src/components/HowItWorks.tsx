import { Search, Shield, CheckCircle, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
const HowItWorks = () => {
  return <section className="bg-white lg:py-20 py-[44px]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl shadow-xl p-8 lg:p-12 mb-12 py-[8px]">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="mb-4 text-4xl lg:text-5xl font-bold text-[#22c0d4]">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-lg lg:text-xl font-medium text-[#081129]">
              Four Simple Steps - Booking your test in just a few clicks couldn't be easier!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
          }].map((item, index) => <Card key={index} className="text-center p-3 bg-[#081129] shadow-white shadow-lg">
              <item.icon className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-[#E70D69] text-xs font-bold mb-1">
                Step {item.step}
              </div>
              <h3 className="mb-1 text-[#22c0d4] text-base font-bold">
                {item.title}
              </h3>
              <p className="text-[#22c0d4] font-semibold text-base">
                {item.description}
              </p>
            </Card>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;