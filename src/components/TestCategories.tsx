import { Link } from "react-router-dom";
import { Heart, Activity, Droplets, Dna, Apple, ArrowRight, TestTube, User, UserCheck, FlaskConical, Weight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCategoryCSSClasses } from "@/data/categoryColors";
interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  testCount?: number;
  providerCount?: number;
  featured?: boolean;
}
const CategoryCard = ({
  title,
  description,
  icon,
  color,
  link,
  testCount,
  providerCount,
  featured = false
}: CategoryCardProps) => {
  return <Link to={link} className={cn("group relative overflow-hidden rounded-xl sm:rounded-2xl transition-all duration-500", "bg-gradient-to-br from-white to-gray-50/50", "border border-gray-200/60 hover:border-[#FA6980]/30", "hover:shadow-2xl hover:shadow-[#FA6980]/10", "hover:-translate-y-1 sm:hover:-translate-y-2", featured && "sm:col-span-2 sm:row-span-1")}>
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#FA6980]/5 to-[#3A5F85]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={cn("p-4 sm:p-5 md:p-6 relative z-10", featured && "sm:p-6 md:p-8")}>
        {/* Icon with gradient background */}
        <div className="mb-3 sm:mb-4 flex items-start justify-between gap-2">
          <div className={cn("relative rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-3.5 bg-gradient-to-br shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", "from-[#FA6980] to-[#e70d69] shrink-0")}>
            <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl" />
            {icon}
          </div>
          
          {/* Stats badges */}
          <div className="flex flex-col gap-1 sm:gap-1.5">
            {testCount && <Badge variant="secondary" className="bg-[#3A5F85]/10 text-[#3A5F85] border-0 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5">
                {testCount} tests
              </Badge>}
            {providerCount && <Badge variant="secondary" className="bg-[#FA6980]/10 text-[#e70d69] border-0 text-[10px] sm:text-xs font-medium px-1.5 sm:px-2.5 py-0.5">
                {providerCount} providers
              </Badge>}
          </div>
        </div>

        {/* Content */}
        <h3 className={cn("font-bold mb-2 sm:mb-3 text-[#081129] group-hover:text-[#FA6980] transition-colors duration-300", featured ? "text-xl sm:text-2xl md:text-3xl" : "text-lg sm:text-xl")}>
          {title}
        </h3>
        
        <p className={cn("text-gray-600 leading-relaxed mb-3 sm:mb-4 md:mb-5", featured ? "text-sm sm:text-base" : "text-xs sm:text-sm")}>
          {description}
        </p>
        
        {/* CTA */}
        <div className="flex items-center text-[#FA6980] font-semibold text-xs sm:text-sm group-hover:gap-2 sm:group-hover:gap-3 gap-1.5 sm:gap-2 transition-all duration-300">
          <span>Compare Options</span>
          <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 group-hover:translate-x-1 transition-transform duration-300" />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-[#FA6980] to-[#3A5F85] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
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
  return <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-12 md:py-[60px]">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12 md:mb-16 space-y-3 sm:space-y-4">
          <Badge className="bg-[#22c0d4]/10 text-[#22c0d4] border-0 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm font-semibold mb-3 sm:mb-4">
            HEALTH TESTING SERVICES
          </Badge>
          <h2 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#081129] mb-3 sm:mb-4 px-2">
            Explore Test Categories
          </h2>
          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-4">
            Compare comprehensive health tests from the UK's most trusted providers. 
            All tests are UKAS-accredited with fast turnaround times.
          </p>
        </div>
        
        {/* Category Grid - Mobile-first responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 max-w-7xl mx-auto mb-8 sm:mb-12">
          {categories.map((category, index) => {
          const colors = getCategoryCSSClasses(category.categoryId);
          // Make first category featured (spans 2 columns)
          const isFeatured = index === 0;
          return <CategoryCard key={index} {...category} color={colors.primary} featured={isFeatured} />;
        })}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-8 sm:mt-12 md:mt-16 px-4">
          <Button variant="default" size="lg" asChild className="bg-gradient-to-r from-[#FA6980] to-[#e70d69] hover:from-[#e70d69] hover:to-[#FA6980] text-white border-0 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 w-full sm:w-auto">
            <Link to="/compare">
              View All Tests
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>;
};
export default TestCategories;