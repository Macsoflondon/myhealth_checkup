
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
  return (
    <Card className={`border ${popular ? 'border-health-500 shadow-lg shadow-health-100/50' : 'border-gray-200'}`}>
      <CardHeader>
        {popular && (
          <Badge className="w-fit mb-2 bg-health-600">Most Popular</Badge>
        )}
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold">£{price}</span>
          <span className="text-gray-500 text-sm">per test</span>
        </div>
        <p className="text-gray-600 text-sm">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {homeKit && (
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
              <Home className="h-3 w-3 mr-1" />
              <span>Home Kit</span>
            </div>
          )}
          {clinicOption && (
            <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
              <Building className="h-3 w-3 mr-1" />
              <span>Clinic Option</span>
            </div>
          )}
          <div className="flex items-center bg-gray-50 px-3 py-1 rounded-full text-sm">
            <Activity className="h-3 w-3 mr-1" />
            <span>{turnaround}</span>
          </div>
        </div>
        
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="text-sm flex items-start">
              <span className="text-health-600 mr-2 font-bold">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button className={`w-full ${popular ? 'bg-health-600 hover:bg-health-700' : ''}`}>
          Select Test
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeaturedTests = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Popular Health Tests</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our most requested tests that have helped thousands better understand their health
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <TestCard
            title="Vitamin D Test"
            description="Check your vitamin D levels with our simple finger-prick test"
            price="29"
            homeKit={true}
            clinicOption={true}
            turnaround="Results in 48h"
            features={[
              "Measures 25-OH Vitamin D",
              "Doctor-reviewed results",
              "Personalized optimal range",
              "Seasonal advice included",
              "Option for NHS-approved treatment"
            ]}
          />
          
          <TestCard
            title="Complete Health Check"
            description="Our most comprehensive health assessment covering key areas"
            price="89"
            homeKit={true}
            clinicOption={true}
            popular={true}
            turnaround="Results in 2-3 days"
            features={[
              "Full cholesterol profile (6 markers)",
              "Diabetes (HbA1c) check",
              "Liver & kidney function",
              "Vitamin D & B12 levels",
              "Iron status & blood count",
              "15-min health advisor consultation"
            ]}
          />
          
          <TestCard
            title="Bowel Cancer FIT Test"
            description="Early detection screening for bowel cancer risk"
            price="49"
            homeKit={true}
            turnaround="Results in 4 days"
            features={[
              "NHS-grade FIT testing",
              "Detects hidden blood in stool",
              "More sensitive than standard FOB test",
              "Results reviewed by specialists",
              "Includes follow-up guidance"
            ]}
          />
        </div>
      </div>
    </section>
  );
};

export default FeaturedTests;
