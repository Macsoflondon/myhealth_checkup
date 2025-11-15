import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { getCategoryColor } from "@/constants/categories";
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
        {goodbodyTests ? (
          // Show Goodbody tests for health-specific sections
          <div className="grid grid-cols-1 gap-2">
            <div className="mb-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Popular Tests
              </h3>
            </div>
            {goodbodyTests.map((test) => (
              <Link
                key={test.id}
                to={test.url || `/book/${test.id}`}
                className="group block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200 dark:active:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
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
            ))}
          </div>
        ) : categories ? (
          // Show categories
          <div>
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Browse by Category
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/compare?category=${category.id}`}
                  className="group block p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200 dark:active:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                  onClick={onItemClick}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${getCategoryColor(category.id)}`}></div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-pink-600 dark:group-hover:text-pink-500 transition-colors mb-1">
                        {category.name}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
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
