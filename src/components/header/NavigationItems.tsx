
import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CategoryItem {
  id: string;
  name: string;
  color: string;
  path?: string;
}

const categoryItems: CategoryItem[] = [
  { id: 'annual-health', name: 'Annual health report', color: 'bg-red-500', path: '/annual-health' },
  { id: 'biomarkers', name: 'Biomarkers', color: 'bg-teal-500', path: '/biomarkers' },
  { id: 'blood-testing', name: 'Blood testing', color: 'bg-pink-500', path: '/blood-testing' },
  { id: 'fertility', name: 'Fertility', color: 'bg-orange-500', path: '/fertility-tests' },
  { id: 'general-health', name: 'General health', color: 'bg-red-600', path: '/general-health' },
  { id: 'hormone-health', name: 'Hormone health', color: 'bg-red-500', path: '/hormone-health' },
  { id: 'longevity', name: 'Longevity', color: 'bg-emerald-500', path: '/longevity' },
  { id: 'menopause', name: 'Menopause', color: 'bg-purple-500', path: '/menopause' },
  { id: 'mens-health', name: "Men's health", color: 'bg-sky-400', path: '/mens-health' },
  { id: 'mental-health', name: 'Mental health', color: 'bg-red-500', path: '/mental-health' },
  { id: 'nutrition', name: 'Nutrition', color: 'bg-lime-500', path: '/nutrition' },
  { id: 'pcos', name: 'PCOS', color: 'bg-purple-500', path: '/pcos' },
  { id: 'skin-health', name: 'Skin health', color: 'bg-orange-300', path: '/skin-health' },
  { id: 'sports-performance', name: 'Sports performance', color: 'bg-blue-500', path: '/sports-performance' },
  { id: 'testosterone', name: 'Testosterone', color: 'bg-sky-400', path: '/testosterone' },
  { id: 'thyroid', name: 'Thyroid', color: 'bg-emerald-500', path: '/thyroid' },
  { id: 'vitamin-d', name: 'Vitamin D', color: 'bg-lime-400', path: '/vitamin-d' },
  { id: 'vitamin-index', name: 'Vitamin index', color: 'bg-lime-400', path: '/vitamin-index' },
  { id: 'womens-health', name: "Women's health", color: 'bg-pink-500', path: '/womens-health' }
];

// Navigation items with dropdown configuration
export const navigationItems = [
  { name: "FIND YOUR TEST", path: "/assisted-test-finder", highlighted: true, hasDropdown: true },
  { name: "MOST POPULAR TESTS", path: "/most-popular-tests", highlighted: true, hasDropdown: true },
  { name: "WOMEN'S HEALTH", path: "/womens-health", hasDropdown: true },
  { name: "MEN'S HEALTH", path: "/mens-health", hasDropdown: true },
  { name: "GENERAL WELLNESS", path: "/wellness", hasDropdown: true },
  { name: "THYROID HEALTH", path: "/thyroid", hasDropdown: true },
  { name: "SPORTS PERFORMANCE", path: "/sports-performance", hasDropdown: true },
  { name: "PRENATAL BLOOD", path: "/fertility-tests", hasDropdown: true },
  { name: "HEALTH HUB", path: "/health-blog" },
  { name: "AT-HOME TESTS", path: "/at-home-tests" }
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

  const getFilteredCategories = (itemName: string) => {
    // Filter categories based on navigation item
    switch (itemName) {
      case "WOMEN'S HEALTH":
        return categoryItems.filter(cat => 
          cat.id.includes('womens') || cat.id.includes('fertility') || cat.id.includes('menopause') || cat.id.includes('pcos')
        );
      case "MEN'S HEALTH":
        return categoryItems.filter(cat => 
          cat.id.includes('mens') || cat.id.includes('testosterone') || cat.id.includes('sports')
        );
      case "THYROID HEALTH":
        return categoryItems.filter(cat => cat.id.includes('thyroid') || cat.id.includes('hormone'));
      case "SPORTS PERFORMANCE":
        return categoryItems.filter(cat => 
          cat.id.includes('sports') || cat.id.includes('testosterone') || cat.id.includes('nutrition')
        );
      default:
        // Show all categories for FIND YOUR TEST and MOST POPULAR TESTS
        return categoryItems;
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
          
          {/* Dropdown Content */}
          {item.hasDropdown && activeDropdown === item.name && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 min-w-[400px]">
              <div className="grid grid-cols-2 gap-2">
                {getFilteredCategories(item.name).map((category) => (
                  <Link
                    key={category.id}
                    to={category.path || '/'}
                    className="block"
                    onClick={onItemClick}
                  >
                    <Badge
                      variant="secondary"
                      className={`${category.color} text-white hover:opacity-80 transition-opacity cursor-pointer px-3 py-1 text-xs font-medium w-full justify-start`}
                    >
                      <span className={`w-2 h-2 rounded-full ${category.color} mr-2 inline-block`}></span>
                      {category.name}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
};
