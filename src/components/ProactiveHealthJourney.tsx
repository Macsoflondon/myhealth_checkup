import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CheckCircle, Clock, TrendingUp, Users } from "lucide-react";
interface JourneyStep {
  step: number;
  title: string;
  description: string;
  timeframe: string;
  benefits: string[];
  icon: React.ReactNode;
}
const ProactiveHealthJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const journeySteps: JourneyStep[] = [{
    step: 1,
    title: "Baseline Assessment",
    description: "Establish your current health status with comprehensive testing",
    timeframe: "Month 1",
    benefits: ["Identify hidden health risks", "Establish personal baselines", "Get professional health assessment", "Create personalized health plan"],
    icon: <CheckCircle className="w-8 h-8 text-health-600" />
  }, {
    step: 2,
    title: "Targeted Intervention",
    description: "Address identified issues with lifestyle changes and treatments",
    timeframe: "Months 2-6",
    benefits: ["Optimize vitamin levels", "Improve cardiovascular markers", "Balance hormones naturally", "Enhance metabolic function"],
    icon: <TrendingUp className="w-8 h-8 text-wellness-600" />
  }, {
    step: 3,
    title: "Progress Monitoring",
    description: "Track improvements and adjust your health strategy",
    timeframe: "Months 6-12",
    benefits: ["Measure improvement progress", "Fine-tune interventions", "Prevent new issues emerging", "Maintain optimal health"],
    icon: <Clock className="w-8 h-8 text-purple-600" />
  }, {
    step: 4,
    title: "Long-term Wellness",
    description: "Maintain peak health and prevent age-related decline",
    timeframe: "Ongoing",
    benefits: ["Add healthy years to life", "Maintain energy and vitality", "Reduce healthcare costs", "Protect family's future"],
    icon: <Users className="w-8 h-8 text-amber-600" />
  }];
  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Your Proactive Health Journey
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A systematic approach to achieving and maintaining optimal health throughout your lifetime
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {journeySteps.map((step, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-300 ${
                activeStep === index 
                  ? 'ring-2 ring-health-500 shadow-xl' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => setActiveStep(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {step.icon}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold">{step.title}</h3>
                      <Badge variant="outline">{step.timeframe}</Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <ul className="space-y-2">
                      {step.benefits.map((benefit, benefitIndex) => (
                        <li key={benefitIndex} className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button size="lg" className="bg-health-600 hover:bg-health-700">
            <ArrowRight className="w-5 h-5 mr-2" />
            Start Your Journey Today
          </Button>
        </div>
      </div>
    </section>
  );
};
export default ProactiveHealthJourney;