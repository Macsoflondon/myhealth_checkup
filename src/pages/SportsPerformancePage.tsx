import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Zap, Activity, TrendingUp } from "lucide-react";

const SportsPerformancePage = () => (
  <DbCategoryPage
    canonicalCategory="sports-performance"
    seoTitle="Sports performance tests | myhealth checkup"
    pillLabel="Sports-fitness health"
    seoDescription="Optimise your fitness and athletic performance with comprehensive health blood tests from trusted UK providers."
    seoKeywords="fitness health tests, bodybuilding blood tests, athletic blood tests, sports nutrition testing, recovery markers"
    canonicalUrl="https://myhealthcheckup.co.uk/sports-performance"
    headline="Sports-fitness health blood tests"
    subtitle="Optimise athletic performance with comprehensive biomarker analysis — nutrition, recovery and fitness markers."
    searchPlaceholder="Search by sport or goal — e.g. 'marathon', 'muscle recovery'"
    trustStats={[
      { value: "62,000+", label: "Tests compared" },
      { value: "4.7★", label: "Average rating" },
      { value: "6", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why choose sports-fitness health testing?"
    benefits={[
      {
        icon: Zap,
        title: "Peak performance",
        description: "Monitor biomarkers crucial for competitive advantage",
      },
      {
        icon: Activity,
        title: "Recovery optimisation",
        description: "Track markers that impact recovery and adaptation",
      },
      {
        icon: TrendingUp,
        title: "Competitive edge",
        description: "Data-driven insights to optimise training",
      },
    ]}
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Sports-fitness health" },
    ]}
    compareUrl="/compare?category=sports-performance"
  />
);

export default SportsPerformancePage;
