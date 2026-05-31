import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Home, Clock, Shield } from "lucide-react";

const AtHomeTestsPage = () => (
  <DbCategoryPage
    canonicalCategory="at-home"
    seoTitle="At-Home Tests | myhealth checkup"
    pillLabel="At-Home Tests"
    seoDescription="Convenient at-home health testing kits with professional lab analysis. Finger prick, saliva and urine tests delivered to your door."
    seoKeywords="at home blood test, home testing kit, finger prick test, health test at home, private blood test UK"
    canonicalUrl="https://www.myhealthcheckup.co.uk/at-home-tests"
    headline="At-Home Health Tests"
    subtitle="Take control of your health with convenient at-home testing kits — professional lab analysis, results delivered securely online."
    searchPlaceholder="Search by symptom or test — e.g. 'vitamin D', 'thyroid'"
    trustStats={[
      { value: "45,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All", "Finger Prick", "Saliva", "Urine"]}
    benefitsTitle="Why Choose At-Home Testing?"
    benefits={[
      { icon: Home, title: "Convenient", description: "Test from home — no clinic visit required" },
      { icon: Clock, title: "Fast Results", description: "Typically within 2–5 days" },
      { icon: Shield, title: "UKAS Accredited", description: "Samples analysed in accredited laboratories" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "At-Home Tests" }]}
    compareUrl="/compare?category=at-home"
  />
);

export default AtHomeTestsPage;
