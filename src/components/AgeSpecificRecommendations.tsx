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
  return <section className="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
      
    </section>;
};
export default AgeSpecificRecommendations;