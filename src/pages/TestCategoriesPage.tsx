import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Heart, Activity, Droplets, Dna, Apple, TestTube, User, UserCheck, FlaskConical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { getCategoryCSSClasses } from "@/data/categoryColors";
import HeroSection from "@/components/sections/HeroSection";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  testCount?: number;
  providerCount?: number;
}

const CategoryCard = ({
  title,
  description,
  icon,
  link,
  testCount,
  providerCount,
}: CategoryCardProps) => {
  return (
    <Link
      to={link}
      className={cn(
        "group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500",
        "bg-gradient-to-br from-white to-gray-50/50",
        "border border-gray-200/60 hover:border-primary/30",
        "hover:shadow-2xl hover:shadow-primary/10",
        "hover:-translate-y-1 sm:hover:-translate-y-2"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="p-4 sm:p-5 md:p-6 relative z-10">
        <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
          <div className="relative rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-3.5 bg-gradient-to-br from-primary to-primary-dark shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0">
            <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl" />
            {icon}
          </div>

          <div className="flex flex-col gap-1 sm:gap-1.5">
            {testCount && (
              <Badge variant="secondary" className="bg-secondary/10 text-secondary border-0 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5">
                {testCount} tests
              </Badge>
            )}
            {providerCount && (
              <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5">
                {providerCount} providers
              </Badge>
            )}
          </div>
        </div>

        <h3 className="font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors duration-300 text-lg sm:text-xl">
          {title}
        </h3>

        <p className="text-muted-foreground leading-relaxed mb-3 sm:mb-4 md:mb-5 text-xs sm:text-sm">
          {description}
        </p>

        <div className="flex items-center text-primary font-semibold text-xs sm:text-sm transition-all duration-300">
          <span>Compare Options</span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </Link>
  );
};

const categories = [
  {
    categoryId: "cancer-screening",
    title: "Cancer Screening",
    description: "Comprehensive early detection tests for prostate, bowel, breast, cervical, and other common cancers across multiple providers.",
    icon: <Dna className="h-6 w-6 text-white" />,
    link: "/tests/cancer",
    testCount: 15,
    providerCount: 8,
  },
  {
    categoryId: "heart-health",
    title: "Heart Health",
    description: "Complete cardiovascular assessments including cholesterol profiles, cardiac risk assessments, and heart health monitoring.",
    icon: <Heart className="h-6 w-6 text-white" />,
    link: "/tests/heart",
    testCount: 12,
    providerCount: 7,
  },
  {
    categoryId: "hormones",
    title: "Hormone Health",
    description: "Comprehensive hormone testing including thyroid function, cortisol, reproductive hormones, and hormone optimisation.",
    icon: <FlaskConical className="h-6 w-6 text-white" />,
    link: "/compare?category=hormones",
    testCount: 18,
    providerCount: 6,
  },
  {
    categoryId: "mens-health",
    title: "Men's Health",
    description: "Specialised testing for men including testosterone levels, prostate health, fertility assessments, and male-specific wellness checks.",
    icon: <User className="h-6 w-6 text-white" />,
    link: "/tests/mens-health",
    testCount: 14,
    providerCount: 9,
  },
  {
    categoryId: "womens-health",
    title: "Women's Health & Fertility",
    description: "Comprehensive women's health testing including reproductive hormones, fertility assessments, PCOS screening, and gynaecological health.",
    icon: <UserCheck className="h-6 w-6 text-white" />,
    link: "/tests/womens-health",
    testCount: 20,
    providerCount: 8,
  },
  {
    categoryId: "diabetes",
    title: "Diabetes & Blood Sugar",
    description: "Complete diabetes screening and monitoring including HbA1c, glucose tolerance tests, and insulin resistance assessments.",
    icon: <Activity className="h-6 w-6 text-white" />,
    link: "/tests/diabetes",
    testCount: 8,
    providerCount: 6,
  },
  {
    categoryId: "general-health",
    title: "Gut Health & Digestion",
    description: "Comprehensive digestive health testing including food intolerances, gut microbiome analysis, and inflammatory markers.",
    icon: <Droplets className="h-6 w-6 text-white" />,
    link: "/tests/gut",
    testCount: 11,
    providerCount: 5,
  },
  {
    categoryId: "vitamins",
    title: "Vitamin & Nutrient Testing",
    description: "Complete nutritional assessments including Vitamin D, B12, Iron, Folate, and comprehensive micronutrient panels.",
    icon: <Apple className="h-6 w-6 text-white" />,
    link: "/compare?category=vitamins",
    testCount: 13,
    providerCount: 7,
  },
  {
    categoryId: "blood-tests",
    title: "Comprehensive Blood Panels",
    description: "Full blood count and biochemistry panels providing complete health overviews with detailed biomarker analysis.",
    icon: <TestTube className="h-6 w-6 text-white" />,
    link: "/compare?category=blood-tests",
    testCount: 16,
    providerCount: 10,
  },
];

const TestCategoriesPage = () => {
  return (
    <>
      <Helmet>
        <title>Test Categories | myhealth checkup</title>
        <meta
          name="description"
          content="Browse all health test categories. Compare blood tests, cancer screening, heart health, hormone tests, and more from trusted UK providers."
        />
        <link rel="canonical" href="https://myhealthcheckup.co.uk/test-categories" />
      </Helmet>

      <Header />

      <HeroSection
        title="Test Categories"
        accent="Find the Right Test for You"
        subtitle="Browse comprehensive health tests from the UK's most trusted providers. All tests are UKAS-accredited with fast turnaround times."
      />

      <main className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-12">
          <PageBreadcrumb />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto">
            {categories.map((category, index) => {
              const colors = getCategoryCSSClasses(category.categoryId);
              return (
                <CategoryCard
                  key={index}
                  {...category}
                  color={colors.primary}
                />
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default TestCategoriesPage;
