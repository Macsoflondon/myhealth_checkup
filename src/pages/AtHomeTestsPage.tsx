import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { Home, Clock, Shield } from "lucide-react";

const atHomeTests: CategoryTestItem[] = [
  {
    id: "finger-prick-basic",
    popular: true,
    badge: "Finger Prick",
    badgeColor: "#e70d69",
    provider: "Medichecks",
    priceNum: 49,
    price: "£49",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 10,
    rating: 4.8,
    reviews: 1240,
    title: "Essential Health Check",
    desc: "Quick finger prick test covering key health markers including cholesterol, liver function, and vitamins.",
    biomarkers: ["Full Blood Count", "Cholesterol", "Liver Function"],
    tag: "Finger Prick",
    collection: "Finger Prick",
  },
  {
    id: "finger-prick-advanced",
    popular: false,
    badge: "Finger Prick",
    badgeColor: "#e70d69",
    provider: "Thriva",
    priceNum: 89,
    price: "£89",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 18,
    rating: 4.7,
    reviews: 890,
    title: "Advanced Wellness Blood Test",
    desc: "Comprehensive finger prick test analysing vitamins, hormones, and organ function markers.",
    biomarkers: ["Vitamin D", "Thyroid Function", "Iron"],
    tag: "Finger Prick",
    collection: "Finger Prick",
  },
  {
    id: "saliva-cortisol",
    popular: false,
    badge: "Saliva Test",
    badgeColor: "#22c0d4",
    provider: "Medichecks",
    priceNum: 69,
    price: "£69",
    turnaround: "3–5 days",
    turnaroundDays: 5,
    biomarkerCount: 4,
    rating: 4.6,
    reviews: 420,
    title: "Cortisol Stress Test",
    desc: "Non-invasive saliva test measuring cortisol levels throughout the day to assess stress and adrenal function.",
    biomarkers: ["Cortisol AM", "Cortisol PM", "DHEA"],
    tag: "Saliva",
    collection: "Saliva",
  },
  {
    id: "saliva-hormones",
    popular: true,
    badge: "Saliva Test",
    badgeColor: "#22c0d4",
    provider: "Goodbody",
    priceNum: 99,
    price: "£99",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 6,
    rating: 4.9,
    reviews: 678,
    title: "Hormone Balance Saliva Test",
    desc: "Complete hormone panel via saliva collection — oestrogen, progesterone, testosterone, and cortisol.",
    biomarkers: ["Oestradiol", "Progesterone", "Testosterone"],
    tag: "Saliva",
    collection: "Saliva",
  },
  {
    id: "urine-metabolic",
    popular: false,
    badge: "Urine Test",
    badgeColor: "#3A5F85",
    provider: "Randox Health",
    priceNum: 79,
    price: "£79",
    turnaround: "3 days",
    turnaroundDays: 3,
    biomarkerCount: 8,
    rating: 4.5,
    reviews: 310,
    title: "Metabolic Urine Screen",
    desc: "Convenient urine collection test for kidney function, glucose, and metabolic health markers.",
    biomarkers: ["Creatinine", "Glucose", "Protein"],
    tag: "Urine",
    collection: "Urine",
  },
  {
    id: "finger-prick-diabetes",
    popular: false,
    badge: "Finger Prick",
    badgeColor: "#e70d69",
    provider: "Lola Health",
    priceNum: 59,
    price: "£59",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 5,
    rating: 4.7,
    reviews: 540,
    title: "Diabetes Risk Check",
    desc: "At-home finger prick blood test for HbA1c, fasting glucose, and insulin resistance markers.",
    biomarkers: ["HbA1c", "Fasting Glucose", "Insulin"],
    tag: "Finger Prick",
    collection: "Finger Prick",
  },
];

const AtHomeTestsPage = () => (
  <CategoryPageLayout
    seoTitle="At-Home Tests | myhealth checkup"
    pillLabel="At-Home Tests"
    seoDescription="Convenient at-home health testing kits with professional lab analysis and fast results. Finger prick, saliva, and urine tests delivered to your door."
    seoKeywords="at home blood test, home testing kit, finger prick test, health test at home, private blood test UK"
    canonicalUrl="https://myhealthcheckup.co.uk/at-home-tests"
    headline="At-Home Health Tests"
    subtitle="Take control of your health with convenient at-home testing kits. Professional lab analysis with results delivered securely online."
    searchPlaceholder="Search by symptom or test — e.g. 'vitamin D', 'thyroid'"
    trustStats={[
      { value: "45,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All", "Finger Prick", "Saliva", "Urine"]}
    tests={atHomeTests}
    benefitsTitle="Why Choose At-Home Testing?"
    benefits={[
      { icon: Home, title: "Convenient", description: "Test from home — no clinic visit required" },
      { icon: Clock, title: "Fast Results", description: "Results typically available within 24-48 hours" },
      { icon: Shield, title: "UKAS Accredited", description: "All samples analysed in accredited laboratories" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "At-Home Tests" }]}
  />
);

export default AtHomeTestsPage;
