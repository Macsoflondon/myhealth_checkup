
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
  Weight,
  Syringe,
  Ear
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  link: string;
}

const CategoryCard = ({ title, description, icon, color, link }: CategoryCardProps) => {
  return (
    <Link 
      to={link}
      className={cn(
        "block p-6 rounded-xl transition-all duration-200",
        "bg-white shadow-lg shadow-gray-100/40 hover:shadow-xl",
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
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex items-center text-health-600 font-medium">
        Learn More <ArrowRight className="ml-2 h-4 w-4" />
      </div>
    </Link>
  );
};

const TestCategories = () => {
  const categories = [
    {
      title: "Cancer Screening",
      description: "Early detection tests for prostate, bowel, and other common cancers.",
      icon: <Dna className="h-6 w-6 text-white" />,
      color: "bg-red-500",
      link: "/tests/cancer"
    },
    {
      title: "Heart Health",
      description: "Comprehensive cholesterol profiles and cardiac risk assessments.",
      icon: <Heart className="h-6 w-6 text-white" />,
      color: "bg-health-600",
      link: "/tests/heart"
    },
    {
      title: "Hormone Health",
      description: "Thyroid function, cortisol, and reproductive hormone assessments.",
      icon: <FlaskConical className="h-6 w-6 text-white" />,
      color: "bg-purple-600",
      link: "/tests/hormones"
    },
    {
      title: "Men's Health",
      description: "Testosterone, prostate health, and male-specific wellness checks.",
      icon: <User className="h-6 w-6 text-white" />,
      color: "bg-blue-600",
      link: "/tests/mens-health"
    },
    {
      title: "Women's Health & Fertility",
      description: "Reproductive hormones, fertility assessments, and gynecological health.",
      icon: <Heart className="h-6 w-6 text-white" />,
      color: "bg-pink-500",
      link: "/tests/womens-health"
    },
    {
      title: "Diabetes",
      description: "HbA1c and glucose testing to monitor or detect diabetes early.",
      icon: <Activity className="h-6 w-6 text-white" />,
      color: "bg-purple-500",
      link: "/tests/diabetes"
    },
    {
      title: "Gut Health",
      description: "Tests for digestive issues, food intolerances, and gut inflammation.",
      icon: <Droplets className="h-6 w-6 text-white" />,
      color: "bg-amber-500",
      link: "/tests/gut"
    },
    {
      title: "Ear Wax Removal",
      description: "Professional microsuction services for safe and effective ear wax removal.",
      icon: <Ear className="h-6 w-6 text-white" />,
      color: "bg-blue-400",
      link: "/compare?category=ear-wax"
    },
    {
      title: "Vitamin Deficiency",
      description: "Check for common deficiencies including Vitamin D, B12, and Iron.",
      icon: <Apple className="h-6 w-6 text-white" />,
      color: "bg-wellness-600",
      link: "/tests/vitamins"
    },
    {
      title: "Rapid Test Kits",
      description: "Quick at-home tests for infections, allergies, and immediate health concerns.",
      icon: <TestTube className="h-6 w-6 text-white" />,
      color: "bg-teal-500",
      link: "/tests/rapid-kits"
    },
    {
      title: "Weight Loss Solutions",
      description: "Weight management programs including advanced weight loss injections.",
      icon: <Weight className="h-6 w-6 text-white" />,
      color: "bg-emerald-500",
      link: "/tests/weight-loss"
    },
    {
      title: "Longevity Therapies",
      description: "Innovative treatments focused on healthy aging and lifespan extension.",
      icon: <FlaskConical className="h-6 w-6 text-white" />,
      color: "bg-indigo-600",
      link: "/tests/longevity"
    },
    {
      title: "Travel Vaccinations",
      description: "Pre-travel immunizations and health consultations for international trips.",
      icon: <Syringe className="h-6 w-6 text-white" />,
      color: "bg-cyan-500",
      link: "/tests/travel-vaccines"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Health Tests</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Comprehensive testing across multiple providers, helping you take control of your health.
          </p>
          <Link to="/compare">
            <Button size="lg" className="bg-health-600 hover:bg-health-700">
              Compare Providers
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <CategoryCard key={index} {...category} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestCategories;
