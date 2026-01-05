import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { compareCategories } from '@/constants/categories';

interface CategorySelectorProps {
  onCategorySelect?: (categoryId: string) => void;
  selectedCategory?: string;
  showSearch?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  onCategorySelect,
  selectedCategory,
  showSearch = true
}) => {
  return (
    <Card className="w-full max-w-4xl mx-auto bg-white shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Find your perfect test by category
          </h2>
          <p className="text-gray-600 text-lg">
            Browse tests by health category to find exactly what you need
          </p>
        </div>

        {showSearch && (
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Find your perfect health test..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button 
              size="lg" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {compareCategories.map((category) => (
            <div
              key={category.id}
              className={cn(
                "group p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg",
                selectedCategory === category.id
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => onCategorySelect?.(category.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={cn(
                      "w-3 h-3 rounded-full",
                      getCategoryColor(category.id)
                    )} />
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {category.description}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <Link 
                  to={`/compare?category=${category.id}`}
                  className="inline-flex items-center text-primary font-medium text-sm hover:text-primary/80 transition-colors"
                >
                  View all tests →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/compare">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              View all test categories
              <Search className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

const getCategoryColor = (categoryId: string): string => {
  const colorMap: Record<string, string> = {
    'blood-tests': 'bg-red-500',
    'hormones': 'bg-purple-500', 
    'thyroid': 'bg-green-500',
    'vitamins': 'bg-yellow-500',
    'diabetes': 'bg-orange-500',
    'heart-health': 'bg-red-600',
    'liver-health': 'bg-yellow-600',
    'kidney-health': 'bg-[#081129]',
    'fertility': 'bg-pink-500',
    'general-health': 'bg-gray-500',
    'allergy-testing': 'bg-cyan-500',
    'cancer-screening': 'bg-indigo-500'
  };
  
  return colorMap[categoryId] || 'bg-gray-400';
};

export default CategorySelector;