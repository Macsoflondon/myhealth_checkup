import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, Activity, Building } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
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
        <Button asChild className={`w-full ${popular ? 'bg-health-600 hover:bg-health-700' : ''}`}>
          <Link to="/compare">Select Test</Link>
        </Button>
      </CardFooter>
    </Card>;
};
const FeaturedTests = () => {
  const featuredTests = [
    {
      title: "Complete Health Check",
      description: "Comprehensive blood panel covering all major health markers",
      price: "149",
      features: [
        "Full blood count & chemistry",
        "Liver & kidney function",
        "Cholesterol & diabetes screening",
        "Vitamin & mineral levels",
        "Thyroid function test"
      ],
      popular: true,
      homeKit: true,
      clinicOption: true,
      turnaround: "24-48 hours"
    },
    {
      title: "Heart Health Panel",
      description: "Focused testing for cardiovascular risk assessment",
      price: "89",
      features: [
        "Advanced lipid profile",
        "High-sensitivity CRP",
        "Troponin levels",
        "Blood pressure analysis",
        "ECG interpretation"
      ],
      homeKit: true,
      clinicOption: false,
      turnaround: "Same day"
    },
    {
      title: "Cancer Screening Plus",
      description: "Early detection screening for multiple cancer types",
      price: "299",
      features: [
        "Tumor marker panel",
        "PSA (men) / CA125 (women)",
        "CEA & AFP testing",
        "Full blood analysis",
        "Genetic risk assessment"
      ],
      homeKit: false,
      clinicOption: true,
      turnaround: "3-5 days"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <SectionHeading 
            title="Featured" 
            gradientText="Health Tests" 
          />
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-4">
            Our most popular comprehensive health screenings, trusted by thousands of customers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredTests.map((test, index) => (
            <TestCard key={index} {...test} />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Button variant="outline" size="lg" asChild>
            <Link to="/compare">View All Tests</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
export default FeaturedTests;