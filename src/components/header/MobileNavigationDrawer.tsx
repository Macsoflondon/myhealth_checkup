import { useState, useMemo, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Search, X, MapPin, Phone, ArrowRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { primaryNavigationItems, moreNavigationSections } from "@/components/header/NavigationItems";
import { useNavigationData } from "@/hooks/useNavigationData";
import { compareCategories } from "@/data/compare/categories";
import { cn } from "@/lib/utils";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileNavigationDrawer = ({ isOpen, onClose }: MobileNavigationDrawerProps) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const { getFilteredCategories } = useNavigationData();
  
  // Swipe gesture state
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const isDragging = useRef<boolean>(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isDragging.current = true;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    touchEndX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging.current) return;
    
    const swipeDistanceX = touchStartX.current - touchEndX.current;
    const swipeDistanceY = Math.abs(touchStartY.current - (touchEndX.current ? touchEndX.current : touchStartY.current));
    const minSwipeDistance = 80; // Minimum swipe distance to trigger close
    
    // Only close if horizontal swipe is dominant and distance is sufficient
    if (swipeDistanceX > minSwipeDistance && swipeDistanceX > swipeDistanceY) {
      onClose();
    }
    
    isDragging.current = false;
    touchEndX.current = 0;
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
          description: category.description
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
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent 
        side="left" 
        className="w-[85vw] max-w-[400px] p-0 bg-white border-r border-gray-200"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={contentRef}
      >
        <SheetHeader className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-[hsl(var(--secondary))]/5 to-[hsl(var(--primary))]/5">
          <SheetTitle className="text-[hsl(var(--navy))] text-left font-heading font-bold text-lg">
            Menu
          </SheetTitle>
          
          {/* Search Input with larger touch target */}
          <div className="relative mt-3">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tests or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 text-base rounded-xl border-gray-200 focus:border-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]/20"
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

        <ScrollArea className="h-[calc(100vh-160px)]">
          <div className="px-3 py-4 space-y-1">
            {/* Search Results */}
            {filteredContent && filteredContent.length > 0 && (
              <div className="space-y-1">
                <p className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {filteredContent.length} {filteredContent.length === 1 ? 'Result' : 'Results'}
                </p>
                {filteredContent.map((result, index) => (
                  <Link
                    key={`${result.path}-${index}`}
                    to={result.path}
                    onClick={handleLinkClick}
                    className="flex items-start gap-3 px-4 py-3.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-colors touch-manipulation group"
                  >
                    <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] mt-2 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-[hsl(var(--primary))] group-active:text-[hsl(var(--primary))]">
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
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[hsl(var(--primary))] mt-1" />
                  </Link>
                ))}
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

            {/* Normal Navigation (when not searching) */}
            {!filteredContent && (
              <>
                {/* Primary Navigation Items */}
                {primaryNavigationItems.map((item, index) => (
                  <div 
                    key={item.path}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    {item.hasDropdown ? (
                      <div>
                        <button
                          onClick={() => toggleSection(item.name)}
                          className={cn(
                            "w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200 touch-manipulation active:scale-[0.98] min-h-[52px]",
                            expandedSections.has(item.name)
                              ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                              : "hover:bg-gray-50 active:bg-gray-100 text-gray-900"
                          )}
                        >
                          <span className="font-semibold text-base">{item.name}</span>
                          <ChevronDown
                            className={cn(
                              "h-5 w-5 transition-transform duration-300 ease-out",
                              expandedSections.has(item.name) && "rotate-180"
                            )}
                          />
                        </button>

                        {/* Expanded Category Items with smooth animation */}
                        <div 
                          className={cn(
                            "overflow-hidden transition-all duration-300 ease-out",
                            expandedSections.has(item.name) 
                              ? "max-h-[500px] opacity-100" 
                              : "max-h-0 opacity-0"
                          )}
                        >
                          <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-[hsl(var(--primary))]/20 pl-3">
                            {getFilteredCategories(item.name).slice(0, 6).map((category, catIndex) => (
                              <Link
                                key={category.id}
                                to={`/compare?category=${category.id}`}
                                onClick={handleLinkClick}
                                className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 touch-manipulation group min-h-[48px]"
                                style={{ animationDelay: `${catIndex * 50}ms` }}
                              >
                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] mt-1.5 flex-shrink-0 group-active:scale-125 transition-transform" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-800 group-hover:text-[hsl(var(--primary))] group-active:text-[hsl(var(--primary))] transition-colors">
                                    {category.name}
                                  </p>
                                  {category.description && (
                                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                      {category.description}
                                    </p>
                                  )}
                                </div>
                              </Link>
                            ))}
                            <Link
                              to={item.path}
                              onClick={handleLinkClick}
                              className="flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5 active:bg-[hsl(var(--primary))]/10 rounded-xl mt-1 transition-all touch-manipulation min-h-[44px]"
                            >
                              View All
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={handleLinkClick}
                        className={cn(
                          "flex items-center px-4 py-3.5 rounded-xl font-semibold text-base transition-all duration-150 touch-manipulation active:scale-[0.98] min-h-[52px]",
                          (item as any).highlighted
                            ? "text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 active:bg-[hsl(var(--primary))]/15"
                            : "text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}

                <Separator className="my-4" />

                {/* More Navigation Sections */}
                {moreNavigationSections.map((section, sectionIndex) => (
                  <div 
                    key={section.title}
                    className="animate-fade-in"
                    style={{ animationDelay: `${(primaryNavigationItems.length + sectionIndex) * 30}ms` }}
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
                          ? "max-h-[400px] opacity-100" 
                          : "max-h-0 opacity-0"
                      )}
                    >
                      <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-[hsl(var(--secondary))]/20 pl-3">
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

                <Separator className="my-4" />

                {/* Quick Action Buttons */}
                <div className="space-y-2 px-1">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full justify-start h-14 text-base font-medium rounded-xl border-2 border-gray-200 hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/5 active:scale-[0.98] transition-all touch-manipulation"
                  >
                    <Link to="/find-clinic" onClick={handleLinkClick}>
                      <MapPin className="w-5 h-5 mr-3 text-[hsl(var(--primary))]" />
                      Find a Clinic
                    </Link>
                  </Button>
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
                      <ArrowRight className="w-5 h-5 ml-2" />
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
