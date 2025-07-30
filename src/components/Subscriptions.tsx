import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
const planFeatures = {
  essentials: ["Quarterly finger-prick test kit", "Diabetes (HbA1c) monitoring", "Full lipid profile", "Liver & kidney function", "Iron/ferritin levels", "Vitamin D & B12 testing", "Online results dashboard", "Email results notifications"],
  advanced: ["Biannual comprehensive screening", "Everything in Essentials", "PSA (men) or Female hormones", "High-sensitivity CRP", "Thyroid panel (TSH, T4)", "One genetic test annually", "15-min healthcare professional consultation", "Personalized health action plan", "Priority processing"]
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
  return <Card className={`h-full flex flex-col ${popular ? 'border-health-500 shadow-xl' : 'border-gray-200'}`}>
      <CardHeader>
        {popular && <Badge className="w-fit mb-2 bg-health-600">Most Popular</Badge>}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">£{price}</span>
          <span className="text-gray-500">/{period}</span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>
      <CardContent className="flex-grow">
        <ul className="space-y-2">
          {features.map((feature, index) => <li key={index} className="flex">
              <Check className="h-5 w-5 text-health-600 mr-2 flex-shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>)}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${popular ? 'bg-health-600 hover:bg-health-700' : ''}`}>
          Subscribe Now
        </Button>
      </CardFooter>
    </Card>;
};
const Subscriptions = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Health Subscription Plans
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Stay on top of your health with regular monitoring and comprehensive testing packages
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <SubscriptionPlan
            title="Health Hub Essentials"
            price="49"
            period="quarter"
            description="Essential health monitoring for proactive wellness"
            features={planFeatures.essentials}
          />
          
          <SubscriptionPlan
            title="Health Hub Advanced"
            price="89"
            period="quarter"
            description="Comprehensive health screening with expert consultation"
            features={planFeatures.advanced}
            popular={true}
          />
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            All plans include free delivery, secure online results, and 24/7 customer support
          </p>
          <Button variant="outline">
            Compare All Plans
          </Button>
        </div>
      </div>
    </section>
  );
};
export default Subscriptions;