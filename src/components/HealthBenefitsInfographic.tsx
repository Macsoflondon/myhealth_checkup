import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Shield, TrendingUp, Clock, Users, Award } from "lucide-react";
interface BenefitCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  statistic: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}
const BenefitCard = ({
  icon,
  title,
  description,
  statistic,
  color,
  isActive,
  onClick
}: BenefitCardProps) => {
  return <Card className={`cursor-pointer transition-all duration-300 transform hover:scale-105 ${isActive ? `border-2 ${color} shadow-lg` : 'border border-gray-200 hover:shadow-md'}`} onClick={onClick}>
      <CardContent className="p-6 text-center">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${isActive ? color.replace('border-', 'bg-').replace('-500', '-100') : 'bg-gray-100'}`}>
          {icon}
        </div>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className={`text-3xl font-bold mb-3 ${color.replace('border-', 'text-')}`}>
          {statistic}
        </div>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </CardContent>
    </Card>;
};
const HealthBenefitsInfographic = () => {
  const [activeCard, setActiveCard] = useState(0);
  const benefits = [{
    icon: <Shield className="w-8 h-8 text-blue-600" />,
    title: "Early Detection",
    description: "Catching health issues 5-10 years earlier through preventive screening can dramatically improve treatment outcomes and reduce long-term healthcare costs.",
    statistic: "90%",
    color: "border-blue-500",
    detail: "Early detection rates for common cancers when regular screening is maintained"
  }, {
    icon: <TrendingUp className="w-8 h-8 text-green-600" />,
    title: "Longevity Boost",
    description: "Regular health monitoring and preventive care can add significant healthy years to your life, especially when started in your 30s-40s.",
    statistic: "+12 years",
    color: "border-green-500",
    detail: "Average healthy lifespan extension with proactive health management"
  }, {
    icon: <Heart className="w-8 h-8 text-red-600" />,
    title: "Heart Health",
    description: "Cardiovascular disease prevention through regular cholesterol and blood pressure monitoring significantly reduces heart attack and stroke risk.",
    statistic: "60%",
    color: "border-red-500",
    detail: "Reduction in heart disease risk with regular monitoring and lifestyle adjustments"
  }, {
    icon: <Clock className="w-8 h-8 text-purple-600" />,
    title: "Time Savings",
    description: "Private testing offers convenience and speed, with results typically available within 24-48 hours compared to weeks on the NHS.",
    statistic: "48hrs",
    color: "border-purple-500",
    detail: "Average turnaround time for comprehensive private health tests"
  }, {
    icon: <Users className="w-8 h-8 text-indigo-600" />,
    title: "Family Protection",
    description: "Understanding your health status helps protect your family's future and enables informed decisions about life insurance and financial planning.",
    statistic: "85%",
    color: "border-indigo-500",
    detail: "Of our customers report feeling more confident about their family's health security"
  }, {
    icon: <Award className="w-8 h-8 text-amber-600" />,
    title: "Quality of Life",
    description: "Proactive health management leads to better energy levels, improved mood, and enhanced productivity in both personal and professional life.",
    statistic: "95%",
    color: "border-amber-500",
    detail: "Customer satisfaction rate with improved quality of life after health optimization"
  }];
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            The Science Behind Proactive Health
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Evidence-based benefits of regular health monitoring and early intervention
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <BenefitCard
              key={index}
              {...benefit}
              isActive={activeCard === index}
              onClick={() => setActiveCard(index)}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-health-600 hover:bg-health-700">
            Start Your Health Journey
          </Button>
        </div>
      </div>
    </section>
  );
};
export default HealthBenefitsInfographic;