import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Users, Heart, Baby, Shield } from "lucide-react";
interface AgeGroupData {
  range: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  keyTests: string[];
  frequency: string;
  priority: string;
  color: string;
}
const AgeSpecificRecommendations = (): JSX.Element => {
  const [selectedAge, setSelectedAge] = useState(1); // Default to 30-45

  const ageGroups: AgeGroupData[] = [{
    range: "20-30",
    icon: <Baby className="w-6 h-6" />,
    title: "Foundation Years",
    description: "Establish baseline health metrics and focus on fertility and reproductive health.",
    keyTests: ["Fertility Hormones", "STI Screening", "Vitamin D", "General Health Panel", "Thyroid Function"],
    frequency: "Annually",
    priority: "Fertility & Baseline Health",
    color: "bg-green-100 border-green-500 text-green-700"
  }, {
    range: "30-45",
    icon: <User className="w-6 h-6" />,
    title: "Prevention Focus",
    description: "Peak time for preventive care as risk factors begin to emerge. Career and family focused.",
    keyTests: ["Complete Health Check", "Cancer Screening", "Heart Health Panel", "Hormone Balance", "Stress Markers"],
    frequency: "Every 6-12 months",
    priority: "Cancer Prevention & Cardiovascular Health",
    color: "bg-blue-100 border-blue-500 text-blue-700"
  }, {
    range: "45-60",
    icon: <Heart className="w-6 h-6" />,
    title: "Active Monitoring",
    description: "Increased screening frequency as health risks rise. Focus on early detection and optimization.",
    keyTests: ["Advanced Cancer Screening", "Comprehensive Heart Panel", "Diabetes Monitoring", "Bone Health", "Cognitive Function"],
    frequency: "Every 3-6 months",
    priority: "Early Detection & Risk Management",
    color: "bg-orange-100 border-orange-500 text-orange-700"
  }, {
    range: "60+",
    icon: <Shield className="w-6 h-6" />,
    title: "Vigilant Care",
    description: "Comprehensive monitoring for age-related conditions with focus on maintaining quality of life.",
    keyTests: ["Full Cancer Panel", "Comprehensive Metabolic", "Cognitive Assessment", "Inflammation Markers", "Vitamin Absorption"],
    frequency: "Quarterly",
    priority: "Disease Management & Quality of Life",
    color: "bg-purple-100 border-purple-500 text-purple-700"
  }];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-health-700">Health Testing by Life Stage</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your health needs evolve throughout your life. Discover the most important tests for your age group.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-8">
          {ageGroups.map((group, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedAge === index ? 'ring-2 ring-health-500 shadow-lg' : ''
              }`}
              onClick={() => setSelectedAge(index)}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${group.color}`}>
                  {group.icon}
                </div>
                <CardTitle className="text-lg">{group.range}</CardTitle>
                <p className="text-sm font-medium text-gray-600">{group.title}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">{ageGroups[selectedAge].title}</h3>
              <p className="text-lg text-gray-600 mb-4">{ageGroups[selectedAge].description}</p>
              <div className="flex justify-center gap-4 text-sm">
                <Badge variant="outline" className="px-3 py-1">
                  {ageGroups[selectedAge].frequency}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {ageGroups[selectedAge].priority}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-health-700">Recommended Tests</h4>
                <ul className="space-y-2">
                  {ageGroups[selectedAge].keyTests.map((test, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-health-500 rounded-full mr-3"></div>
                      {test}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="text-center">
                <Button className="w-full">
                  Find Tests for Age {ageGroups[selectedAge].range}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};
export default AgeSpecificRecommendations;