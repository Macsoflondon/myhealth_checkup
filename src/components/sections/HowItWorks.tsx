import { Search, Shield, CheckCircle, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
const HowItWorks = () => {
  return <section className="bg-white py-10 md:py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[hsl(var(--navy))] mb-3">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to booking your health test
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[{
            step: "1",
            title: "Search & Compare",
            description: "Explore tests, review biomarkers, compare pricing",
            icon: Search
          }, {
            step: "2",
            title: "Choose Provider",
            description: "Select a trusted provider that fits your needs",
            icon: Shield
          }, {
            step: "3",
            title: "Book Appointment",
            description: "Secure booking with instant confirmation",
            icon: CheckCircle
          }, {
            step: "4",
            title: "Get Results",
            description: "Receive results securely within 3-5 days",
            icon: Award
          }].map((item, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow bg-white border-gray-200">
              <div className="relative mb-4">
                <div className="w-12 h-12 bg-[hsl(var(--accent))] rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-[hsl(var(--primary))] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{item.step}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-[hsl(var(--navy))] mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-gray-600">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>;
};
export default HowItWorks;