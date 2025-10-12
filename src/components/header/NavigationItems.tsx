
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
  'kidney-health': 'bg-[#081129] text-white',
  'fertility': 'bg-purple-500 text-white',
  'general-health': 'bg-teal-500 text-white',
  'allergy-testing': 'bg-indigo-500 text-white',
  'cancer-screening': 'bg-gray-700 text-white'
};

// Main navigation structure - primary items shown in toolbar
export const primaryNavigationItems = [
  { name: "Most Popular Tests", path: "/popular-tests", highlighted: true, hasDropdown: true, megaMenu: true },
  { name: "Cancer Screening", path: "/tests/cancer", hasDropdown: true, megaMenu: true },
  { name: "Women's Health", path: "/womens-health", hasDropdown: true, megaMenu: true },
  { name: "Men's Health", path: "/mens-health", hasDropdown: true, megaMenu: true },
  { name: "Fertility", path: "/fertility-tests", hasDropdown: true, megaMenu: true },
  { name: "General Wellness", path: "/wellness", hasDropdown: true, megaMenu: true },
  { name: "Know My Results", path: "/dashboard" }
];

// Additional pages for the MORE dropdown - organized by user needs
export const moreNavigationItems = [
  // Information Pages
  { name: "About Us", path: "/about" },
  { name: "FAQs", path: "/faqs" },
  
  // Services
  { name: "Trusted UK Providers", path: "/trusted-providers" },
  { name: "Find a Clinic", path: "/find-clinic" },
  { name: "Assisted Test Finder", path: "/assisted-test-finder" },
  
  // Resources
  { name: "Health Resources Hub", path: "/health-blog" },
  { name: "Compare Tests", path: "/compare" },
  
  // Business
  { name: "Contact Us", path: "/contact" }
];

export const navigationItems = primaryNavigationItems;

interface NavigationItemsProps {
  onItemClick?: () => void;
  className?: string;
}

export const NavigationItems = ({ onItemClick, className = "" }: NavigationItemsProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleMouseEnter = (itemName: string) => {
    const item = primaryNavigationItems.find(nav => nav.name === itemName);
    if (item?.hasDropdown) {
      setActiveDropdown(itemName);
    }
  };

  const handleMouseLeave = (event: React.MouseEvent) => {
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    // Don't close if mouse is moving to the dropdown or staying within navigation area
    if (relatedTarget?.closest('.dropdown-content') || 
        relatedTarget?.closest('.nav-item-wrapper') ||
        relatedTarget?.closest('nav')) {
      return;
    }
    
    // Small delay to prevent accidental closes during rapid movements
    setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  const getGoodbodyTestsForDropdown = (itemName: string) => {
    // For Most Popular Tests, show categories
    if (itemName === "Most Popular Tests") {
      return null; // Will use categories
    }
    
  // For specific health sections, show actual Goodbody tests
  return getTestsForNavigation(itemName);
  };

  const getFilteredCategories = (itemName: string) => {
    // Filter categories based on navigation item using the universal taxonomy
    switch (itemName) {
      case "Women's Health":
        return compareCategories.filter(cat => 
          ['fertility', 'hormones'].includes(cat.id)
        );
      case "Men's Health":
        return compareCategories.filter(cat => 
          ['hormones', 'heart-health', 'general-health'].includes(cat.id)
        );
      case "Fertility":
        return compareCategories.filter(cat => 
          ['fertility', 'hormones'].includes(cat.id)
        );
      case "Cancer Screening":
        return compareCategories.filter(cat => 
          ['cancer-screening', 'general-health'].includes(cat.id)
        );
      case "General Wellness":
        return compareCategories.filter(cat => 
          ['vitamins', 'general-health', 'heart-health', 'liver-health', 'hormones', 'thyroid'].includes(cat.id)
        );
      default:
        // Show all categories for Most Popular Tests
        return compareCategories.slice(0, 8); // Limit to prevent overflow
    }
  };

  return (
    <nav className={`relative ${className}`} aria-label="Main Navigation">
      {primaryNavigationItems.map((item) => (
        <div 
          key={item.path}
          className="relative nav-item-wrapper"
          onMouseEnter={() => handleMouseEnter(item.name)}
          onMouseLeave={handleMouseLeave}
        >
          <Link
            to={item.path}
            className={`text-sm font-medium transition-colors px-3 py-2 whitespace-nowrap hover:text-[#E70D69] inline-flex items-center gap-1 ${
                  (item as any).highlighted 
                    ? "text-[#E70D69]"
                : "text-gray-900"
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
            <div 
              className="dropdown-content absolute top-full left-0 mt-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] min-w-[500px] max-w-[600px] max-h-[70vh] overflow-y-auto"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
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
                          <div className="flex items-center">
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
      
      {/* MORE Dropdown */}
      <div 
        className="relative nav-item-wrapper"
        onMouseEnter={() => setActiveDropdown("MORE")}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className="text-sm font-medium transition-colors px-3 py-2 whitespace-nowrap hover:text-[#E70D69] inline-flex items-center gap-1 text-gray-900"
        >
          More
          <ChevronDown className="w-3 h-3" />
        </button>
        
        {activeDropdown === "MORE" && (
          <div 
            className="dropdown-content absolute top-full right-0 mt-0 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-[9999] min-w-[280px] max-h-[70vh] overflow-y-auto"
            onMouseEnter={() => setActiveDropdown("MORE")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="p-4">
              <div className="grid grid-cols-1 gap-1">
                {moreNavigationItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    onClick={onItemClick}
                  >
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-primary transition-colors">
                      {item.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
