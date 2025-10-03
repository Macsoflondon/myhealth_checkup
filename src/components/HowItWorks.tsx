import { Search, Shield, CheckCircle, Award } from "lucide-react";
const HowItWorks = () => {
  return <section style={{
    backgroundColor: '#3B82F6'
  }} className="bg-[#081129]">
      <div className="max-w-7xl mx-auto px-4 bg-[#081129] py-0">
        <div style={{
        backgroundColor: '#081129'
      }} className="bg-navy !bg-[#081129] rounded-2xl shadow-lg p-6 mb-12 py-0">
          <div className="text-center mb-8">
            <h2 style={{
            color: '#22c0d4'
          }} className="mb-4 heading my-0 text-center text-white font-medium text-4xl py-2">
              How It Works
            </h2>
            <p style={{
            color: '#ffffff'
          }} className="max-w-2xl mx-auto text-center text-[#22c0d4] font-normal text-base">Three Simple Steps - Booking your test in just a few clicks couldn't be easier!</p>
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
            <div key={index} className="bg-white/5 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#22c0d4]/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-[#22c0d4]" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-white/80">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;