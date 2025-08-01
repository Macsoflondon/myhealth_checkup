import { MousePointerClick, PackageOpen, FlaskConical, FileText } from "lucide-react";
const HowItWorks = () => {
  const steps = [{
    icon: <MousePointerClick className="h-8 w-8 text-health-600" />,
    title: "Choose Your Test",
    description: "Browse our comprehensive comparison of UK health providers and select tests tailored to your specific health needs and concerns."
  }, {
    icon: <PackageOpen className="h-8 w-8 text-health-600" />,
    title: "Collect Your Sample",
    description: "Convenient home testing kits or professional blood draws at partner clinics - choose what works best for your lifestyle."
  }, {
    icon: <FlaskConical className="h-8 w-8 text-health-600" />,
    title: "Laboratory Analysis",
    description: "Your samples are processed in UKAS-accredited laboratories using hospital-grade equipment with results typically available in 48-72 hours."
  }, {
    icon: <FileText className="h-8 w-8 text-health-600" />,
    title: "Expert Results & Guidance",
    description: "Receive comprehensive results with doctor-reviewed insights, personalized recommendations, and clear next steps for your health journey."
  }];

  return <section className="py-20 bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Simple, professional health testing designed around your busy lifestyle - from selection to results in just a few days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-health-primary to-health-accent flex items-center justify-center shadow-lg">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-health-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-[calc(100%+1rem)] w-8 h-0.5 bg-gradient-to-r from-health-primary to-health-accent opacity-30" />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{step.title}</h3>
                <p className="text-gray-600 text-center leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>;
};
export default HowItWorks;