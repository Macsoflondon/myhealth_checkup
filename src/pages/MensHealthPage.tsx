import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { Shield, Activity, Users } from "lucide-react";

const mensHealthTests: CategoryTestItem[] = [
  {
    id: "premium-complete-blood",
    popular: true,
    badge: "Complete Health",
    badgeColor: "#E91E7A",
    provider: "Medichecks",
    priceNum: 199,
    price: "£199",
    turnaround: "24–48 hours",
    turnaroundDays: 2,
    biomarkerCount: 7,
    rating: 4.8,
    reviews: 1240,
    title: "Premium Complete Blood Test",
    desc: "Comprehensive health analysis including full blood count, organ function, vitamins, and cardiovascular markers.",
    biomarkers: ["Full Blood Count", "Liver Function", "Kidney Function"],
    tag: "Complete",
    collection: "Home Kit / Clinic",
  },
  {
    id: "advanced-well-man",
    popular: false,
    badge: "Men's Wellness",
    badgeColor: "#3B82F6",
    provider: "Goodbody",
    priceNum: 149,
    price: "£149",
    turnaround: "24–48 hours",
    turnaroundDays: 2,
    biomarkerCount: 6,
    rating: 4.7,
    reviews: 890,
    title: "Advanced Well Man Test",
    desc: "Comprehensive men's health screening including hormones, prostate markers, and cardiovascular health.",
    biomarkers: ["PSA", "Testosterone", "Cholesterol Panel"],
    tag: "Wellness",
    collection: "Home Kit",
  },
  {
    id: "male-hormones",
    popular: false,
    badge: "Hormone Health",
    badgeColor: "#E91E7A",
    provider: "Thriva",
    priceNum: 89,
    price: "£89",
    turnaround: "24–48 hours",
    turnaroundDays: 2,
    biomarkerCount: 6,
    rating: 4.9,
    reviews: 2100,
    title: "Male Hormones Blood Test",
    desc: "Comprehensive hormone panel including testosterone, SHBG, and reproductive health markers.",
    biomarkers: ["Total Testosterone", "Free Testosterone", "SHBG"],
    tag: "Hormones",
    collection: "Home Kit",
  },
  {
    id: "erectile-dysfunction",
    popular: false,
    badge: "Sexual Health",
    badgeColor: "#8B5CF6",
    provider: "Medichecks",
    priceNum: 125,
    price: "£125",
    turnaround: "24–48 hours",
    turnaroundDays: 2,
    biomarkerCount: 6,
    rating: 4.6,
    reviews: 542,
    title: "Erectile Dysfunction Blood Test",
    desc: "Specialised testing to identify underlying causes of erectile dysfunction including hormones and vascular health.",
    biomarkers: ["Testosterone", "Prolactin", "HbA1c"],
    tag: "Sexual Health",
    collection: "Home Kit / Clinic",
  },
  {
    id: "prostate-tests",
    popular: false,
    badge: "Prostate Health",
    badgeColor: "#3B82F6",
    provider: "Randox Health",
    priceNum: 65,
    price: "£65",
    turnaround: "24–48 hours",
    turnaroundDays: 2,
    biomarkerCount: 4,
    rating: 4.7,
    reviews: 980,
    title: "Prostate Tests",
    desc: "Comprehensive prostate health screening including PSA and related markers for early detection.",
    biomarkers: ["Total PSA", "Free PSA", "PSA Ratio"],
    tag: "Prostate",
    collection: "Home Kit",
  },
  {
    id: "testosterone-blood",
    popular: false,
    badge: "Hormone Health",
    badgeColor: "#E91E7A",
    provider: "Lola Health",
    priceNum: 45,
    price: "£45",
    turnaround: "24–48 hours",
    turnaroundDays: 2,
    biomarkerCount: 3,
    rating: 4.5,
    reviews: 310,
    title: "Testosterone Blood Test",
    desc: "Essential testosterone testing to assess male hormone levels and hormonal health.",
    biomarkers: ["Total Testosterone", "Free Testosterone", "SHBG"],
    tag: "Hormones",
    collection: "Home Kit",
  },
];

const MensHealthPage = () => (
  <CategoryPageLayout
    seoTitle="Men's Health Tests | myhealth checkup"
    pillLabel="Men's Health"
    seoDescription="Comprehensive men's health testing including testosterone, prostate PSA, erectile dysfunction, and complete male wellness screening from £45."
    seoKeywords="men's health tests, testosterone test, prostate PSA test, male hormones, erectile dysfunction test, well man test"
    canonicalUrl="https://myhealthcheckup.co.uk/mens-health"
    headline="Men's Health Blood Tests"
    subtitle="Comprehensive male health screening including testosterone, prostate health, erectile dysfunction, and complete wellness testing tailored for men's unique health needs."
    searchPlaceholder="Search by symptom or test — e.g. 'testosterone', 'prostate'"
    trustStats={[
      { value: "50,000+", label: "Tests Compared" },
      { value: "4.8★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All", "Complete", "Wellness", "Hormones", "Sexual Health", "Prostate"]}
    tests={mensHealthTests}
    benefitsTitle="Why Choose Men's Health Testing?"
    benefits={[
      { icon: Shield, title: "Early Detection", description: "Identify potential health issues before symptoms develop" },
      { icon: Activity, title: "Optimise Performance", description: "Maximise energy, strength, and overall male vitality" },
      { icon: Users, title: "Preventive Care", description: "Take control of your health with proactive screening" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Men's Health" }]}
    compareUrl="/compare?category=mens-health"
  />
);

export default MensHealthPage;
