import { Search, Shield, CheckCircle, Award } from "lucide-react";
const HowItWorks = () => {
  return <section style={{
    backgroundColor: '#3B82F6'
  }} className="bg-[#081129]">
      <div className="max-w-7xl mx-auto px-4 bg-[#081129] py-[4px]">
        <div className="bg-navy !bg-[#081129] rounded-2xl shadow-lg p-8 mb-12" style={{
        backgroundColor: '#081129'
      }}>
          <div className="text-center mb-16">
            <h2 style={{
            color: '#22c0d4'
          }} className="mb-4 heading my-0 text-center text-white py-0 font-medium text-4xl">
              How It Works
            </h2>
            <p style={{
            color: '#ffffff'
          }} className="max-w-2xl mx-auto text-center font-normal text-base text-[#22c0d4]">
              Four Simple Steps - Booking your test in just a few clicks couldn't be easier!
            </p>
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
          }].map((item, index) => <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-[#FA6980] to-[#4A6FA5] rounded-full flex items-center justify-center mx-auto">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center bg-teal !bg-[#22c0d4]" style={{
                backgroundColor: '#22c0d4'
              }}>
                    <span className="text-white font-bold text-sm">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2 heading text-teal !text-[#22c0d4]" style={{
              color: '#22c0d4'
            }}>
                  {item.title}
                </h3>
                <p className="text-white font-medium !text-white" style={{
              color: '#ffffff'
            }}>
                  {item.description}
                </p>
              </div>)}
          </div>
        </div>
      </div>
    </section>;
};
export default HowItWorks;