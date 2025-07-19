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
  return;
};
export default Subscriptions;