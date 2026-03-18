import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { Shield, Activity, Heart } from "lucide-react";

const fertilityTests: CategoryTestItem[] = [
  {
    id: "amh-fertility",
    popular: true,
    badge: "Fertility",
    badgeColor: "#10B981",
    provider: "Medichecks",
    priceNum: 69,
    price: "£69",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 3,
    rating: 4.8,
    reviews: 890,
    title: "AMH Fertility Blood Test",
    desc: "Anti-Müllerian Hormone testing to assess ovarian reserve and fertility potential.",
    biomarkers: ["AMH", "FSH", "LH"],
    tag: "Fertility",
    collection: "Home Kit",
  },
  {
    id: "gender-reveal",
    popular: true,
    badge: "Pregnancy",
    badgeColor: "#EC4899",
    provider: "London Medical Laboratory",
    priceNum: 79,
    price: "£79",
    turnaround: "3–5 days",
    turnaroundDays: 5,
    biomarkerCount: 1,
    rating: 4.8,
    reviews: 342,
    title: "Gender Reveal Blood Test",
    desc: "Early gender determination from 8 weeks pregnancy. Non-invasive test analysing fetal DNA in maternal blood.",
    biomarkers: ["Fetal DNA"],
    tag: "Pregnancy",
    collection: "Venous Blood",
  },
  {
    id: "prenatalsafe-3",
    popular: false,
    badge: "NIPT",
    badgeColor: "#8B5CF6",
    provider: "London Medical Laboratory",
    priceNum: 349,
    price: "£349",
    turnaround: "7–10 days",
    turnaroundDays: 10,
    biomarkerCount: 3,
    rating: 5.0,
    reviews: 128,
    title: "PrenatalSAFE 3 NIPT Blood Test",
    desc: "Non-invasive prenatal test screening for the 3 most common trisomies: Down, Edwards, and Patau syndrome.",
    biomarkers: ["Trisomy 21", "Trisomy 18", "Trisomy 13"],
    tag: "NIPT",
    collection: "Venous Blood",
  },
  {
    id: "prenatal-paternity",
    popular: false,
    badge: "Paternity",
    badgeColor: "#3B82F6",
    provider: "London Medical Laboratory",
    priceNum: 399,
    price: "£399",
    turnaround: "7–10 days",
    turnaroundDays: 10,
    biomarkerCount: 1,
    rating: 4.9,
    reviews: 67,
    title: "Prenatal Paternity Test",
    desc: "Non-invasive prenatal paternity test using cell-free fetal DNA. Accurate results from 8 weeks of pregnancy.",
    biomarkers: ["Paternity Confirmation"],
    tag: "Pregnancy",
    collection: "Venous Blood",
  },
  {
    id: "prenatalsafe-5",
    popular: false,
    badge: "NIPT",
    badgeColor: "#8B5CF6",
    provider: "London Medical Laboratory",
    priceNum: 449,
    price: "£449",
    turnaround: "7–10 days",
    turnaroundDays: 10,
    biomarkerCount: 5,
    rating: 4.9,
    reviews: 94,
    title: "PrenatalSAFE 5 NIPT Blood Test",
    desc: "Extended NIPT screening covering 5 chromosome conditions including common trisomies plus sex chromosome aneuploidies.",
    biomarkers: ["Trisomy 21", "Trisomy 18", "Sex Chromosomes"],
    tag: "NIPT",
    collection: "Venous Blood",
  },
  {
    id: "prenatalsafe-karyo",
    popular: false,
    badge: "NIPT",
    badgeColor: "#8B5CF6",
    provider: "London Medical Laboratory",
    priceNum: 599,
    price: "£599",
    turnaround: "10–14 days",
    turnaroundDays: 14,
    biomarkerCount: 23,
    rating: 5.0,
    reviews: 56,
    title: "PrenatalSAFE Karyo NIPT Blood Test",
    desc: "Comprehensive chromosomal analysis screening all 23 chromosome pairs for numerical abnormalities.",
    biomarkers: ["23 Chromosome Pairs", "Numerical Abnormalities"],
    tag: "NIPT",
    collection: "Venous Blood",
  },
];

const FertilityTestsPage = () => (
  <CategoryPageLayout
    seoTitle="Prenatal & Fertility Blood Tests | myhealth checkup"
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
    filters={["All", "Fertility", "Pregnancy", "NIPT"]}
    tests={fertilityTests}
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
