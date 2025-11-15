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
}

export const MegaMenuDropdown: React.FC<MegaMenuDropdownProps> = ({
  itemName,
  itemPath,
  goodbodyTests,
  categories,
  onItemClick,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      className="dropdown-content absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-2xl z-[9999] min-w-[280px] sm:min-w-[500px] max-w-[90vw] sm:max-w-[600px] max-h-[70vh] overflow-y-auto"
      style={{ boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)' }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="p-4 sm:p-6">
        {goodbodyTests ? (
          // Show Goodbody tests for health-specific sections
          <div className="grid grid-cols-1 gap-2">
            {goodbodyTests.map((test) => (
              <Link
                key={test.id}
                to={test.url || `/book/${test.id}`}
                className="group block p-3 rounded-lg hover:bg-accent transition-colors"
                onClick={onItemClick}
              >
                <div className="flex items-center">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {test.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {test.description}
                    </p>
                    {test.biomarkers && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {test.biomarkers} biomarkers • {test.turnaround}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : categories ? (
          // Show categories
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/compare?category=${category.id}`}
                className="group block p-3 rounded-lg hover:bg-accent transition-colors"
                onClick={onItemClick}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${getCategoryColor(category.id)}`}></div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}
        
        {/* View All Link */}
        <div className="mt-4 pt-4 border-t border-border">
          <Link
            to={itemPath}
            className="inline-flex items-center text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            onClick={onItemClick}
          >
            View all {itemName.toLowerCase()}
            <ChevronDown className="w-4 h-4 ml-1 rotate-[-90deg]" />
          </Link>
        </div>
      </div>
    </div>
  );
};
