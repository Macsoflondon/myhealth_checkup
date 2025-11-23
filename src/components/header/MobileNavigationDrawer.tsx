import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

  const toggleSection = (sectionName: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionName)) {
      newExpanded.delete(sectionName);
    } else {
      newExpanded.add(sectionName);
    }
    setExpandedSections(newExpanded);
  };

  const handleLinkClick = () => {
    setSearchQuery("");
    onClose();
  };

  // Search filtering logic
  const filteredContent = useMemo(() => {
    if (!searchQuery.trim()) {
      return null; // Show normal navigation
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
      <SheetContent side="left" className="w-[85vw] sm:w-[400px] p-0 bg-white">
        <SheetHeader className="px-6 py-4 border-b space-y-3">
          <SheetTitle className="text-[#081129] text-left">Menu</SheetTitle>
          
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tests or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-9 text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
          <div className="px-4 py-4 space-y-1">
            {/* Search Results */}
            {filteredContent && filteredContent.length > 0 && (
              <div className="space-y-1">
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  {filteredContent.length} {filteredContent.length === 1 ? 'Result' : 'Results'}
                </p>
                {filteredContent.map((result, index) => (
                  <Link
                    key={`${result.path}-${index}`}
                    to={result.path}
                    onClick={handleLinkClick}
                    className="flex items-start gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#e70d69] mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 group-hover:text-[#e70d69]">
                        {result.name}
                      </p>
                      {result.description && (
                        <p className="text-xs text-gray-500 line-clamp-2 mt-0.5">
                          {result.description}
                        </p>
                      )}
                      {result.parentSection && (
                        <p className="text-xs text-[#22c0d4] mt-1">
                          in {result.parentSection}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* No Results */}
            {filteredContent && filteredContent.length === 0 && (
              <div className="px-4 py-8 text-center">
                <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900 mb-1">No results found</p>
                <p className="text-xs text-gray-500">
                  Try searching for different tests or categories
                </p>
              </div>
            )}

            {/* Normal Navigation (when not searching) */}
            {!filteredContent && (
              <>
                {/* Primary Navigation Items */}
                {primaryNavigationItems.map((item) => (
              <div key={item.path}>
                {item.hasDropdown ? (
                  <div>
                    <button
                      onClick={() => toggleSection(item.name)}
                      className={cn(
                        "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                        expandedSections.has(item.name)
                          ? "bg-[#e70d69]/10 text-[#e70d69]"
                          : "hover:bg-gray-100 text-gray-900"
                      )}
                    >
                      <span className="font-semibold text-sm">{item.name}</span>
                      <ChevronDown
                        className={cn(
                          "h-4 w-4 transition-transform",
                          expandedSections.has(item.name) && "rotate-180"
                        )}
                      />
                    </button>

                    {/* Expanded Category Items */}
                    {expandedSections.has(item.name) && (
                      <div className="ml-2 mt-1 space-y-0.5">
                        {getFilteredCategories(item.name).slice(0, 6).map((category) => (
                          <Link
                            key={category.id}
                            to={`/compare?category=${category.id}`}
                            onClick={handleLinkClick}
                            className="flex items-start gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <div className="w-2 h-2 rounded-full bg-[#e70d69] mt-1.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 group-hover:text-[#e70d69]">
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
                          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#e70d69] hover:bg-[#e70d69]/5 rounded-lg mt-1"
                        >
                          View All
                          <ChevronRight className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to={item.path}
                    onClick={handleLinkClick}
                    className={cn(
                      "flex items-center px-4 py-3 rounded-lg font-semibold text-sm transition-colors",
                      (item as any).highlighted
                        ? "text-[#e70d69] hover:bg-[#e70d69]/10"
                        : "text-gray-900 hover:bg-gray-100"
                    )}
                  >
                    {item.name}
                  </Link>
                )}
                </div>
              ))}

              <Separator className="my-4" />

              {/* More Navigation Sections */}
              {moreNavigationSections.map((section) => (
              <div key={section.title}>
                <button
                  onClick={() => toggleSection(section.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors",
                    expandedSections.has(section.title)
                      ? "bg-[#22c0d4]/10 text-[#22c0d4]"
                      : "hover:bg-gray-100 text-gray-900"
                  )}
                >
                  <span className="font-semibold text-sm">{section.title}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      expandedSections.has(section.title) && "rotate-180"
                    )}
                  />
                </button>

                {expandedSections.has(section.title) && (
                  <div className="ml-2 mt-1 space-y-0.5">
                    {section.items.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={handleLinkClick}
                        className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:text-[#22c0d4] hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
                </div>
              ))}

              <Separator className="my-4" />

              {/* Quick Links */}
              <div className="space-y-1">
                <Link
                  to="/find-clinic"
                  onClick={handleLinkClick}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  📍 Find a Clinic
                </Link>
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className="flex items-center px-4 py-3 text-sm font-medium text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  📞 Contact Us
                </Link>
              </div>
            </>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
