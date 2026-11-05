import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Zap, Shield, Sun } from "lucide-react";

const VitaminDeficiencyPage = () => (
  <DbCategoryPage
    canonicalCategory="vitamins"
    seoTitle="Vitamin deficiency tests | myhealth checkup"
    pillLabel="Vitamins & Minerals"
    seoDescription="Compare vitamin and mineral deficiency tests from UK providers — vitamin D, B12, iron and folate testing."
    seoKeywords="vitamin deficiency test, vitamin D test, B12 test, iron studies, folate test"
    canonicalUrl="https://myhealthcheckup.co.uk/tests/vitamins"
    headline="Vitamin & mineral testing"
    subtitle="Identify hidden vitamin deficiencies affecting your energy, immunity and wellbeing."
    searchPlaceholder="Search by nutrient — e.g. 'vitamin D', 'B12'"
    trustStats={[
      { value: "33,000+", label: "Tests compared" },
      { value: "4.7★", label: "Average rating" },
      { value: "6", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why test for vitamin deficiencies?"
    benefits={[
      {
        icon: Zap,
        title: "Boost energy",
        description: "Address fatigue from B12, iron and vitamin D deficiency",
      },
      {
        icon: Shield,
        title: "Strengthen immunity",
        description: "Vitamins C, D and zinc support a strong immune system",
      },
      {
        icon: Sun,
        title: "Improve mood",
        description: "Vitamin D, B12 and folate support mental wellbeing",
      },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Vitamins" }]}
    compareUrl="/compare?category=vitamins"
  />
);

export default VitaminDeficiencyPage;
