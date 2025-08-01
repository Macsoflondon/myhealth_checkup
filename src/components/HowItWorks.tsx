import { Search, Shield, Calendar, CheckCircle } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      icon: <Search className="w-8 h-8" />,
      title: "Search & Compare",
      description: "Browse services, compare prices, and read verified reviews"
    },
    {
      number: 2,
      icon: <Shield className="w-8 h-8" />,
      title: "Choose Provider",
      description: "Select the best provider based on your needs and budget"
    },
    {
      number: 3,
      icon: <Calendar className="w-8 h-8" />,
      title: "Book Appointment",
      description: "Secure your appointment with instant confirmation"
    },
    {
      number: 4,
      icon: <CheckCircle className="w-8 h-8" />,
      title: "Get Results",
      description: "Receive your results and recommendations securely online"
    }
  ];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Simple, transparent, and secure - book your health services in just a few clicks
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center text-white shadow-elegant relative">
                {step.icon}
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold border-2 border-background">
                  {step.number}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-4 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full">
                  <div className="w-8 h-0.5 bg-primary/20 mx-auto"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default HowItWorks;