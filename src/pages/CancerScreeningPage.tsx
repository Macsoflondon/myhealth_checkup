import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { Shield, Heart, Users } from "lucide-react";

const cancerTests: CategoryTestItem[] = [
  {
    id: "psa-prostate",
    popular: false,
    badge: "Prostate",
    badgeColor: "#3B82F6",
    provider: "Randox Health",
    priceNum: 49,
    price: "£49",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 1,
    rating: 4.7,
    reviews: 980,
    title: "PSA Prostate Test",
    desc: "Prostate-specific antigen screening for early detection of prostate conditions.",
    biomarkers: ["PSA"],
    tag: "Prostate",
    collection: "Home Kit",
  },
  {
    id: "comprehensive-cancer",
    popular: true,
    badge: "Cancer Markers",
    badgeColor: "#E91E7A",
    provider: "Medichecks",
    priceNum: 199,
    price: "£199",
    turnaround: "3–5 days",
    turnaroundDays: 5,
    biomarkerCount: 8,
    rating: 4.9,
    reviews: 1450,
    title: "Comprehensive Cancer Screen",
    desc: "Multi-marker panel covering the most common cancer biomarkers for early detection.",
    biomarkers: ["PSA", "CEA", "CA-125"],
    tag: "General",
    collection: "Home Kit / Clinic",
  },
  {
    id: "ca125-ovarian",
    popular: false,
    badge: "Ovarian",
    badgeColor: "#EC4899",
    provider: "Lola Health",
    priceNum: 79,
    price: "£79",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 2,
    rating: 4.6,
    reviews: 420,
    title: "CA-125 Ovarian Cancer Marker",
    desc: "Ovarian cancer screening with CA-125 and HE4 protein markers.",
    biomarkers: ["CA-125", "HE4"],
    tag: "Ovarian",
    collection: "Home Kit",
  },
  {
    id: "bowel-cancer",
    popular: false,
    badge: "Bowel",
    badgeColor: "#10B981",
    provider: "Medichecks",
    priceNum: 89,
    price: "£89",
    turnaround: "5–7 days",
    turnaroundDays: 7,
    biomarkerCount: 3,
    rating: 4.8,
    reviews: 760,
    title: "Bowel Cancer Screening",
    desc: "Advanced FIT test for early detection of colorectal cancer markers.",
    biomarkers: ["FIT", "Blood in stool", "Haemoglobin"],
    tag: "Bowel",
    collection: "Home Kit",
  },
  {
    id: "breast-cancer",
    popular: false,
    badge: "Breast",
    badgeColor: "#EC4899",
    provider: "Goodbody",
    priceNum: 189,
    price: "£189",
    turnaround: "7–10 days",
    turnaroundDays: 10,
    biomarkerCount: 4,
    rating: 4.7,
    reviews: 340,
    title: "Breast Cancer Markers",
    desc: "Blood markers and genetic testing for breast cancer risk assessment.",
    biomarkers: ["CA 15-3", "CA 27.29", "CEA"],
    tag: "General",
    collection: "Home Kit / Clinic",
  },
  {
    id: "multi-cancer",
    popular: false,
    badge: "Comprehensive",
    badgeColor: "#8B5CF6",
    provider: "Randox Health",
    priceNum: 399,
    price: "£399",
    turnaround: "10–14 days",
    turnaroundDays: 14,
    biomarkerCount: 12,
    rating: 4.9,
    reviews: 210,
    title: "Multi-Cancer Detection",
    desc: "Blood-based early detection panel screening for multiple cancer types simultaneously.",
    biomarkers: ["ctDNA", "Protein biomarkers", "50+ cancer types"],
    tag: "General",
    collection: "Clinic Visit",
  },
];

const CancerScreeningPage = () => (
  <CategoryPageLayout
    seoTitle="Cancer Screening Tests | Early Detection & Prevention | myhealth checkup"
    seoDescription="Compare cancer screening tests from leading UK providers. Prostate, bowel, breast, cervical cancer testing and early detection."
    seoKeywords="cancer screening, prostate cancer test, bowel cancer screening, breast cancer markers, multi-cancer detection"
    canonicalUrl="https://myhealthcheckup.co.uk/tests/cancer"
    headline="Cancer Screening Tests"
    subtitle="Comprehensive cancer screening for early detection and peace of mind. Regular screening saves lives."
    searchPlaceholder="Search by cancer type or marker — e.g. 'PSA', 'ovarian'"
    trustStats={[
      { value: "28,000+", label: "Tests Compared" },
      { value: "4.9★", label: "Average Rating" },
      { value: "3", label: "Trusted Providers" },
    ]}
    filters={["All", "Prostate", "Bowel", "Ovarian", "General"]}
    tests={cancerTests}
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
