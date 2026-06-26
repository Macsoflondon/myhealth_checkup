import { useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { 
  ChevronDown, 
  ChevronRight, 
  Search, 
  X, 
  MapPin, 
  Phone, 
  ArrowRight,
  Heart,
  Droplets,
  Activity,
  Sparkles,
  Baby,
  Shield,
  Apple,
  Dumbbell,
  Scale,
  Clock,
  TestTube,
  Stethoscope,
  Users
} from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { primaryNavigationItems, moreNavigationSections } from "@/components/header/NavigationItems";
import { useNavigationData } from "@/hooks/useNavigationData";
import { compareCategories } from "@/constants/categories";
import { cn } from "@/lib/utils";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

// Category icon mapping for visual hierarchy
const getCategoryIcon = (categoryId: string) => {
  const iconMap: Record<string, React.ElementType> = {
    'blood-tests': Droplets,
    'hormones': Activity,
    'thyroid': Activity,
    'vitamins': Sparkles,
    'liver': Shield,
    'diabetes': TestTube,
    'cancer-screening': Shield,
    'heart-health': Heart,
    'mens-health': Users,
    'womens-health': Users,
    'fertility': Baby,
    'general-health': Stethoscope,
    'allergy-testing': Apple,
    'sports-performance-tests': Dumbbell,
    'weight-loss-tests': Scale,
    'longevity-tests': Clock,
  };
  return iconMap[categoryId] || TestTube;
};

// Category colour mapping for visual distinction
const getCategoryColour = (categoryId: string) => {
  const colourMap: Record<string, string> = {
    'blood-tests': 'bg-red-500',
    'hormones': 'bg-purple-500',
    'thyroid': 'bg-emerald-500',
    'vitamins': 'bg-amber-500',
    'liver': 'bg-yellow-600',
    'diabetes': 'bg-orange-500',
    'cancer-screening': 'bg-slate-700',
    'heart-health': 'bg-rose-500',
    'mens-health': 'bg-blue-500',
    'womens-health': 'bg-pink-500',
    'fertility': 'bg-violet-500',
    'general-health': 'bg-teal-500',
    'allergy-testing': 'bg-indigo-500',
    'sports-performance-tests': 'bg-sky-500',
    'weight-loss-tests': 'bg-lime-500',
    'longevity-tests': 'bg-cyan-500',
  };
  return colourMap[categoryId] || 'bg-gray-500';
};

// Canonical test-category entries shown in the Categories tab.
// Mirrors the primary nav so the two surfaces never drift.
const testCategoryCards: Array<{
  name: string;
  path: string;
  icon: React.ElementType;
  bg: string;
}> = [
  { name: "Most Popular Tests", path: "/popular-tests", icon: Sparkles, bg: "bg-amber-500" },
  { name: "General Wellness", path: "/wellness", icon: Stethoscope, bg: "bg-teal-500" },
  { name: "Women's Health", path: "/womens-health", icon: Users, bg: "bg-pink-500" },
  { name: "Men's Health", path: "/mens-health", icon: Users, bg: "bg-blue-500" },
  { name: "Sports-Fitness Health", path: "/sports-performance", icon: Dumbbell, bg: "bg-sky-500" },
  { name: "Fertility - Prenatal", path: "/fertility-tests", icon: Baby, bg: "bg-violet-500" },
  { name: "Cancer Screening", path: "/tests/cancer", icon: Shield, bg: "bg-slate-700" },
  { name: "At Home", path: "/at-home-tests", icon: TestTube, bg: "bg-emerald-500" },
];


export const MobileNavigationDrawer = ({ isOpen, onClose }: MobileNavigationDrawerProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'menu' | 'categories'>('menu');
  const { getFilteredCategories } = useNavigationData();
  
  // Swipe gesture state
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    isDragging.current = false;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;

    const deltaX = Math.abs(touchEndX.current - touchStartX.current);
    const deltaY = Math.abs(touchEndY.current - touchStartY.current);

    if (deltaX > 6 || deltaY > 6) {
      isDragging.current = true;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    const swipeDistanceX = touchStartX.current - touchEndX.current;
    const swipeDistanceY = Math.abs(touchStartY.current - touchEndY.current);
    const minSwipeDistance = 80;

    if (
      isDragging.current &&
      swipeDistanceX > minSwipeDistance &&
      swipeDistanceX > swipeDistanceY
    ) {
      onClose();
    }

    isDragging.current = false;
    touchEndX.current = 0;
    touchEndY.current = 0;
  }, [onClose]);

  const toggleSection = useCallback((sectionName: string) => {
    setExpandedSections(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(sectionName)) {
        newExpanded.delete(sectionName);
      } else {
        newExpanded.add(sectionName);
      }
      return newExpanded;
    });
  }, []);

  const handleLinkClick = useCallback(() => {
    setSearchQuery("");
    onClose();
  }, [onClose]);

  // Search filtering logic
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return null;
    }

    const query = searchQuery.toLowerCase();
    const results: Array<{
      type: 'category' | 'section';
      name: string;
      path: string;
      description?: string;
      parentSection?: string;
      categoryId?: string;
    }> = [];

    // Search through all categories
    compareCategories.forEach((category) => {
      const matchesName = category.name.toLowerCase().includes(query);
      const matchesDescription = category.description?.toLowerCase().includes(query);
      const matchesSearchTerms = category.searchTerms.some(term => 
        term.toLowerCase().includes(query)
      );

      if (matchesName || matchesDescription || matchesSearchTerms) {
        results.push({
          type: 'category',
          name: category.name,
          path: `/compare?category=${category.id}`,
          description: category.description,
          categoryId: category.id
        });
      }
    });

    // Search through primary navigation items
    primaryNavigationItems.forEach((item) => {
      if (item.name.toLowerCase().includes(query)) {
        results.push({
          type: 'section',
          name: item.name,
          path: item.path
        });
      }
    });

    // Search through more navigation sections
    moreNavigationSections.forEach((section) => {
      section.items.forEach((item) => {
        if (item.name.toLowerCase().includes(query) || section.title.toLowerCase().includes(query)) {
          results.push({
            type: 'section',
            name: item.name,
            path: item.path,
            parentSection: section.title
          });
        }
      });
    });

    return results;
  }, [searchQuery]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent 
        side="left" 
        className="w-[88vw] max-w-[420px] p-0 bg-white border-r border-gray-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={contentRef}
      >
        {/* Header with gradient */}
        <SheetHeader className="px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-[hsl(var(--secondary))]/10 via-white to-[hsl(var(--primary))]/10">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-[hsl(var(--navy))] text-left font-heading font-bold text-xl">
              myhealth checkup
            </SheetTitle>
          </div>
          
          {/* Tab Switcher */}
          <div className="flex gap-1 mt-3 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setActiveTab('menu')}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === 'menu' 
                  ? "bg-white text-[hsl(var(--navy))] shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Menu
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={cn(
                "flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all duration-200",
                activeTab === 'categories' 
                  ? "bg-white text-[hsl(var(--navy))] shadow-sm" 
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              Test Categories
            </button>
          </div>
          
          {/* Search Input */}
          <div className="relative mt-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tests or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]/20 bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors touch-manipulation active:scale-95"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="px-3 py-4 space-y-1">
            {/* Search Results */}
            {filteredContent && filteredContent.length > 0 && (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {filteredContent.length} {filteredContent.length === 1 ? 'Result' : 'Results'}
                </p>
                {filteredContent.map((result, index) => {
                  const IconComponent = result.categoryId ? getCategoryIcon(result.categoryId) : ChevronRight;
                  const bgColour = result.categoryId ? getCategoryColour(result.categoryId) : 'bg-gray-400';
                  
                  return (
                    <Link
                      key={`${result.path}-${index}`}
                      to={result.path}
                      onClick={handleLinkClick}
                      className="flex items-start gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation group"
                    >
                      <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", bgColour)}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-[hsl(var(--primary))]">
                          {result.name}
                        </p>
                        {result.description && (
                          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                            {result.description}
                          </p>
                        )}
                        {result.parentSection && (
                          <p className="text-xs text-[hsl(var(--secondary))] mt-1">
                            in {result.parentSection}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[hsl(var(--primary))] mt-2" />
                    </Link>
                  );
                })}
              </div>
            )}

            {/* No Results */}
            {filteredContent && filteredContent.length === 0 && (
              <div className="px-4 py-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="h-7 w-7 text-gray-400" />
                </div>
                <p className="text-base font-medium text-gray-900 mb-1">No results found</p>
                <p className="text-sm text-gray-500">
                  Try searching for different tests or categories
                </p>
              </div>
            )}

            {/* Tab Content — Menu = site sections only (no test categories) */}
            {!filteredContent && activeTab === 'menu' && (
              <>
                {moreNavigationSections.map((section, sectionIndex) => (
                  <div
                    key={section.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${sectionIndex * 30}ms` }}
                  >
                    <button
                      onClick={() => toggleSection(section.title)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98] min-h-[52px]",
                        expandedSections.has(section.title)
                          ? "bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))]"
                          : "hover:bg-gray-50 active:bg-gray-100 text-gray-900"
                      )}
                    >
                      <span className="font-semibold text-base">{section.title}</span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 transition-transform duration-300 ease-out",
                          expandedSections.has(section.title) && "rotate-180"
                        )}
                      />
                    </button>

                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-out",
                        expandedSections.has(section.title)
                          ? "max-h-[800px] opacity-100"
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-[hsl(var(--secondary))]/20 pl-3">
                        {section.items.map((item) => (
                          <Link
                            key={item.path}
                            to={item.path}
                            onClick={handleLinkClick}
                            className="flex items-center px-3 py-3 text-sm text-gray-700 hover:text-[hsl(var(--secondary))] active:text-[hsl(var(--secondary))] hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-all duration-150 touch-manipulation min-h-[48px]"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}

                {/* How It Works — standalone informational link */}
                <Link
                  to="/how-it-works"
                  onClick={handleLinkClick}
                  className="flex items-center px-4 py-3.5 rounded-xl font-semibold text-base text-gray-900 hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 touch-manipulation active:scale-[0.98] min-h-[52px] animate-fade-in"
                  style={{ animationDelay: `${moreNavigationSections.length * 30}ms` }}
                >
                  How It Works
                </Link>
              </>
            )}


            {/* Categories Tab — flat grid of canonical category pages */}
            {!filteredContent && activeTab === 'categories' && (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 px-1">
                  {testCategoryCards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                      <Link
                        key={card.path}
                        to={card.path}
                        onClick={handleLinkClick}
                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 active:bg-gray-200 transition-all duration-150 touch-manipulation active:scale-[0.97] group animate-fade-in"
                        style={{ animationDelay: `${i * 30}ms` }}
                      >
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", card.bg)}>
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-medium text-gray-700 text-center leading-tight group-hover:text-[hsl(var(--primary))]">
                          {card.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>

                {/* View All Tests Link */}
                <div className="pt-2 px-1">
                  <Link
                    to="/compare"
                    onClick={handleLinkClick}
                    className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-[hsl(var(--secondary))]/10 text-[hsl(var(--secondary))] font-semibold hover:bg-[hsl(var(--secondary))]/20 active:scale-[0.98] transition-all touch-manipulation"
                  >
                    View All Test Categories
                  </Link>
                </div>
              </div>
            )}


            {/* Quick Actions & CTA - Show for both tabs */}
            {!filteredContent && (
              <>
                <Separator className="my-4" />

                {/* Quick Action Buttons */}
                <div className="space-y-2 px-1">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start h-14 text-base font-medium rounded-xl border-2 border-gray-200 hover:border-[hsl(var(--secondary))] hover:bg-[hsl(var(--secondary))]/5 active:scale-[0.98] transition-all touch-manipulation"
                  >
                    <Link to="/contact" onClick={handleLinkClick}>
                      <Phone className="w-5 h-5 mr-3 text-[hsl(var(--secondary))]" />
                      Contact Us
                    </Link>
                  </Button>
                </div>

                {/* Primary CTA */}
                <div className="px-1 pt-4 pb-6">
                  <Button
                    asChild
                    className="w-full h-14 text-base font-semibold rounded-xl bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90 active:scale-[0.98] transition-all touch-manipulation shadow-lg shadow-[hsl(var(--primary))]/20"
                  >
                    <Link to="/compare" onClick={handleLinkClick}>
                      Find a Test
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
