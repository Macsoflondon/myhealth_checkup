import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search, X } from "lucide-react";
import { getCategoryPinColor } from "@/data/categoryColors";
import { GoodbodyTest } from "@/data/goodbodyTests";

interface MegaMenuDropdownProps {
  itemName: string;
  itemPath: string;
  goodbodyTests?: GoodbodyTest[];
  categories?: Array<{ id: string; name: string; description: string }>;
  onItemClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: (event?: React.MouseEvent) => void;
  isMobile?: boolean;
}

export const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  itemName,
  itemPath,
  goodbodyTests,
  categories,
  onItemClick,
  onMouseEnter,
  onMouseLeave,
  isMobile = false
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter tests based on search query
  const filteredTests = useMemo(() => {
    if (!goodbodyTests || !searchQuery.trim()) return goodbodyTests;
    const query = searchQuery.toLowerCase();
    return goodbodyTests.filter(test => 
      test.name.toLowerCase().includes(query) ||
      test.description?.toLowerCase().includes(query)
    );
  }, [goodbodyTests, searchQuery]);

  // Filter categories based on search query
  const filteredCategories = useMemo(() => {
    if (!categories || !searchQuery.trim()) return categories;
    const query = searchQuery.toLowerCase();
    return categories.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      cat.description?.toLowerCase().includes(query)
    );
  }, [categories, searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const hasResults = (filteredTests && filteredTests.length > 0) || 
                     (filteredCategories && filteredCategories.length > 0);

  return (
    <div 
      className={`dropdown-content absolute top-full left-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl min-w-[320px] max-w-[90vw] overflow-y-auto ${
        isMobile ? 'sm:max-w-[400px] max-h-[60vh]' : 'sm:min-w-[540px] sm:max-w-[640px] max-h-[75vh]'
      }`}
      style={{ 
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        position: 'absolute',
        WebkitOverflowScrolling: 'touch'
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5 sm:p-6">
        {/* Search Input */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${itemName.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-pink/50 focus:border-brand-pink transition-colors"
            onClick={(e) => e.stopPropagation()}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {filteredTests ? (
          // Show Goodbody tests for health-specific sections
          <div className="grid grid-cols-1 gap-2">
            <div className="mb-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                {searchQuery ? `Results for "${searchQuery}"` : 'Popular Tests'}
              </h3>
            </div>
            {filteredTests.length > 0 ? (
              filteredTests.map((test) => (
                <Link
                  key={test.id}
                  to={test.url || `/book/${test.id}`}
                  className="state-layer group block p-3 rounded-lg transition-shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  onClick={onItemClick}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-500 transition-colors mb-1">
                        {test.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                        {test.description}
                      </p>
                      {test.biomarkers && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                          <span className="inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-teal-500"></span>
                            {test.biomarkers} biomarkers
                          </span>
                          <span>•</span>
                          <span>{test.turnaround}</span>
                        </div>
                      )}
                    </div>
                    {test.price && (
                      <div className="ml-3 flex-shrink-0">
                        <span className="text-sm font-bold text-pink-600 dark:text-pink-500">
                          £{test.price}
                        </span>
                      </div>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                No tests found for "{searchQuery}"
              </p>
            )}
          </div>
        ) : filteredCategories ? (
          // Show categories in browse style
          <div>
            <div className="mb-5">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {searchQuery ? `Results for "${searchQuery}"` : 'Browse by Category'}
              </h3>
            </div>
            {filteredCategories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredCategories.map((category) => {
                  const dotColor = getCategoryPinColor(category.id);
                  return (
                    <Link
                      key={category.id}
                      to={`/compare?category=${category.id}`}
                      className="state-layer group flex items-start gap-3 p-3 rounded-lg transition-shadow"
                      onClick={onItemClick}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                        style={{ backgroundColor: dotColor }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-foreground mb-1">
                          {category.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-tight">
                          {category.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 py-4 text-center">
                No categories found for "{searchQuery}"
              </p>
            )}
          </div>
        ) : null}
        
        {/* View All Link */}
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to={itemPath}
            className="inline-flex items-center text-sm text-pink-600 hover:text-pink-700 dark:text-pink-500 dark:hover:text-pink-400 font-semibold transition-colors group"
            onClick={onItemClick}
          >
            View all {itemName.toLowerCase()}
            <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
