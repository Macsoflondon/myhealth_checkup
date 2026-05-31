import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Shield, Activity, Heart } from "lucide-react";

const GutHealthPage = () => (
  <DbCategoryPage
    canonicalCategory="gut"
    seoTitle="Gut Health Tests | myhealth checkup"
    pillLabel="Gut Health"
    seoDescription="Compare gut health and microbiome tests from trusted UK providers — digestive markers, food intolerance and bacterial analysis."
    seoKeywords="gut health test, microbiome test, food intolerance, digestive health"
    canonicalUrl="https://www.myhealthcheckup.co.uk/tests/gut"
    headline="Gut Health & Microbiome Testing"
    subtitle="Advanced testing for digestive health, food intolerances and the gut-body connection."
    searchPlaceholder="Search by symptom or test — e.g. 'bloating', 'microbiome'"
    trustStats={[
      { value: "12,000+", label: "Tests Compared" },
      { value: "4.6★", label: "Average Rating" },
      { value: "5", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Test Your Gut?"
    benefits={[
      { icon: Shield, title: "Immunity", description: "70% of immune system is in your gut" },
      { icon: Activity, title: "Mental Health", description: "Gut produces 90% of serotonin" },
      { icon: Heart, title: "Whole-Body Health", description: "Gut bacteria affect cholesterol and energy" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Gut Health" }]}
    compareUrl="/compare?category=gut-health"
  />
);

export default GutHealthPage;
