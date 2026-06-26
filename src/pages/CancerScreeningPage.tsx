import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Shield, Heart, Users } from "lucide-react";

const CancerScreeningPage = () => (
  <DbCategoryPage
    canonicalCategory="cancer-screening"
    seoTitle="Cancer Screening | myhealth checkup"
    pillLabel="Cancer Screening"
    seoDescription="Compare cancer screening tests from leading UK providers. Prostate, bowel, breast, cervical cancer testing and early detection."
    seoKeywords="cancer screening, prostate cancer test, bowel cancer screening, breast cancer markers, multi-cancer detection"
    canonicalUrl="https://myhealthcheckup.co.uk/tests/cancer"
    headline="Cancer Screening Tests"
    subtitle="Comprehensive cancer screening for early detection and peace of mind. Regular screening saves lives."
    searchPlaceholder="Search by cancer type or marker — e.g. 'PSA', 'ovarian'"
    trustStats={[
      { value: "28,000+", label: "Tests Compared" },
      { value: "4.8★", label: "Average Rating" },
      { value: "6+", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Choose Cancer Screening?"
    benefits={[
      { icon: Shield, title: "Early Detection", description: "Catch cancer early when treatment is most effective" },
      { icon: Heart, title: "Peace of Mind", description: "Regular screening provides reassurance about your health" },
      { icon: Users, title: "Expert Care", description: "Results reviewed by qualified healthcare professionals" },
    ]}
    breadcrumbs={[
      { label: "Home", href: "/" },
      { label: "Compare Tests", href: "/compare" },
      { label: "Cancer Screening" },
    ]}
    breadcrumbBackLabel="Back to Compare"
  />
);

export default CancerScreeningPage;