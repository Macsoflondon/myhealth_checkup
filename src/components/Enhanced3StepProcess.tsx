import { TestTube, Users, CheckCircle } from "lucide-react";
const Enhanced3StepProcess = (): JSX.Element => {
  const steps = [{
    number: "01",
    icon: <TestTube className="w-8 h-8 text-health-600" />,
    title: "Choose Your Test",
    description: "Browse our curated selection of health tests from trusted UK providers. Compare prices, features, and reviews to find the perfect test for your needs."
  }, {
    number: "02",
    icon: <Users className="w-8 h-8 text-health-600" />,
    title: "Book with Provider",
    description: "Connect directly with your chosen provider to book your appointment. Our partners offer flexible scheduling including home visits and clinic appointments."
  }, {
    number: "03",
    icon: <CheckCircle className="w-8 h-8 text-health-600" />,
    title: "Get Your Results",
    description: "Receive your comprehensive results typically within 24-48 hours. Many providers include expert consultations to help you understand your health data."
  }];
  
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-[#22c0d4]/10 flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-[#22c0d4]">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default Enhanced3StepProcess;