import { MousePointerClick, PackageOpen, FlaskConical, FileText } from "lucide-react";
const HowItWorks = () => {
  const steps = [{
    icon: <MousePointerClick className="h-8 w-8 text-health-600" />,
    title: "Choose Your Test",
    description: "Select from individual tests or comprehensive health panels based on your needs."
  }, {
    icon: <PackageOpen className="h-8 w-8 text-health-600" />,
    title: "Collect Your Sample",
    description: "Take your test at home with our easy-to-use kits or visit a local partner pharmacy."
  }, {
    icon: <FlaskConical className="h-8 w-8 text-health-600" />,
    title: "Lab Analysis",
    description: "Your sample is processed in our UKAS-accredited laboratories with results in 48 hours."
  }, {
    icon: <FileText className="h-8 w-8 text-health-600" />,
    title: "Review Results",
    description: "Access clear results with doctor-reviewed guidance and actionable health insights."
  }];
  return <section className="py-16 bg-[#e3edf7]">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">Fast, simple, stress-free health testing.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => <div key={index} className="text-center">
              <div className="relative mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-health-50 flex items-center justify-center">
                  {step.icon}
                </div>
                {index < steps.length - 1 && <div className="hidden lg:block absolute top-10 left-[60%] right-0 h-0.5 w-full bg-[#081129]" />}
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-[t#] rounded-none bg-[#0084c7]">
                  <span className="w-8 h-8 rounded-full bg-health-600 flex items-center justify-center font-bold mx-0 my-0 py-0 px-0 text-2xl text-slate-50">
                    {index + 1}
                  </span>
                </div>
              </div>
              <h3 className="text-xl mb-2 text-center text-[#081129] font-extrabold">{step.title}</h3>
              <p className="text-[#081129] text-center font-semibold">{step.description}</p>
            </div>)}
        </div>
      </div>
    </section>;
};
export default HowItWorks;