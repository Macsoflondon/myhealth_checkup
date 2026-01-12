import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { testsByCategory } from "@/data/compare/mappedTestData";
import { getCategoryColor } from "@/data/categoryColors";

// Main navigation items with their categories
const navigationCategories = [
  { 
    name: "Find your test", 
    path: "/assisted-test-finder",
    isStatic: true 
  },
  { 
    name: "Most popular tests", 
    path: "/popular-tests",
    isStatic: true 
  },
  { 
    name: "At-home tests", 
    path: "/at-home-tests",
    isStatic: true 
  },
  { 
    name: "Women's", 
    path: "/womens-health",
    categoryId: "womens-health",
    categories: ["fertility", "hormones", "womens-health"]
  },
  { 
    name: "Men's", 
    path: "/mens-health",
    categoryId: "mens-health", 
    categories: ["mens-health", "hormones"]
  },
  { 
    name: "Thyroid", 
    path: "/thyroid",
    categoryId: "thyroid",
    categories: ["thyroid", "hormones"]
  },
  { 
    name: "Sports Performance", 
    path: "/sports-performance",
    categoryId: "vitamins",
    categories: ["vitamins", "blood-tests"]
  },
  { 
    name: "Wellness", 
    path: "/wellness",
    categoryId: "general-health",
    categories: ["general-health", "vitamins", "blood-tests"]
  },
  { 
    name: "Conditions", 
    path: "/conditions",
    categoryId: "general-health", 
    categories: ["diabetes", "heart-health", "liver-health", "kidney-health"]
  },
  { 
    name: "Health Hub", 
    path: "/health-blog",
    isStatic: true 
  },
  { 
    name: "My results", 
    path: "/dashboard",
    isStatic: true 
  }
];

interface MegaMenuProps {
  className?: string;
  onItemClick?: () => void;
}

export const MegaMenu = ({ className = "", onItemClick }: MegaMenuProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMouseEnter = (itemName: string) => {
    const item = navigationCategories.find(nav => nav.name === itemName);
    if (item && !item.isStatic && item.categories) {
      setActiveDropdown(itemName);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleTestClick = () => {
    setActiveDropdown(null);
    onItemClick?.();
  };

  const getTestsForCategories = (categories: string[]) => {
    const tests: any[] = [];
    categories.forEach(categoryId => {
      if (testsByCategory[categoryId]) {
        tests.push(...testsByCategory[categoryId].slice(0, 5)); // Limit to 5 tests per category
      }
    });
    return tests.slice(0, 8); // Limit total to 8 tests
  };

  return (
    <nav className={className} aria-label="Main Navigation">
      {navigationCategories.map((item) => {
        const hasDropdown = !item.isStatic && item.categories;
        const categoryColor = item.categoryId ? getCategoryColor(item.categoryId) : null;
        const isActive = activeDropdown === item.name;

        return (
          <div 
            key={item.path}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.name)}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              to={item.path}
              className="flex items-center gap-1 text-gray-700 hover:text-primary transition-colors font-medium text-xl py-2.5 px-2"
              onClick={onItemClick}
            >
              {item.name}
              {hasDropdown && (
                <ChevronDown 
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isActive ? 'rotate-180' : ''
                  }`} 
                />
              )}
            </Link>

            {/* Dropdown Menu */}
            {hasDropdown && isActive && (
              <div 
                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[320px] z-50"
                onMouseEnter={() => setActiveDropdown(item.name)}
                onMouseLeave={handleMouseLeave}
              >
                <div className="p-4">
                  {/* Category Header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100">
                    {categoryColor && (
                      <div 
                        className={`w-3 h-3 rounded-full ${categoryColor.primary}`}
                      />
                    )}
                    <h3 className="font-semibold text-gray-900">{item.name} Tests</h3>
                  </div>

                  {/* Test List */}
                  <div className="space-y-2">
                    {getTestsForCategories(item.categories || []).map((test, index) => {
                      const testCategoryColor = getCategoryColor(test.category);
                      // Generate the correct provider-specific URL using centralized mapping
                      const getTestUrl = () => {
                        const providerSlug = test.provider?.toLowerCase().replace(/\s+/g, '-');
                        if (providerSlug?.includes('medichecks')) return `/medichecks/${test.id}`;
                        if (providerSlug?.includes('goodbody')) return `/goodbody-clinic/${test.id}`;
                        if (providerSlug?.includes('lola')) return `/lola-health/${test.id}`;
                        if (providerSlug?.includes('thriva')) return `/thriva/${test.id}`;
                        if (providerSlug?.includes('randox')) return `/randox/${test.id}`;
                        if (providerSlug?.includes('tuli')) return `/tuli-health/${test.id}`;
                        if (providerSlug?.includes('london')) return `/london-medical-laboratory/${test.id}`;
                        // Fallback to compare page with category filter
                        return `/compare?category=${test.category}`;
                      };
                      return (
                        <Link
                          key={`${test.id}-${index}`}
                          to={getTestUrl()}
                          className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors group"
                          onClick={handleTestClick}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {testCategoryColor && (
                                <div 
                                  className={`w-2 h-2 rounded-full ${testCategoryColor.primary} opacity-70`}
                                />
                              )}
                              <span className="text-lg font-medium text-gray-800 group-hover:text-primary">
                                {test.name.length > 35 ? `${test.name.substring(0, 35)}...` : test.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500">{test.provider}</span>
                              <span className="text-sm font-medium text-primary">£{test.price}</span>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  {/* View All Link */}
                  <div className="mt-3 pt-2 border-t border-gray-100">
                    <Link
                      to={item.path}
                      className={`inline-flex items-center gap-1 text-lg font-medium transition-colors ${
                        categoryColor ? categoryColor.text : 'text-primary'
                      } hover:opacity-80`}
                      onClick={handleTestClick}
                    >
                      View all {item.name.toLowerCase()} tests
                      <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
};