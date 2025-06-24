
import { Link } from "react-router-dom";
import { 
  Heart, 
  Activity, 
  Droplets, 
  Dna, 
  Apple,
  ArrowRight,
  TestTube,
  User,
  UserCheck,
  FlaskConical,
  Weight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
  testCount?: number;
  providerCount?: number;
}

const CategoryCard = ({ title, description, icon, color, link, testCount, providerCount }: CategoryCardProps) => {
  return (
    <Link 
      to={link}
      className={cn(
        "block p-6 rounded-xl transition-all duration-300",
        "bg-white shadow-lg shadow-gray-100/40 hover:shadow-xl hover:scale-105",
        "border border-gray-100 hover:border-gray-200"
      )}
    >
      <div className={cn(
        "w-14 h-14 rounded-lg mb-4 flex items-center justify-center",
        color
      )}>
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
    </Link>
  );
};

const TestCategories = () => {
  const categories = [
    {
      title: "Cancer Screening",
      description: "Comprehensive early detection tests for prostate, bowel, breast, cervical, and other common cancers across multiple providers.",
      icon: <Dna className="h-6 w-6 text-white" />,
      color: "bg-red-500",
      link: "/tests/cancer",
      testCount: 15,
      providerCount: 8
    },
    {
      title: "Heart Health",
      description: "Complete cardiovascular assessments including cholesterol profiles, cardiac risk assessments, and heart health monitoring.",
      icon: <Heart className="h-6 w-6 text-white" />,
      color: "bg-health-600",
      link: "/tests/heart",
      testCount: 12,
      providerCount: 7
    },
    {
      title: "Hormone Health",
      description: "Comprehensive hormone testing including thyroid function, cortisol, reproductive hormones, and hormone optimization.",
      icon: <FlaskConical className="h-6 w-6 text-white" />,
      color: "bg-purple-600",
      link: "/compare?category=hormones",
      testCount: 18,
      providerCount: 6
    },
    {
      title: "Men's Health",
      description: "Specialized testing for men including testosterone levels, prostate health, fertility assessments, and male-specific wellness checks.",
      icon: <User className="h-6 w-6 text-white" />,
      color: "bg-blue-600",
      link: "/tests/mens-health",
      testCount: 14,
      providerCount: 9
    },
    {
      title: "Women's Health & Fertility",
      description: "Comprehensive women's health testing including reproductive hormones, fertility assessments, PCOS screening, and gynecological health.",
      icon: <UserCheck className="h-6 w-6 text-white" />,
      color: "bg-pink-500",
      link: "/tests/womens-health",
      testCount: 20,
      providerCount: 8
    },
    {
      title: "Diabetes & Blood Sugar",
      description: "Complete diabetes screening and monitoring including HbA1c, glucose tolerance tests, and insulin resistance assessments.",
      icon: <Activity className="h-6 w-6 text-white" />,
      color: "bg-purple-500",
      link: "/tests/diabetes",
      testCount: 8,
      providerCount: 6
    },
    {
      title: "Gut Health & Digestion",
      description: "Comprehensive digestive health testing including food intolerances, gut microbiome analysis, and inflammatory markers.",
      icon: <Droplets className="h-6 w-6 text-white" />,
      color: "bg-amber-500",
      link: "/tests/gut",
      testCount: 11,
      providerCount: 5
    },
    {
      title: "Vitamin & Nutrient Testing",
      description: "Complete nutritional assessments including Vitamin D, B12, Iron, Folate, and comprehensive micronutrient panels.",
      icon: <Apple className="h-6 w-6 text-white" />,
      color: "bg-wellness-600",
      link: "/compare?category=vitamins",
      testCount: 13,
      providerCount: 7
    },
    {
      title: "Comprehensive Blood Panels",
      description: "Full blood count and biochemistry panels providing complete health overviews with detailed biomarker analysis.",
      icon: <TestTube className="h-6 w-6 text-white" />,
      color: "bg-teal-500",
      link: "/compare?category=blood-tests",
      testCount: 16,
      providerCount: 10
    },
    {
      title: "Weight Management Solutions",
      description: "Advanced weight management programs including metabolic testing, GLP-1 treatments, and personalized weight loss plans.",
      icon: <Weight className="h-6 w-6 text-white" />,
      color: "bg-emerald-500",
      link: "/compare?category=weight-loss",
      testCount: 7,
      providerCount: 4
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive Health Testing</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Compare tests and providers across all major health categories. Get the best prices and most comprehensive testing options for proactive health management.
          </p>
          <Link to="/compare">
            <Button size="lg" className="bg-health-600 hover:bg-health-700">
              Compare All Providers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>

        {/* Additional call-to-action for comprehensive comparison */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-health-600 to-wellness-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Get Complete Health Insights from 10+ Leading Providers
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-3xl mx-auto">
              Our platform aggregates real-time pricing and availability from all major UK private health providers, 
              ensuring you get the best value and most comprehensive testing options.
            </p>
            <Button size="lg" variant="secondary" className="bg-white text-health-700 hover:bg-gray-100">
              Start Comparing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestCategories;
