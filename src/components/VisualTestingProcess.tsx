import { TestTube, Send, FileBarChart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const VisualTestingProcess = () => {
  const steps = [
    {
      number: "01",
      title: "Take Your Test",
      description: "Choose how you would like to have your blood test, either in the comfort of your own home or visit one of our clinics nationwide.",
      icon: TestTube,
      color: "bg-emerald-500"
    },
    {
      number: "02", 
      title: "Send Your Sample",
      description: "Once complete, your sample will be collected by our courier and sent to the lab.",
      icon: Send,
      color: "bg-[#081129]"
    },
    {
      number: "03",
      title: "Get Your Results",
      description: "View your results with the option of having clinical advice and the option to follow up with a doctor or nutritionist.",
      icon: FileBarChart,
      color: "bg-purple-500"
    }
  ];

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and professional health testing process
          </p>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-200 via-blue-200 to-purple-200 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, index) => (
              <Card key={index} className="group hover:shadow-elegant transition-all duration-300 bg-card/80 backdrop-blur-sm border-2 hover:border-primary/20">
                <CardContent className="p-8 text-center">
                  <div className="relative mb-8">
                    <div className={`w-20 h-20 mx-auto ${step.color} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <step.icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-background border-2 border-primary text-primary w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {step.number}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};