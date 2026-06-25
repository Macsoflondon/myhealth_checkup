import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Activity, Heart, Shield } from "lucide-react";

const HormonesPage = () => (
  <DbCategoryPage
    canonicalCategory="hormones"
    seoTitle="Hormone Tests | myhealth checkup"
    pillLabel="Hormones"
    seoDescription="Compare hormone blood tests from trusted UK providers — thyroid, reproductive, stress and metabolic hormones."
    seoKeywords="hormone blood tests, testosterone test, female hormones, cortisol test, fertility hormones"
    canonicalUrl="https://myhealthcheckup.co.uk/hormones"
    headline="Hormone Blood Tests"
    subtitle="Comprehensive hormone testing — reproductive, thyroid, stress and metabolic — from trusted UK providers."
    searchPlaceholder="Search by symptom or test — e.g. 'low energy', 'menopause'"
    trustStats={[
      { value: "40,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Test Your Hormones?"
    benefits={[
      { icon: Activity, title: "Optimise Energy", description: "Balance hormones to boost energy and reduce fatigue" },
      { icon: Heart, title: "Improve Mood", description: "Stabilise mood through hormone optimisation" },
      { icon: Shield, title: "Prevent Disease", description: "Early detection of hormonal imbalances" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hormones" }]}
    compareUrl="/compare?category=hormones"
  />
);

export default HormonesPage;
