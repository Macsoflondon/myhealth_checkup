import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Activity, Clock, TrendingUp } from "lucide-react";

const DiabetesTestingPage = () => (
  <DbCategoryPage
    canonicalCategory="diabetes"
    seoTitle="Diabetes testing | myhealth checkup"
    pillLabel="Diabetes"
    seoDescription="Compare diabetes screening and monitoring tests from UK providers — HbA1c, glucose tolerance and insulin resistance testing."
    seoKeywords="diabetes test, HbA1c test, glucose tolerance, insulin resistance"
    canonicalUrl="https://myhealthcheckup.co.uk/tests/diabetes"
    headline="Diabetes testing & monitoring"
    subtitle="Comprehensive diabetes screening and monitoring tests to manage your metabolic health proactively."
    searchPlaceholder="Search by test — e.g. 'HbA1c', 'glucose'"
    trustStats={[
      { value: "20,000+", label: "Tests compared" },
      { value: "4.7★", label: "Average rating" },
      { value: "6", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why test for diabetes?"
    benefits={[
      {
        icon: Activity,
        title: "Early detection",
        description: "Catch pre-diabetes before it progresses",
      },
      {
        icon: Clock,
        title: "Track progress",
        description: "Monitor HbA1c over time",
      },
      {
        icon: TrendingUp,
        title: "Optimise health",
        description: "Guide lifestyle and treatment decisions",
      },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Diabetes" }]}
    compareUrl="/compare?category=diabetes"
  />
);

export default DiabetesTestingPage;
