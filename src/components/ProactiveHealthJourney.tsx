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
    benefits: ["Identify hidden health risks", "Establish personal baselines", "Get professional health assessment", "Create personalised health plan"],
    icon: <CheckCircle className="w-8 h-8 text-health-600" />
  }, {
    step: 2,
    title: "Targeted Intervention",
    description: "Address identified issues with lifestyle changes and treatments",
    timeframe: "Months 2-6",
    benefits: ["Optimise vitamin levels", "Improve cardiovascular markers", "Balance hormones naturally", "Enhance metabolic function"],
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
    <section className="py-16 bg-gradient-to-br from-health-50 to-wellness-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Your Proactive Health Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transform your health with our evidence-based approach to preventive care
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {journeySteps.map((step, index) => (
            <Card 
              key={step.step} 
              className={`transition-all duration-300 cursor-pointer ${
                activeStep === index ? 'ring-2 ring-health-600 shadow-lg' : 'hover:shadow-md'
              }`}
              onClick={() => setActiveStep(index)}
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Badge variant="secondary" className="mr-3">
                    {step.timeframe}
                  </Badge>
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>
                <ul className="space-y-2">
                  {step.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" className="group">
            Start Your Journey
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
};
export default ProactiveHealthJourney;