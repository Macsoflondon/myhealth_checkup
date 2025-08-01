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
  return;
};
export default Enhanced3StepProcess;