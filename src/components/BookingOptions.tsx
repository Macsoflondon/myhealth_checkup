import { Home, MapPin, Clock, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const BookingOptions = () => {
  const options = [
    {
      title: "Visit Clinic",
      description: "Professional testing at our partner clinics nationwide",
      icon: MapPin,
      fee: "£39",
      feeLabel: "Phlebotomist fee",
      benefits: [
        "Professional healthcare environment",
        "Immediate sample collection", 
        "Experienced phlebotomists",
        "Convenient locations"
      ],
      buttonText: "Book Clinic Visit",
      highlighted: false
    },
    {
      title: "Home Visit",
      description: "Comfortable testing in your own home",
      icon: Home,
      fee: "£95",
      feeLabel: "Phlebotomist fee",
      benefits: [
        "Complete privacy and comfort",
        "No travel required",
        "Flexible scheduling",
        "Same professional standards"
      ],
      buttonText: "Book Home Visit",
      highlighted: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Choose Your Testing Option
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the most convenient way to get your health tests done
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {options.map((option, index) => (
            <Card 
              key={index} 
              className={`group transition-all duration-300 ${
                option.highlighted 
                  ? 'border-2 border-primary shadow-elegant ring-2 ring-primary/10' 
                  : 'border-2 hover:border-primary/20 hover:shadow-elegant'
              }`}
            >
              {option.highlighted && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                  option.highlighted ? 'bg-primary' : 'bg-primary/10'
                } group-hover:scale-110 transition-transform duration-300`}>
                  <option.icon className={`w-8 h-8 ${
                    option.highlighted ? 'text-primary-foreground' : 'text-primary'
                  }`} />
                </div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  {option.title}
                </CardTitle>
                <p className="text-muted-foreground">
                  {option.description}
                </p>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {option.fee}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {option.feeLabel}
                  </div>
                </div>

                <ul className="space-y-2">
                  {option.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3 flex-shrink-0"></div>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${
                    option.highlighted 
                      ? 'bg-gradient-primary hover:opacity-90' 
                      : 'bg-secondary hover:bg-secondary/80'
                  }`}
                  size="lg"
                >
                  {option.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
            <Stethoscope className="w-4 h-4" />
            <span>All tests include expert consultation options</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>Results typically available within 2-3 working days</span>
          </div>
        </div>
      </div>
    </section>
  );
};