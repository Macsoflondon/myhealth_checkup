import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Zap, Shield, Sun } from "lucide-react";

const VitaminDeficiencyPage = () => (
  <DbCategoryPage
    canonicalCategory="vitamins"
    seoTitle="Vitamin Deficiency Tests | myhealth checkup"
    pillLabel="Vitamins & Minerals"
    seoDescription="Compare vitamin and mineral deficiency tests from UK providers — vitamin D, B12, iron and folate testing."
    seoKeywords="vitamin deficiency test, vitamin D test, B12 test, iron studies, folate test"
    canonicalUrl="https://myhealthcheckup.co.uk/tests/vitamins"
    headline="Vitamin & Mineral Testing"
    subtitle="Identify hidden vitamin deficiencies affecting your energy, immunity and wellbeing."
    searchPlaceholder="Search by nutrient — e.g. 'vitamin D', 'B12'"
    trustStats={[
      { value: "33,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Test for Vitamin Deficiencies?"
    benefits={[
      { icon: Zap, title: "Boost Energy", description: "Address fatigue from B12, iron and vitamin D deficiency" },
      { icon: Shield, title: "Strengthen Immunity", description: "Vitamins C, D and zinc support a strong immune system" },
      { icon: Sun, title: "Improve Mood", description: "Vitamin D, B12 and folate support mental wellbeing" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vitamins" }]}
    compareUrl="/compare?category=vitamins"
  />
);

export default VitaminDeficiencyPage;
