import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Activity, TestTube2, Users } from "lucide-react";

const ThyroidPage = () => (
  <DbCategoryPage
    canonicalCategory="thyroid"
    seoTitle="Thyroid Tests | myhealth checkup"
    pillLabel="Thyroid"
    seoDescription="Compare thyroid function tests — TSH, T3, T4 and thyroid antibodies — from trusted UK providers."
    seoKeywords="thyroid blood test, TSH test, T3 T4 test, thyroid antibodies, hypothyroid, hyperthyroid"
    canonicalUrl="https://www.myhealthcheckup.co.uk/thyroid"
    headline="Thyroid Blood Tests"
    subtitle="Monitor your thyroid health with comprehensive hormone and antibody testing from trusted UK labs."
    searchPlaceholder="Search by symptom or test — e.g. 'fatigue', 'TSH'"
    trustStats={[
      { value: "28,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Test Your Thyroid?"
    benefits={[
      { icon: Activity, title: "Energy & Metabolism", description: "Thyroid hormones regulate metabolism and energy" },
      { icon: TestTube2, title: "Early Detection", description: "Identify thyroid disorders before symptoms worsen" },
      { icon: Users, title: "Treatment Monitoring", description: "Track and optimise thyroid medication" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Thyroid" }]}
    compareUrl="/compare?category=thyroid"
  />
);

export default ThyroidPage;
