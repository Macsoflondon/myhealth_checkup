import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Shield, Activity, Heart } from "lucide-react";

const FertilityTestsPage = () => (
  <DbCategoryPage
    canonicalCategory="fertility"
    seoTitle="Fertility Tests | myhealth checkup"
    pillLabel="Fertility & Prenatal"
    seoDescription="Non-invasive prenatal testing (NIPT), fertility screening, gender reveal, and paternity tests during pregnancy. Safe screening from 8 weeks."
    seoKeywords="NIPT, prenatal testing, gender reveal, fertility blood test, AMH test, pregnancy blood test"
    canonicalUrl="https://myhealthcheckup.co.uk/fertility-tests"
    headline="Fertility & Prenatal Tests"
    subtitle="Non-invasive prenatal testing, fertility screening, and pregnancy blood tests from trusted UK labs. Safe, accurate, and confidential."
    searchPlaceholder="Search by test type — e.g. 'NIPT', 'gender reveal', 'AMH'"
    trustStats={[
      { value: "15,000+", label: "Tests Compared" },
      { value: "4.9★", label: "Average Rating" },
      { value: "4", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Choose Prenatal Testing?"
    benefits={[
      { icon: Shield, title: "Safe & Non-Invasive", description: "Simple blood tests with no risk to mother or baby" },
      { icon: Activity, title: "Accurate Results", description: "Advanced DNA technology for highly accurate screening" },
      { icon: Heart, title: "Peace of Mind", description: "Early insights to help you prepare with confidence" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Fertility Tests" }]}
  />
);

export default FertilityTestsPage;
