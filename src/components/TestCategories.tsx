import { Link } from "react-router-dom";
import { Heart, Activity, Droplets, Dna, Apple, ArrowRight, TestTube, User, UserCheck, FlaskConical, Weight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { getCategoryCSSClasses } from "@/data/categoryColors";
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
  color,
  link,
  testCount,
  providerCount
}: CategoryCardProps) => {
  return <Link to={link} className={cn("block p-6 rounded-xl transition-all duration-300", "bg-white shadow-lg shadow-gray-100/40 hover:shadow-xl hover:scale-105", "border border-gray-100 hover:border-gray-200")}>
      <div className={cn("w-14 h-14 rounded-lg mb-4 flex items-center justify-center", color)}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 text-sm leading-relaxed">{description}</p>
      
      {/* Provider and test count indicators */}
      <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
        {testCount && <span>{testCount} tests available</span>}
        {providerCount && <span>{providerCount} providers</span>}
      </div>
      
      <div className="flex items-center text-health-600 font-medium">
        Compare All Options <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </Link>;
};
const TestCategories = (): JSX.Element => {
  const categories = [{
    categoryId: "cancer-screening",
    title: "Cancer Screening",
    description: "Comprehensive early detection tests for prostate, bowel, breast, cervical, and other common cancers across multiple providers.",
    icon: <Dna className="h-6 w-6 text-white" />,
    link: "/tests/cancer",
    testCount: 15,
    providerCount: 8
  }, {
    categoryId: "heart-health",
    title: "Heart Health",
    description: "Complete cardiovascular assessments including cholesterol profiles, cardiac risk assessments, and heart health monitoring.",
    icon: <Heart className="h-6 w-6 text-white" />,
    link: "/tests/heart",
    testCount: 12,
    providerCount: 7
  }, {
    categoryId: "hormones",
    title: "Hormone Health",
    description: "Comprehensive hormone testing including thyroid function, cortisol, reproductive hormones, and hormone optimization.",
    icon: <FlaskConical className="h-6 w-6 text-white" />,
    link: "/compare?category=hormones",
    testCount: 18,
    providerCount: 6
  }, {
    categoryId: "mens-health",
    title: "Men's Health",
    description: "Specialised testing for men including testosterone levels, prostate health, fertility assessments, and male-specific wellness checks.",
    icon: <User className="h-6 w-6 text-white" />,
    link: "/tests/mens-health",
    testCount: 14,
    providerCount: 9
  }, {
    categoryId: "womens-health",
    title: "Women's Health & Fertility",
    description: "Comprehensive women's health testing including reproductive hormones, fertility assessments, PCOS screening, and gynecological health.",
    icon: <UserCheck className="h-6 w-6 text-white" />,
    link: "/tests/womens-health",
    testCount: 20,
    providerCount: 8
  }, {
    categoryId: "diabetes",
    title: "Diabetes & Blood Sugar",
    description: "Complete diabetes screening and monitoring including HbA1c, glucose tolerance tests, and insulin resistance assessments.",
    icon: <Activity className="h-6 w-6 text-white" />,
    link: "/tests/diabetes",
    testCount: 8,
    providerCount: 6
  }, {
    categoryId: "general-health",
    title: "Gut Health & Digestion",
    description: "Comprehensive digestive health testing including food intolerances, gut microbiome analysis, and inflammatory markers.",
    icon: <Droplets className="h-6 w-6 text-white" />,
    link: "/tests/gut",
    testCount: 11,
    providerCount: 5
  }, {
    categoryId: "vitamins",
    title: "Vitamin & Nutrient Testing",
    description: "Complete nutritional assessments including Vitamin D, B12, Iron, Folate, and comprehensive micronutrient panels.",
    icon: <Apple className="h-6 w-6 text-white" />,
    link: "/compare?category=vitamins",
    testCount: 13,
    providerCount: 7
  }, {
    categoryId: "blood-tests",
    title: "Comprehensive Blood Panels",
    description: "Full blood count and biochemistry panels providing complete health overviews with detailed biomarker analysis.",
    icon: <TestTube className="h-6 w-6 text-white" />,
    link: "/compare?category=blood-tests",
    testCount: 16,
    providerCount: 10
  }];
  return <section className="bg-[#081129] py-[20px] my-0">
      <div className="container mx-auto px-4 bg-[#081129]">
        <div className="text-center mb-12 bg-[#081129]">
          <h2 className="font-bold mb-4 text-4xl my-[20px] text-[#22c0d4]">Test Categories</h2>
          <p className="text-xl max-w-3xl mx-auto text-[#e70d69]">
            Explore our comprehensive range of health tests, carefully curated from the UK's most trusted providers.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {categories.map((category, index) => {
          const colors = getCategoryCSSClasses(category.categoryId);
          return <CategoryCard key={index} {...category} color={colors.primary} />;
        })}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link to="/compare">
              View All Tests
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default TestCategories;