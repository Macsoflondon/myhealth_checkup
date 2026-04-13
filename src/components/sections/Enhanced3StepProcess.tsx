import { TestTube, Users, CheckCircle } from "lucide-react";

const Enhanced3StepProcess = (): JSX.Element | null => {
  const steps = [
    {
      number: "01",
      icon: <TestTube className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(var(--primary))]" />,
      title: "Choose Your Test",
      description:
        "Browse our curated selection of health tests from trusted UK providers. Compare prices, features, and reviews to find the right test for your needs.",
    },
    {
      number: "02",
      icon: <Users className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(var(--primary))]" />,
      title: "Book with Provider",
      description:
        "Connect directly with your chosen provider to book your appointment. Our partners offer flexible scheduling including home visits and clinic appointments.",
    },
    {
      number: "03",
      icon: <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 text-[hsl(var(--primary))]" />,
      title: "Get Your Results",
      description:
        "Receive your comprehensive results typically within a few working days. Many providers include expert consultations to help you understand your health data.",
    },
  ];

  return (
    <section className="py-10 sm:py-14 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="relative inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[hsl(var(--primary))]/10 mb-4">
                {step.icon}
                <span className="absolute -top-1 -right-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[hsl(var(--secondary))] text-white text-xs font-bold flex items-center justify-center">
                  {step.number}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-foreground mb-2 font-heading">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Enhanced3StepProcess;
