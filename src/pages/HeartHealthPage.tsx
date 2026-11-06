import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Heart, Shield, TrendingUp } from "lucide-react";

const HeartHealthPage = () => (
  <DbCategoryPage
    canonicalCategory="heart"
    seoTitle="Heart health blood tests UK | myhealth checkup"
    pillLabel="Heart health"
    seoDescription="Compare cardiovascular tests — cholesterol, lipid profiles and cardiac risk assessment — from trusted UK providers."
    seoKeywords="heart health tests, cholesterol test, lipid profile, cardiac risk assessment, cardiovascular screening"
    canonicalUrl="https://myhealthcheckup.co.uk/heart-health"
    headline="Heart health tests"
    subtitle="Comprehensive cardiovascular screening — monitor your risk and take proactive steps for a healthier heart."
    searchPlaceholder="Search by symptom or test — e.g. 'cholesterol', 'blood pressure'"
    trustStats={[
      { value: "35,000+", label: "Tests compared" },
      { value: "4.8★", label: "Average rating" },
      { value: "6", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why test your heart health?"
    benefits={[
      {
        icon: Heart,
        title: "Early detection",
        description: "Identify risk factors before symptoms appear",
      },
      {
        icon: Shield,
        title: "Prevention",
        description: "Take action to prevent heart disease",
      },
      {
        icon: TrendingUp,
        title: "Monitor progress",
        description: "Track improvements over time",
      },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Heart health" }]}
    compareUrl="/compare?category=heart-health"
  />
);

export default HeartHealthPage;
