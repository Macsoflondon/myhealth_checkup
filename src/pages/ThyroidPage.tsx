import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Activity, TestTube2, Users } from "lucide-react";

const ThyroidPage = () => (
  <DbCategoryPage
    canonicalCategory="thyroid"
    seoTitle="Thyroid tests | myhealth checkup"
    pillLabel="Thyroid"
    seoDescription="Compare thyroid function tests — TSH, T3, T4 and thyroid antibodies — from trusted UK providers."
    seoKeywords="thyroid blood test, TSH test, T3 T4 test, thyroid antibodies, hypothyroid, hyperthyroid"
    canonicalUrl="https://myhealthcheckup.co.uk/thyroid"
    headline="Thyroid blood tests"
    subtitle="Monitor your thyroid health with comprehensive hormone and antibody testing from trusted UK labs."
    searchPlaceholder="Search by symptom or test — e.g. 'fatigue', 'TSH'"
    trustStats={[
      { value: "28,000+", label: "Tests compared" },
      { value: "4.7★", label: "Average rating" },
      { value: "6", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why test your thyroid?"
    benefits={[
      {
        icon: Activity,
        title: "Energy & metabolism",
        description: "Thyroid hormones regulate metabolism and energy",
      },
      {
        icon: TestTube2,
        title: "Early detection",
        description: "Identify thyroid disorders before symptoms worsen",
      },
      {
        icon: Users,
        title: "Treatment monitoring",
        description: "Track and optimise thyroid medication",
      },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Thyroid" }]}
    compareUrl="/compare?category=thyroid"
  />
);

export default ThyroidPage;
