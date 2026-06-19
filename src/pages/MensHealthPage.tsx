import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Shield, Activity, Users } from "lucide-react";

const MensHealthPage = () => (
  <DbCategoryPage
    canonicalCategory="mens-health"
    seoTitle="Men's Health Tests | myhealth checkup"
    pillLabel="Men's Health"
    seoDescription="Comprehensive men's health testing including testosterone, prostate PSA, erectile dysfunction, and complete male wellness screening from £45."
    seoKeywords="men's health tests, testosterone test, prostate PSA test, male hormones, erectile dysfunction test, well man test"
    canonicalUrl="https://myhealthcheckup.co.uk/mens-health"
    headline="Men's Health Blood Tests"
    subtitle="Comprehensive male health screening including testosterone, prostate health, erectile dysfunction, and complete wellness testing tailored for men's unique health needs."
    searchPlaceholder="Search by symptom or test — e.g. 'testosterone', 'prostate'"
    trustStats={[
      { value: "50,000+", label: "Tests Compared" },
      { value: "4.8★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Choose Men's Health Testing?"
    benefits={[
      { icon: Shield, title: "Early Detection", description: "Identify health issues before symptoms develop" },
      { icon: Activity, title: "Optimise Performance", description: "Maximise energy, strength, and overall male vitality" },
      { icon: Users, title: "Preventive Care", description: "Take control of your health with proactive screening" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men's Health" }]}
    compareUrl="/compare?category=mens-health"
  />
);

export default MensHealthPage;
