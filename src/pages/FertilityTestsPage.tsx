import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Shield, Activity, Heart } from "lucide-react";

const FertilityTestsPage = () => (
  <DbCategoryPage
    canonicalCategory="fertility"
    seoTitle="Fertility tests | myhealth checkup"
    pillLabel="Fertility & prenatal"
    seoDescription="Non-invasive prenatal testing (NIPT), fertility screening, gender reveal, and paternity tests during pregnancy. Safe screening from 8 weeks."
    seoKeywords="NIPT, prenatal testing, gender reveal, fertility blood test, AMH test, pregnancy blood test"
    canonicalUrl="https://myhealthcheckup.co.uk/fertility-tests"
    headline="Fertility and prenatal tests"
    subtitle="Non-invasive prenatal testing, fertility screening, and pregnancy blood tests from trusted UK labs. Safe, accurate, and confidential."
    searchPlaceholder="Search by test type — e.g. 'NIPT', 'gender reveal', 'AMH'"
    trustStats={[
      { value: "15,000+", label: "Tests compared" },
      { value: "4.9★", label: "Average rating" },
      { value: "4", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why choose prenatal testing?"
    benefits={[
      {
        icon: Shield,
        title: "Safe & non-invasive",
        description: "Simple blood tests with no risk to mother or baby",
      },
      {
        icon: Activity,
        title: "Accurate results",
        description: "Advanced DNA technology for highly accurate screening",
      },
      {
        icon: Heart,
        title: "Peace of mind",
        description: "Early insights to help you prepare with confidence",
      },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fertility tests" }]}
  />
);

export default FertilityTestsPage;
