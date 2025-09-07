
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { compareCategories } from "@/data/compare/categories";
import { getTestsForNavigation } from "@/data/goodbodyTests";

// Category colors following design system (using semantic color tokens)
const categoryColorMap: Record<string, string> = {
  'blood-tests': 'bg-red-500 text-white',
  'hormones': 'bg-pink-500 text-white', 
  'thyroid': 'bg-emerald-500 text-white',
  'vitamins': 'bg-lime-500 text-white',
  'diabetes': 'bg-orange-500 text-white',
  'heart-health': 'bg-red-600 text-white',
  'liver-health': 'bg-yellow-500 text-white',
  'kidney-health': 'bg-blue-500 text-white',
  'fertility': 'bg-purple-500 text-white',
  'general-health': 'bg-teal-500 text-white',
  'allergy-testing': 'bg-indigo-500 text-white',
  'cancer-screening': 'bg-gray-700 text-white'
};

// Main navigation structure mirroring Medichecks approach
export const navigationItems = [
  { name: "FIND YOUR TEST", path: "/assisted-test-finder", highlighted: true, hasDropdown: true, megaMenu: true },
  { name: "MOST POPULAR TESTS", path: "/most-popular-tests", highlighted: true, hasDropdown: true, megaMenu: true },
  { name: "AT-HOME TESTS", path: "/at-home-tests", hasDropdown: false },
  { name: "WOMEN'S HEALTH", path: "/womens-health", hasDropdown: true, megaMenu: true },
  { name: "MEN'S HEALTH", path: "/mens-health", hasDropdown: true, megaMenu: true },
  { name: "HORMONES", path: "/hormones", hasDropdown: true, megaMenu: true },
  { name: "THYROID", path: "/thyroid", hasDropdown: true, megaMenu: true },
  { name: "CANCER SCREENING", path: "/tests/cancer", hasDropdown: true, megaMenu: true },
  { name: "GENERAL WELLNESS", path: "/wellness", hasDropdown: true, megaMenu: true },
  { name: "HEALTH RESOURCES HUB", path: "/health-blog", hasDropdown: false }
];

interface NavigationItemsProps {
  onItemClick?: () => void;
  className?: string;
}

export const NavigationItems = ({ onItemClick, className = "" }: NavigationItemsProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMouseEnter = (itemName: string) => {
    const item = navigationItems.find(nav => nav.name === itemName);
    if (item?.hasDropdown) {
      setActiveDropdown(itemName);
    }
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const getGoodbodyTestsForDropdown = (itemName: string) => {
    // For FIND YOUR TEST and MOST POPULAR TESTS, show categories
    if (itemName === "FIND YOUR TEST" || itemName === "MOST POPULAR TESTS") {
      return null; // Will use categories
    }
    
  // For specific health sections, show actual Goodbody tests
  return getTestsForNavigation(itemName);
  };

  const getFilteredCategories = (itemName: string) => {
    // Filter categories based on navigation item using the universal taxonomy
    switch (itemName) {
      case "WOMEN'S HEALTH":
        return compareCategories.filter(cat => 
          ['fertility', 'hormones'].includes(cat.id)
        );
      case "MEN'S HEALTH":
        return compareCategories.filter(cat => 
          ['hormones', 'heart-health', 'general-health'].includes(cat.id)
        );
      case "HORMONES":
        return compareCategories.filter(cat => 
          ['hormones', 'thyroid', 'fertility'].includes(cat.id)
        );
      case "THYROID":
        return compareCategories.filter(cat => 
          ['thyroid', 'hormones'].includes(cat.id)
        );
      case "CANCER SCREENING":
        return compareCategories.filter(cat => 
          ['cancer-screening', 'general-health'].includes(cat.id)
        );
      case "GENERAL WELLNESS":
        return compareCategories.filter(cat => 
          ['vitamins', 'general-health', 'heart-health', 'liver-health'].includes(cat.id)
        );
      default:
        // Show all categories for FIND YOUR TEST and MOST POPULAR TESTS
        return compareCategories.slice(0, 8); // Limit to prevent overflow
    }
  };

  return (
    <nav className={`relative ${className}`} aria-label="Main Navigation">
      {navigationItems.map((item) => (
        <div 
          key={item.path}
          className="relative"
          onMouseEnter={() => handleMouseEnter(item.name)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={item.path}
            className={`text-[10px] font-bold transition-colors px-1.5 py-1 whitespace-nowrap hover:opacity-80 uppercase inline-flex items-center gap-1 ${
              (item as any).highlighted 
                ? "text-pink-500" 
                : "text-gray-700"
            }`}
            onClick={onItemClick}
          >
            {item.name}
            {item.hasDropdown && (
              <ChevronDown className="w-3 h-3" />
            )}
          </Link>
          
          {/* Mega Menu Dropdown */}
          {item.hasDropdown && activeDropdown === item.name && (
            <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 min-w-[500px] max-w-[600px]">
              <div className="p-6">
                {getGoodbodyTestsForDropdown(item.name) ? (
                  // Show Goodbody tests for health-specific sections
                  <>
                    <div className="grid grid-cols-1 gap-2">
                      {getGoodbodyTestsForDropdown(item.name)!.map((test) => (
                        <Link
                          key={test.id}
                          to={test.url || `/book/${test.id}`}
                          className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={onItemClick}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                                {test.name}
                              </h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">
                                {test.description}
                              </p>
                              {test.biomarkers && (
                                <p className="text-xs text-gray-400 mt-1">
                                  {test.biomarkers} biomarkers • {test.turnaround}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <span className="text-sm font-semibold text-primary">
                                £{test.price}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  // Show categories for FIND YOUR TEST and MOST POPULAR TESTS
                  <div className="grid grid-cols-2 gap-4">
                    {getFilteredCategories(item.name).map((category) => (
                      <Link
                        key={category.id}
                        to={`/compare?category=${category.id}`}
                        className="group block p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={onItemClick}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${categoryColorMap[category.id] || 'bg-gray-400'}`}></div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                              {category.name}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
                              {category.description}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
                
                {/* View All Link */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Link
                    to={item.path}
                    className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                    onClick={onItemClick}
                  >
                    View all {item.name.toLowerCase()}
                    <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};
