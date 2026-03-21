import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { compareCategories } from "@/constants/categories";
import { cn } from "@/lib/utils";

// Mobile navigation structure with categories and test counts
const mobileNavigationItems = [
  {
    name: "Women's Health",
    path: "/womens-health",
    icon: "🩺",
    categories: ["fertility", "hormones"],
    testCount: 12
  },
  {
    name: "Men's Health", 
    path: "/mens-health",
    icon: "👨",
    categories: ["hormones", "heart-health", "general-health"],
    testCount: 8
  },
  {
    name: "Heart Health",
    path: "/heart-health",
    icon: "🫀", 
    categories: ["heart-health"],
    testCount: 6
  },
  {
    name: "Fertility & Hormones",
    path: "/hormones",
    icon: "🧬",
    categories: ["fertility", "hormones", "thyroid"],
    testCount: 15
  },
  {
    name: "Sports/Fitness Health",
    path: "/sports-performance", 
    icon: "🏃",
    categories: ["vitamins", "blood-tests"],
    testCount: 9
  },
  {
    name: "At Home Tests",
    path: "/at-home-tests",
    icon: "🏠",
    categories: ["general-health", "blood-tests"],
    testCount: 18
  },
  {
    name: "Vitamins & Deficiencies",
    path: "/vitamins-deficiency",
    icon: "💊",
    categories: ["vitamins"],
    testCount: 11
  },
  {
    name: "Sexual Health",
    path: "/conditions",
    icon: "🦠",
    categories: ["general-health", "blood-tests"],
    testCount: 7
  }
];

// Static navigation items
const staticNavigationItems = [
  { name: "Find a Clinic", path: "/find-clinic", icon: "📍" },
  { name: "How It Works", path: "/how-it-works", icon: "❓" },
  { name: "Contact Us", path: "/contact", icon: "📞" }
];

interface MobileDropdownMenuProps {
  isOpen: boolean;
  onItemClick?: () => void;
  className?: string;
}

export const MobileDropdownMenu = ({ 
  isOpen, 
  onItemClick, 
  className = "" 
}: MobileDropdownMenuProps) => {
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
    // Mock popular tests - in real app this would come from your data
    const mockTests = [
      { name: "Complete Health Check", price: "89" },
      { name: "Hormone Balance", price: "129" },
      { name: "Vitamin D Test", price: "29" },
      { name: "Thyroid Function", price: "79" },
      { name: "Fertility Check", price: "159" }
    ];
    return mockTests.slice(0, 3); // Limit to 3 popular tests
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[59] animate-in fade-in duration-200"
        onClick={onItemClick}
      />
      
      {/* Menu */}
      <div 
        className={cn(
          "fixed inset-x-0 top-[56px] bg-white dark:bg-gray-900 border-t shadow-2xl z-[60] animate-in slide-in-from-top-2 duration-200",
          className
        )}
        style={{ maxHeight: "calc(100vh - 56px)" }}
      >
        <div className="overflow-y-auto scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          <div className="py-2 px-3 space-y-0.5">
          {/* Main Health Categories */}
          {mobileNavigationItems.map((item) => {
            const isExpanded = expandedCategories.has(item.name);
            const popularTests = getTestsForCategories(item.categories);

            return (
              <div key={item.name} className="border-b border-border/30 last:border-b-0">
                <div className="flex items-center justify-between py-3.5">
                  <Link
                    to={item.path}
                    className="flex items-center gap-3 flex-1 min-w-0"
                    onClick={onItemClick}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground block">
                        {item.name}
                      </span>
                    </div>
                  </Link>
                  
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="secondary" className="text-sm">
                      {item.testCount} tests
                    </Badge>
                    <button
                      onClick={() => toggleCategory(item.name)}
                      className="p-2 -mr-2 min-h-[44px] min-w-[44px] flex items-center justify-center touch-manipulation"
                      aria-label={isExpanded ? "Collapse category" : "Expand category"}
                    >
                      <ChevronRight 
                        className={cn(
                          "h-5 w-5 transition-transform duration-200 text-muted-foreground",
                          isExpanded && "rotate-90"
                        )}
                      />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="pb-3 pl-8 space-y-2 animate-in slide-in-from-top-1 duration-200">
                    <div className="text-base text-muted-foreground mb-2">Popular tests:</div>
                    {popularTests.map((test, index) => (
                      <Link
                        key={index}
                        to={`${item.path}?test=${test.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-accent/50 transition-colors group"
                        onClick={onItemClick}
                      >
                        <span className="text-lg text-foreground group-hover:text-primary">
                          {test.name}
                        </span>
                      </Link>
                    ))}
                    <Link
                      to={item.path}
                      className="inline-flex items-center gap-1 text-lg text-primary hover:text-primary/80 font-medium transition-colors py-1"
                      onClick={onItemClick}
                    >
                      View all {item.name.toLowerCase()}
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                )}
              </div>
            );
          })}

          {/* Static Navigation Items */}
          <div className="pt-2 mt-2 border-t border-border/50">
            {staticNavigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="flex items-center gap-3 py-3 px-2 rounded-md hover:bg-accent/50 transition-colors"
                onClick={onItemClick}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium text-foreground">{item.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};