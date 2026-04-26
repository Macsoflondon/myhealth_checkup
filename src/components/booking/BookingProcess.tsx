import { Calendar, MapPin, Clock, FileText, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
export const BookingProcess = () => {
  const steps = [{
    title: "Schedule Your Consultation",
    description: "Schedule your consultation online or by phone at a time and location that works for you. We work with a network of trusted healthcare providers to ensure you have access to a convenient and reliable service.",
    icon: Calendar,
    step: "01"
  }, {
    title: "Visit Your Local Clinic",
    description: "Our partners are local healthcare companies, so you don't have to go far to get your blood drawn. All you have to do is show up at your scheduled time, and we'll take care of the rest.",
    icon: MapPin,
    step: "02"
  }, {
    title: "Fast & Accurate Results",
    description: "Your results will be delivered to you securely. We pride ourselves on our fast and accurate service, giving you peace of mind about your health.",
    icon: Clock,
    step: "03"
  }, {
    title: "Expert Consultation",
    description: "Want to discuss your results with a doctor or nutritionist? Our team of experts is here to help you make sense of your test results and offer advice on how to stay healthy.",
    icon: UserCheck,
    step: "04"
  }];
  return <section className="py-16 bg-gradient-subtle">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">
            Our Simple Consultation Booking Process
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Experience our streamlined approach to health testing with trusted local providers
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => <Card key={index} className="group hover:shadow-elegant transition-all duration-300 border-2 hover:border-primary/20">
              
            </Card>)}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" className="bg-gradient-primary hover:opacity-90">
            Start Your Health Journey
          </Button>
        </div>
      </div>
    </section>;
};