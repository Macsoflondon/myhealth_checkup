import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Activity, Building } from "lucide-react";
interface TestCardProps {
  title: string;
  description: string;
  price: string;
  features: string[];
  popular?: boolean;
  homeKit?: boolean;
  clinicOption?: boolean;
  turnaround: string;
}
const TestCard = ({
  title,
  description,
  price,
  features,
  popular,
  homeKit,
  clinicOption,
  turnaround
}: TestCardProps) => {
  return <Card className={`border ${popular ? 'border-health-500 shadow-lg shadow-health-100/50' : 'border-gray-200'}`}>
      <CardHeader>
        {popular && <Badge className="w-fit mb-2 bg-health-600">Most Popular</Badge>}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">£{price}</span>
          <span className="text-gray-500 text-sm">per test</span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {homeKit && <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
              <Home className="h-3 w-3 mr-1" />
              <span>Home Kit</span>
            </div>}
          {clinicOption && <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
              <Building className="h-3 w-3 mr-1" />
              <span>Clinic Option</span>
            </div>}
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
            <Activity className="h-3 w-3 mr-1" />
            <span>{turnaround}</span>
          </div>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => <li key={index} className="text-sm flex items-start">
              <span className="text-health-600 mr-2 font-bold">✓</span>
              <span>{feature}</span>
            </li>)}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${popular ? 'bg-health-600 hover:bg-health-700' : ''}`}>
          Select Test
        </Button>
      </CardFooter>
    </Card>;
};
const FeaturedTests = () => {
  return;
};
export default FeaturedTests;