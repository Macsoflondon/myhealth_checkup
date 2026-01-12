import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { testsByCategory } from "@/data/compare/mappedTestData";
import { getCategoryColor } from "@/data/categoryColors";

// Same navigation structure as MegaMenu
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
    name: "Sports/Fitness Health", 
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

interface MobileMegaMenuProps {
  onItemClick?: () => void;
  className?: string;
}

export const MobileMegaMenu = ({ onItemClick, className = "" }: MobileMegaMenuProps) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (itemName: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(itemName)) {
      newExpanded.delete(itemName);
    } else {
      newExpanded.add(itemName);
    }
    setExpandedCategories(newExpanded);
  };

  const getTestsForCategories = (categories: string[]) => {
    const tests: any[] = [];
    categories.forEach(categoryId => {
      if (testsByCategory[categoryId]) {
        tests.push(...testsByCategory[categoryId].slice(0, 4)); // Limit for mobile
      }
    });
    return tests.slice(0, 6); // Limit total to 6 tests for mobile
  };

  return (
    <nav className={className} aria-label="Mobile Navigation">
      {navigationCategories.map((item) => {
        const hasDropdown = !item.isStatic && item.categories;
        const categoryColor = item.categoryId ? getCategoryColor(item.categoryId) : null;
        const isExpanded = expandedCategories.has(item.name);

        if (hasDropdown) {
          return (
            <div key={item.path} className="space-y-1">
              {/* Category Header - Clickable to expand/collapse */}
              <div className="flex items-center justify-between">
                <Link
                  to={item.path}
                  className="flex-1 flex items-center gap-2 text-gray-700 hover:text-primary transition-colors font-medium text-xl py-2.5"
                  onClick={onItemClick}
                >
                  {categoryColor && (
                    <div className={`w-2 h-2 rounded-full ${categoryColor.primary}`} />
                  )}
                  {item.name}
                </Link>
                <button
                  onClick={() => toggleCategory(item.name)}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.name} category`}
                >
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Expanded Tests */}
              {isExpanded && (
                <div className="ml-4 space-y-2 py-2 border-l-2 border-gray-100 pl-3">
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
                      return `/compare?category=${test.category}`;
                    };
                    return (
                      <Link
                        key={`${test.id}-${index}`}
                        to={getTestUrl()}
                        className="block p-2 rounded-md hover:bg-gray-50 transition-colors"
                        onClick={onItemClick}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {testCategoryColor && (
                            <div className={`w-1.5 h-1.5 rounded-full ${testCategoryColor.primary}`} />
                          )}
                          <span className="text-lg font-medium text-gray-800">
                            {test.name.length > 30 ? `${test.name.substring(0, 30)}...` : test.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{test.provider}</span>
                          <span className="font-medium text-primary">£{test.price}</span>
                        </div>
                      </Link>
                    );
                  })}
                  
                  {/* View All Link */}
                  <Link
                    to={item.path}
                    className={`inline-flex items-center gap-1 text-sm font-medium mt-2 transition-colors ${
                      categoryColor ? categoryColor.text : 'text-primary'
                    } hover:opacity-80`}
                    onClick={onItemClick}
                  >
                    View all {item.name.toLowerCase()} tests
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          );
        }

        // Static navigation items (no dropdown)
        return (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center text-gray-700 hover:text-primary transition-colors font-medium text-xl py-2.5"
            onClick={onItemClick}
          >
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
};