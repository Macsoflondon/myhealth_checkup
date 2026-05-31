import { DbCategoryPage } from "@/components/category/DbCategoryPage";
import { Heart, Baby, Users } from "lucide-react";

const WomensHealthPage = () => (
  <DbCategoryPage
    canonicalCategory="womens-health"
    seoTitle="Women's Health Tests | myhealth checkup"
    pillLabel="Women's Health"
    seoDescription="Comprehensive women's health testing including hormones, fertility, menopause, and PCOS screening from trusted UK providers. Compare prices and book today."
    seoKeywords="women's health tests, hormone test, fertility test, menopause test, PCOS test, well woman test"
    canonicalUrl="https://www.myhealthcheckup.co.uk/womens-health"
    headline="Women's Health"
    subtitle="Comprehensive female health screening — hormones, fertility, menopause, and PCOS — designed for women's unique needs."
    searchPlaceholder="Search by symptom or test — e.g. 'irregular periods', 'menopause'"
    trustStats={[
      { value: "50,000+", label: "Tests Compared" },
      { value: "4.8★", label: "Average Rating" },
      { value: "6", label: "Trusted Providers" },
    ]}
    filters={["All"]}
    benefitsTitle="Why Choose Women's Health Testing?"
    benefits={[
      { icon: Heart, title: "Hormone Balance", description: "Early detection of women's health conditions" },
      { icon: Baby, title: "Fertility Planning", description: "Comprehensive fertility and reproductive health insights" },
      { icon: Users, title: "Lifelong Wellness", description: "Monitor and optimise health throughout every life stage" },
    ]}
    breadcrumbs={[{ label: "Home", href: "/" }, { label: "Women's Health" }]}
    compareUrl="/compare?category=womens-health"
  />
);

export default WomensHealthPage;
