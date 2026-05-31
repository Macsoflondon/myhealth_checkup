import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Heart, Shield, TrendingUp } from "lucide-react";

const HeartHealthPage = () => (
  <DbCategoryPage
    canonicalCategory="heart"
    seoTitle="Heart Health Tests | myhealth checkup"
    pillLabel="Heart Health"
    seoDescription="Compare cardiovascular tests — cholesterol, lipid profiles and cardiac risk assessment — from trusted UK providers."
    seoKeywords="heart health tests, cholesterol test, lipid profile, cardiac risk assessment, cardiovascular screening"
    canonicalUrl="https://www.myhealthcheckup.co.uk/heart-health"
    headline="Heart Health Blood Tests"
    subtitle="Comprehensive cardiovascular screening — monitor your risk and take proactive steps for a healthier heart."
    searchPlaceholder="Search by symptom or test — e.g. 'cholesterol', 'blood pressure'"
    trustStats={[
      { value: "35,000+", label: "Tests Compared" },
      { value: "4.8★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Test Your Heart Health?"
    benefits={[
      { icon: Heart, title: "Early Detection", description: "Identify risk factors before symptoms appear" },
      { icon: Shield, title: "Prevention", description: "Take action to prevent heart disease" },
      { icon: TrendingUp, title: "Monitor Progress", description: "Track improvements over time" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Heart Health" }]}
    compareUrl="/compare?category=heart-health"
  />
);

export default HeartHealthPage;
