import { TestTube, Users, CheckCircle } from "lucide-react";
const Enhanced3StepProcess = () => {
  const steps = [
    {
      number: "01",
      icon: <TestTube className="w-8 h-8 text-health-600" />,
      title: "Choose Your Test",
      description: "Browse our curated selection of health tests from trusted UK providers. Compare prices, features, and reviews to find the perfect test for your needs."
    },
    {
      number: "02", 
      icon: <Users className="w-8 h-8 text-health-600" />,
      title: "Book with Provider",
      description: "Connect directly with your chosen provider to book your appointment. Our partners offer flexible scheduling including home visits and clinic appointments."
    },
    {
      number: "03",
      icon: <CheckCircle className="w-8 h-8 text-health-600" />,
      title: "Get Your Results",
      description: "Receive your comprehensive results typically within 24-48 hours. Many providers include expert consultations to help you understand your health data."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-health-700">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Getting your health test is simple and straightforward with our trusted network of providers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="bg-health-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                {step.icon}
              </div>
              <div className="text-sm font-bold text-health-600 mb-2">STEP {step.number}</div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full">
                  <div className="w-8 h-0.5 bg-health-200 mx-auto"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Enhanced3StepProcess;