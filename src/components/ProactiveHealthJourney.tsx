
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

  const journeySteps: JourneyStep[] = [
    {
      step: 1,
      title: "Baseline Assessment",
      description: "Establish your current health status with comprehensive testing",
      timeframe: "Month 1",
      benefits: [
        "Identify hidden health risks",
        "Establish personal baselines",
        "Get professional health assessment",
        "Create personalized health plan"
      ],
      icon: <CheckCircle className="w-8 h-8 text-health-600" />
    },
    {
      step: 2,
      title: "Targeted Intervention",
      description: "Address identified issues with lifestyle changes and treatments",
      timeframe: "Months 2-6",
      benefits: [
        "Optimize vitamin levels",
        "Improve cardiovascular markers",
        "Balance hormones naturally",
        "Enhance metabolic function"
      ],
      icon: <TrendingUp className="w-8 h-8 text-wellness-600" />
    },
    {
      step: 3,
      title: "Progress Monitoring",
      description: "Track improvements and adjust your health strategy",
      timeframe: "Months 6-12",
      benefits: [
        "Measure improvement progress",
        "Fine-tune interventions",
        "Prevent new issues emerging",
        "Maintain optimal health"
      ],
      icon: <Clock className="w-8 h-8 text-purple-600" />
    },
    {
      step: 4,
      title: "Long-term Wellness",
      description: "Maintain peak health and prevent age-related decline",
      timeframe: "Ongoing",
      benefits: [
        "Add healthy years to life",
        "Maintain energy and vitality",
        "Reduce healthcare costs",
        "Protect family's future"
      ],
      icon: <Users className="w-8 h-8 text-amber-600" />
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Your Proactive Health Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how our customers transform their health over time. Follow this proven pathway 
            to add healthy years to your life and protect what matters most.
          </p>
        </div>

        {/* Journey Timeline */}
        <div className="max-w-6xl mx-auto">
          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-8 left-0 right-0 h-1 bg-gray-200 hidden lg:block">
              <div 
                className="h-full bg-gradient-to-r from-health-600 to-wellness-600 transition-all duration-500"
                style={{ width: `${(activeStep / (journeySteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Journey Steps */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {journeySteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card 
                    className={`cursor-pointer transition-all duration-300 ${
                      activeStep === index 
                        ? 'border-2 border-health-500 shadow-lg scale-105' 
                        : 'border border-gray-200 hover:shadow-md'
                    }`}
                    onClick={() => setActiveStep(index)}
                  >
                    <CardContent className="p-6 text-center">
                      {/* Step Number Circle */}
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center relative z-10 ${
                        activeStep >= index 
                          ? 'bg-health-600 text-white' 
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        <span className="font-bold text-lg">{step.step}</span>
                      </div>
                      
                      <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{step.timeframe}</p>
                      <p className="text-gray-700 text-sm">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Step Information */}
          <div className="mt-12">
            <Card className="border-2 border-gray-100">
              <CardContent className="p-8">
                <div className="flex items-center justify-center mb-6">
                  {journeySteps[activeStep].icon}
                  <h3 className="text-2xl font-bold ml-4">
                    Step {journeySteps[activeStep].step}: {journeySteps[activeStep].title}
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold text-lg mb-4">What You'll Achieve</h4>
                    <ul className="space-y-3">
                      {journeySteps[activeStep].benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="flex flex-col justify-center">
                    <div className="bg-gradient-to-br from-health-50 to-wellness-50 p-6 rounded-lg mb-6">
                      <h4 className="font-semibold text-lg mb-2">Timeline</h4>
                      <p className="text-2xl font-bold text-health-600">
                        {journeySteps[activeStep].timeframe}
                      </p>
                    </div>
                    
                    <Button size="lg" className="bg-health-600 hover:bg-health-700">
                      Start Your Journey
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProactiveHealthJourney;
