import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { Heart, Baby, Users } from "lucide-react";

const womensHealthTests: CategoryTestItem[] = [
  {
    id: "premium-complete-blood-women",
    popular: true,
    badge: "Complete Health",
    badgeColor: "#E91E7A",
    provider: "Medichecks",
    priceNum: 199,
    price: "£199",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 7,
    rating: 4.8,
    reviews: 1240,
    title: "Premium Complete Blood Test",
    desc: "Full blood count, organ function, vitamins, and cardiovascular markers.",
    biomarkers: ["Full Blood Count", "Liver Function", "Kidney Function"],
    tag: "Hormones",
    collection: "Home Kit / Clinic",
  },
  {
    id: "advanced-well-woman",
    popular: false,
    badge: "Women's Wellness",
    badgeColor: "#9B59B6",
    provider: "Goodbody",
    priceNum: 149,
    price: "£149",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 6,
    rating: 4.7,
    reviews: 890,
    title: "Advanced Well Woman Test",
    desc: "Comprehensive screening including hormones, reproductive health, and cardiovascular markers.",
    biomarkers: ["Female Hormones", "Thyroid Function", "Cholesterol Panel"],
    tag: "Hormones",
    collection: "Home Kit",
  },
  {
    id: "menopause-blood-test",
    popular: true,
    badge: "Menopause",
    badgeColor: "#C026D3",
    provider: "Thriva",
    priceNum: 89,
    price: "£89",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 6,
    rating: 4.6,
    reviews: 542,
    title: "Menopause Blood Test",
    desc: "Specialised testing to assess menopausal status and hormone levels during perimenopause.",
    biomarkers: ["FSH", "LH", "Oestradiol"],
    tag: "Menopause",
    collection: "Home Kit",
  },
  {
    id: "female-hormones",
    popular: false,
    badge: "Hormone Health",
    badgeColor: "#E91E7A",
    provider: "Medichecks",
    priceNum: 99,
    price: "£99",
    turnaround: "1–2 days",
    turnaroundDays: 2,
    biomarkerCount: 7,
    rating: 4.9,
    reviews: 2100,
    title: "Female Hormones Blood Test",
    desc: "Comprehensive hormone panel including reproductive hormones and cycle regulation markers.",
    biomarkers: ["Oestradiol", "Progesterone", "LH"],
    tag: "Hormones",
    collection: "Home Kit",
  },
  {
    id: "amh-fertility",
    popular: false,
    badge: "Fertility Health",
    badgeColor: "#10B981",
    provider: "Lola Health",
    priceNum: 69,
    price: "£69",
    turnaround: "3–5 days",
    turnaroundDays: 5,
    biomarkerCount: 4,
    rating: 4.5,
    reviews: 310,
    title: "AMH Fertility Blood Test",
    desc: "Anti-Müllerian Hormone testing to assess ovarian reserve and fertility potential.",
    biomarkers: ["AMH", "FSH", "LH"],
    tag: "Fertility",
    collection: "Home Kit",
  },
  {
    id: "pregnancy-blood-test",
    popular: false,
    badge: "Pregnancy",
    badgeColor: "#EC4899",
    provider: "Medichecks",
    priceNum: 125,
    price: "£125",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 8,
    rating: 4.7,
    reviews: 678,
    title: "Pregnancy Blood Test",
    desc: "Essential testing during pregnancy including iron, thyroid, and vitamin levels.",
    biomarkers: ["Iron", "Ferritin", "Thyroid Function"],
    tag: "Fertility",
    collection: "Home Kit / Clinic",
  },
  {
    id: "pcos-blood-test",
    popular: false,
    badge: "PCOS Health",
    badgeColor: "#F59E0B",
    provider: "Randox Health",
    priceNum: 125,
    price: "£125",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 7,
    rating: 4.7,
    reviews: 678,
    title: "PCOS Blood Test",
    desc: "Specialised testing for Polycystic Ovary Syndrome including hormones and metabolic markers.",
    biomarkers: ["Testosterone", "SHBG", "LH"],
    tag: "PCOS",
    collection: "Home Kit",
  },
];

const WomensHealthPage = () => (
  <CategoryPageLayout
    seoTitle="Women's Health Tests | myhealth checkup"
    seoDescription="Comprehensive women's health testing including hormones, fertility, menopause, and PCOS screening from trusted UK providers. Compare prices and book today."
    seoKeywords="women's health tests, hormone test, fertility test, menopause test, PCOS test, well woman test"
    canonicalUrl="https://myhealthcheckup.co.uk/womens-health"
    headline="Women's Health"
    subtitle="Comprehensive female health screening — hormones, fertility, menopause, and PCOS — designed for women's unique needs."
    searchPlaceholder="Search by symptom or test — e.g. 'irregular periods', 'menopause'"
    trustStats={[
      { value: "50,000+", label: "Tests Compared" },
      { value: "4.8★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All", "Hormones", "Fertility", "Menopause", "PCOS"]}
    tests={womensHealthTests}
    benefitsTitle="Why Choose Women's Health Testing?"
    benefits={[
      { icon: Heart, title: "Hormone Balance", description: "Early detection and prevention of women's health conditions" },
      { icon: Baby, title: "Fertility Planning", description: "Comprehensive fertility and reproductive health insights" },
      { icon: Users, title: "Lifelong Wellness", description: "Monitor and optimise health throughout every life stage" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women's Health" }]}
    compareUrl="/compare?category=womens-health"
  />
);

export default WomensHealthPage;
