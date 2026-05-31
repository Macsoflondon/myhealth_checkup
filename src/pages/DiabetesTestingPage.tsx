import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Activity, Clock, TrendingUp } from "lucide-react";

const DiabetesTestingPage = () => (
  <DbCategoryPage
    canonicalCategory="general-health"
    seoTitle="Diabetes Testing | myhealth checkup"
    pillLabel="Diabetes"
    seoDescription="Compare diabetes screening and monitoring tests from UK providers — HbA1c, glucose tolerance and insulin resistance testing."
    seoKeywords="diabetes test, HbA1c test, glucose tolerance, insulin resistance"
    canonicalUrl="https://www.myhealthcheckup.co.uk/tests/diabetes"
    headline="Diabetes Testing & Monitoring"
    subtitle="Comprehensive diabetes screening and monitoring tests to manage your metabolic health proactively."
    searchPlaceholder="Search by test — e.g. 'HbA1c', 'glucose'"
    trustStats={[
      { value: "20,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Test for Diabetes?"
    benefits={[
      { icon: Activity, title: "Early Detection", description: "Catch pre-diabetes before it progresses" },
      { icon: Clock, title: "Track Progress", description: "Monitor HbA1c over time" },
      { icon: TrendingUp, title: "Optimise Health", description: "Guide lifestyle and treatment decisions" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Diabetes" }]}
    compareUrl="/compare?category=diabetes"
  />
);

export default DiabetesTestingPage;
