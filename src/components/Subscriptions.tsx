
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

const planFeatures = {
  essentials: [
    "Quarterly finger-prick test kit",
    "Diabetes (HbA1c) monitoring",
    "Full lipid profile",
    "Liver & kidney function",
    "Iron/ferritin levels",
    "Vitamin D & B12 testing",
    "Online results dashboard",
    "Email results notifications"
  ],
  advanced: [
    "Biannual comprehensive screening",
    "Everything in Essentials",
    "PSA (men) or Female hormones",
    "High-sensitivity CRP",
    "Thyroid panel (TSH, T4)",
    "One genetic test annually",
    "15-min healthcare professional consultation",
    "Personalized health action plan",
    "Priority processing"
  ]
};

const SubscriptionPlan = ({ 
  title, 
  price, 
  period, 
  description, 
  features, 
  popular 
}: { 
  title: string; 
  price: string; 
  period: string; 
  description: string; 
  features: string[];
  popular?: boolean;
}) => {
  return (
    <Card className={`h-full flex flex-col ${popular ? 'border-health-500 shadow-xl' : 'border-gray-200'}`}>
      <CardHeader>
        {popular && (
          <Badge className="w-fit mb-2 bg-health-600">Most Popular</Badge>
        )}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">£{price}</span>
          <span className="text-gray-500">/{period}</span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex">
              <Check className="h-5 w-5 text-health-600 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${popular ? 'bg-health-600 hover:bg-health-700' : ''}`}>
          Subscribe Now
        </Button>
      </CardFooter>
    </Card>
  );
};

const Subscriptions = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Health Subscription Plans</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Regular testing and monitoring for ongoing health insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SubscriptionPlan 
            title="My Health Hub Essentials"
            price="33"
            period="quarter"
            description="Our core subscription with quarterly testing of essential health markers"
            features={planFeatures.essentials}
          />
          
          <SubscriptionPlan 
            title="My Health Hub Advanced"
            price="149"
            period="6 months"
            description="Comprehensive biannual health screening with advanced markers"
            features={planFeatures.advanced}
            popular
          />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500 max-w-2xl mx-auto">
            All subscriptions include free home collection kits, doctor-reviewed results, and the option to add specific tests at member-discounted rates.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Subscriptions;
