import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Activity, Heart, Shield } from "lucide-react";

const HormonesPage = () => (
  <DbCategoryPage
    canonicalCategory="hormones"
    seoTitle="Hormone tests | myhealth checkup"
    pillLabel="Hormones"
    seoDescription="Compare hormone blood tests from trusted UK providers — thyroid, reproductive, stress and metabolic hormones."
    seoKeywords="hormone blood tests, testosterone test, female hormones, cortisol test, fertility hormones"
    canonicalUrl="https://myhealthcheckup.co.uk/hormones"
    headline="Hormone blood tests"
    subtitle="Comprehensive hormone testing — reproductive, thyroid, stress and metabolic — from trusted UK providers."
    searchPlaceholder="Search by symptom or test — e.g. 'low energy', 'menopause'"
    trustStats={[
      { value: "40,000+", label: "Tests compared" },
      { value: "4.7★", label: "Average rating" },
      { value: "6", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why test your hormones?"
    benefits={[
      {
        icon: Activity,
        title: "Optimise energy",
        description: "Balance hormones to boost energy and reduce fatigue",
      },
      {
        icon: Heart,
        title: "Improve mood",
        description: "Stabilise mood through hormone optimisation",
      },
      {
        icon: Shield,
        title: "Prevent disease",
        description: "Early detection of hormonal imbalances",
      },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Hormones" }]}
    compareUrl="/compare?category=hormones"
  />
);

export default HormonesPage;
