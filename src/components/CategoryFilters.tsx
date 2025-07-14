import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  User, 
  Users, 
  Activity, 
  Shield, 
  Zap, 
  Baby, 
  Stethoscope 
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategoryFilters = () => {
  const navigate = useNavigate();

  const categories = [
    {
      id: "general",
      name: "General Health",
      icon: Stethoscope,
      description: "Comprehensive health checks and blood panels",
      tests: 45,
      color: "text-blue-600 bg-blue-100"
    },
    {
      id: "mens-health",
      name: "Men's Health",
      icon: User,
      description: "Testosterone, prostate, and male-specific tests",
      tests: 28,
      color: "text-indigo-600 bg-indigo-100"
    },
    {
      id: "womens-health",
      name: "Women's Health & Fertility",
      icon: Users,
      description: "Hormones, fertility, and reproductive health",
      tests: 32,
      color: "text-pink-600 bg-pink-100"
    },
    {
      id: "heart-health",
      name: "Heart Health",
      icon: Heart,
      description: "Cholesterol, lipids, and cardiovascular markers",
      tests: 18,
      color: "text-red-600 bg-red-100"
    },
    {
      id: "cancer-screening",
      name: "Cancer Screening",
      icon: Shield,
      description: "Early detection and tumor marker tests",
      tests: 22,
      color: "text-purple-600 bg-purple-100"
    },
    {
      id: "hormone-health",
      name: "Hormone Health",
      icon: Zap,
      description: "Thyroid, cortisol, and endocrine function",
      tests: 35,
      color: "text-yellow-600 bg-yellow-100"
    },
    {
      id: "sexual-health",
      name: "Sexual Health",
      icon: Baby,
      description: "STI screening and sexual wellness tests",
      tests: 15,
      color: "text-green-600 bg-green-100"
    },
    {
      id: "nutrition",
      name: "Vitamin & Nutrition Testing",
      icon: Activity,
      description: "Vitamins, minerals, and nutritional deficiencies",
      tests: 25,
      color: "text-orange-600 bg-orange-100"
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/compare?category=${categoryId}`);
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find Tests by Category
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our comprehensive range of health tests organized by specialty
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card 
                key={category.id} 
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-2 border-transparent hover:border-health-primary/20"
                onClick={() => handleCategoryClick(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full ${category.color} mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {category.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-health-primary">
                      {category.tests} tests available
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full group-hover:bg-health-primary group-hover:text-white group-hover:border-health-primary transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategoryClick(category.id);
                    }}
                  >
                    View Tests
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CategoryFilters;