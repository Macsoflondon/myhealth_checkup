import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  return;
};
export default ProactiveHealthJourney;