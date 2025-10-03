import { Search, Shield, CheckCircle, Award } from "lucide-react";
const HowItWorks = () => {
  return <section style={{
    backgroundColor: '#3B82F6'
  }} className="bg-[#081129]">
      <div className="max-w-7xl mx-auto px-4 bg-[#081129] py-0">
        <div style={{
        backgroundColor: '#081129'
      }} className="bg-navy !bg-[#081129] rounded-2xl shadow-lg p-8 mb-12 py-0">
          <div className="text-center mb-16">
            <h2 style={{
            color: '#22c0d4'
          }} className="mb-4 heading my-0 text-center font-medium text-4xl py-[20px] text-white">
              How It Works
            </h2>
            <p style={{
            color: '#ffffff'
          }} className="max-w-2xl mx-auto text-center text-base font-normal text-white">Four Simple Steps - Booking your test in just a few clicks couldn't be easier!</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
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
          }].map((item, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 h-full border-2 border-transparent hover:border-health-primary">
                <div className="flex items-start gap-4 mb-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-health-primary/10 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-health-primary" />
                  </div>
                  <div className="flex-shrink-0 text-4xl font-bold text-health-primary/20">
                    {item.step}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-navy mb-3">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;