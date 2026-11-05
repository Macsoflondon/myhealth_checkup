import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Shield, Heart, Users } from "lucide-react";

const CancerScreeningPage = () => (
  <DbCategoryPage
    canonicalCategory="cancer-screening"
    seoTitle="Cancer screening | myhealth checkup"
    pillLabel="Cancer screening"
    seoDescription="Compare cancer screening tests from leading UK providers. Prostate, bowel, breast, cervical cancer testing and early detection."
    seoKeywords="cancer screening, prostate cancer test, bowel cancer screening, breast cancer markers, multi-cancer detection"
    canonicalUrl="https://myhealthcheckup.co.uk/tests/cancer"
    headline="Cancer screening tests"
    subtitle="Comprehensive cancer screening for early detection and peace of mind. Regular screening saves lives."
    searchPlaceholder="Search by cancer type or marker — e.g. 'PSA', 'ovarian'"
    trustStats={[
      { value: "28,000+", label: "Tests compared" },
      { value: "4.8★", label: "Average rating" },
      { value: "6+", label: "Trusted providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why choose cancer screening?"
    benefits={[
      {
        icon: Shield,
        title: "Early detection",
        description: "Catch cancer early when treatment is most effective",
      },
      {
        icon: Heart,
        title: "Peace of mind",
        description: "Regular screening provides reassurance about your health",
      },
      {
        icon: Users,
        title: "Expert care",
        description: "Results reviewed by qualified healthcare professionals",
      },
    ]}
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Compare tests", href: "/compare" },
      { label: "Cancer screening" },
    ]}
    breadcrumbBackLabel="Back to Compare"
  />
);

export default CancerScreeningPage;
