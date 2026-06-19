import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Zap, Activity, TrendingUp } from "lucide-react";

const SportsPerformancePage = () => (
  <DbCategoryPage
    canonicalCategory="sports-performance"
    seoTitle="Sports Performance Tests | myhealth checkup"
    pillLabel="Sports-Fitness Health"
    seoDescription="Optimise your fitness and athletic performance with comprehensive health blood tests from trusted UK providers."
    seoKeywords="fitness health tests, bodybuilding blood tests, athletic blood tests, sports nutrition testing, recovery markers"
    canonicalUrl="https://myhealthcheckup.co.uk/sports-performance"
    headline="Sports-Fitness Health Blood Tests"
    subtitle="Optimise athletic performance with comprehensive biomarker analysis — nutrition, recovery and fitness markers."
    searchPlaceholder="Search by sport or goal — e.g. 'marathon', 'muscle recovery'"
    trustStats={[
      { value: "62,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Choose Sports-Fitness Health Testing?"
    benefits={[
      { icon: Zap, title: "Peak Performance", description: "Monitor biomarkers crucial for competitive advantage" },
      { icon: Activity, title: "Recovery Optimisation", description: "Track markers that impact recovery and adaptation" },
      { icon: TrendingUp, title: "Competitive Edge", description: "Data-driven insights to optimise training" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sports-Fitness Health" }]}
    compareUrl="/compare?category=sports-performance"
  />
);

export default SportsPerformancePage;
