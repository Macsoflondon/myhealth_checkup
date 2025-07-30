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
const AgeSpecificRecommendations = () => {
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
    <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Age-Specific Health Recommendations
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Get personalized health testing recommendations based on your age group and health priorities
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6 mb-8">
          {ageGroups.map((group, index) => (
            <Card
              key={index}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                selectedAge === index
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => setSelectedAge(index)}
            >
              <CardHeader className="text-center">
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-3 ${group.color}`}>
                  {group.icon}
                </div>
                <CardTitle className="text-lg">{group.range}</CardTitle>
                <p className="text-sm font-medium text-gray-600">{group.title}</p>
              </CardHeader>
            </Card>
          ))}
        </div>

        {selectedAge !== null && (
          <Card className="shadow-lg">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">{ageGroups[selectedAge].title}</h3>
                  <p className="text-gray-600 mb-6">{ageGroups[selectedAge].description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Testing Frequency</h4>
                      <Badge variant="outline" className="text-sm">
                        {ageGroups[selectedAge].frequency}
                      </Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-lg mb-2">Health Priority</h4>
                      <p className="text-gray-600">{ageGroups[selectedAge].priority}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-lg mb-4">Recommended Tests</h4>
                  <div className="space-y-2">
                    {ageGroups[selectedAge].keyTests.map((test, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="text-gray-700">{test}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full mt-6">
                    Find Tests for My Age Group
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};
export default AgeSpecificRecommendations;