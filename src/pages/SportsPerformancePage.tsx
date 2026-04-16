import { CategoryPageLayout, CategoryTestItem } from "@/components/category/CategoryPageLayout";
import { Zap, Activity, TrendingUp } from "lucide-react";

const fitnessTests: CategoryTestItem[] = [
  {
    id: "sports-performance-randox",
    popular: false,
    badge: "Sports Performance",
    badgeColor: "#22c0d4",
    provider: "Randox Health",
    priceNum: 129,
    price: "£129",
    turnaround: "2–5 days",
    turnaroundDays: 5,
    biomarkerCount: 10,
    rating: 4.6,
    reviews: 445,
    title: "Sports Performance",
    desc: "Comprehensive sports blood panel covering key performance and recovery markers.",
    biomarkers: ["Testosterone", "Cortisol", "Iron"],
    tag: "General",
    collection: "Clinic Visit",
  },
  {
    id: "ultimate-performance",
    popular: true,
    badge: "Sports Performance",
    badgeColor: "#22c0d4",
    provider: "Medichecks",
    priceNum: 169,
    price: "£169",
    turnaround: "2–5 days",
    turnaroundDays: 5,
    biomarkerCount: 14,
    rating: 4.8,
    reviews: 1890,
    title: "Ultimate Performance",
    desc: "Advanced full-panel analysis for serious athletes seeking data-driven performance gains.",
    biomarkers: ["Full Blood Count", "Testosterone", "Thyroid"],
    tag: "General",
    collection: "Home Kit / Clinic",
  },
  {
    id: "bodybuilder-profile",
    popular: false,
    badge: "Bodybuilding",
    badgeColor: "#8B5CF6",
    provider: "London Medical Laboratory",
    priceNum: 155,
    price: "£155",
    turnaround: "4 hours",
    turnaroundDays: 1,
    biomarkerCount: 21,
    rating: 4.9,
    reviews: 760,
    title: "Bodybuilder Profile",
    desc: "Monitors hormones, liver and kidney function, lipid balance, and red blood cell production.",
    biomarkers: ["Testosterone", "Free Testosterone", "Albumin"],
    tag: "Bodybuilding",
    collection: "Clinic Visit",
  },
  {
    id: "male-cyclist-test",
    popular: false,
    badge: "Cycling",
    badgeColor: "#22c0d4",
    provider: "Sports Blood Tests",
    priceNum: 129,
    price: "£129",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 18,
    rating: 4.7,
    reviews: 320,
    title: "Blood Test for Male Cyclists",
    desc: "Unlock your cycling potential with accurate insights into performance and recovery.",
    biomarkers: ["VO2 Markers", "Iron", "Cortisol"],
    tag: "Cycling",
    collection: "Finger Prick",
  },
  {
    id: "male-runner-test",
    popular: false,
    badge: "Running",
    badgeColor: "#22c0d4",
    provider: "Sports Blood Tests",
    priceNum: 129,
    price: "£129",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 18,
    rating: 4.6,
    reviews: 290,
    title: "Blood Test for Male Runners",
    desc: "Achieving peak performance requires a deep understanding of your body's unique markers.",
    biomarkers: ["Iron", "Ferritin", "Cortisol"],
    tag: "Running",
    collection: "Finger Prick",
  },
  {
    id: "male-weightlifter-test",
    popular: false,
    badge: "Weightlifting",
    badgeColor: "#22c0d4",
    provider: "Sports Blood Tests",
    priceNum: 125,
    price: "£125",
    turnaround: "2 days",
    turnaroundDays: 2,
    biomarkerCount: 17,
    rating: 4.5,
    reviews: 210,
    title: "Blood Test for Male Weightlifters",
    desc: "Track key biomarkers affecting strength, recovery, and hormones.",
    biomarkers: ["Testosterone", "Cortisol", "Creatine Kinase"],
    tag: "Weightlifting",
    collection: "Finger Prick",
  },
  {
    id: "goodbody-sports-fitness",
    popular: false,
    badge: "Sports Performance",
    badgeColor: "#22c0d4",
    provider: "Good Body Clinic",
    priceNum: 99,
    price: "£99",
    turnaround: "2–3 days",
    turnaroundDays: 3,
    biomarkerCount: 11,
    rating: 4.7,
    reviews: 340,
    title: "Sports and Fitness Blood Test",
    desc: "Comprehensive sports blood test checking key hormones and proteins for performance and fitness.",
    biomarkers: ["Testosterone", "DHEA-S", "Cortisol"],
    tag: "General",
    collection: "Finger Prick / Clinic",
  },
];

const SportsPerformancePage = () => (
  <CategoryPageLayout
    seoTitle="Sports Performance Tests | myhealth checkup"
    pillLabel="Sports-Fitness Health"
    seoDescription="Optimise your fitness and athletic performance with comprehensive health blood tests. Monitor bodybuilding biomarkers, nutrition status, and recovery markers from trusted UK providers."
    seoKeywords="fitness health tests, bodybuilding blood tests, athletic blood tests, fitness biomarkers, sports nutrition testing, recovery markers"
    canonicalUrl="https://myhealthcheckup.co.uk/sports-performance"
    headline="Sports-Fitness Health Blood Tests"
    subtitle="Optimise your athletic performance with comprehensive biomarker analysis — nutrition, recovery, and fitness markers from trusted UK labs."
    searchPlaceholder="Search by sport or goal — e.g. 'marathon', 'muscle recovery'"
    trustStats={[
      { value: "62,000+", label: "Tests Compared" },
      { value: "4.7★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All", "Bodybuilding", "Cycling", "Running", "Weightlifting", "General"]}
    tests={fitnessTests}
    benefitsTitle="Why Choose Sports-Fitness Health Testing?"
    benefits={[
      { icon: Zap, title: "Peak Performance", description: "Monitor biomarkers crucial for competitive advantage" },
      { icon: Activity, title: "Recovery Optimisation", description: "Track markers that impact recovery and adaptation" },
      { icon: TrendingUp, title: "Competitive Edge", description: "Data-driven insights to optimise training outcomes" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sports-Fitness Health" }]}
    compareUrl="/compare?category=fitness-health"
  />
);

export default SportsPerformancePage;
