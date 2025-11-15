import React from "react";
import { Link } from "react-router-dom";

interface MoreDropdownSection {
  title: string;
  items: Array<{ name: string; path: string }>;
}

interface MoreDropdownMenuProps {
  sections: MoreDropdownSection[];
  onItemClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: (event?: React.MouseEvent) => void;
  isMobile?: boolean;
}

export const MoreDropdownMenu: React.FC<MoreDropdownMenuProps> = ({
  sections,
  onItemClick,
  onMouseEnter,
  onMouseLeave,
  isMobile = false
}) => {
  return (
    <div 
      className={`dropdown-content absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl min-w-[280px] overflow-y-auto ${
        isMobile ? 'max-h-[60vh]' : 'max-h-[70vh]'
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
      <div className="p-4">
        {sections.map((section, sectionIndex) => (
          <div key={section.title}>
            {/* Section Heading */}
            <div className="px-2 py-2">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            
            {/* Section Items */}
            <div className="grid grid-cols-1 gap-1 mb-3">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors active:bg-gray-200 dark:active:bg-gray-700"
                  onClick={onItemClick}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-pink-600 transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* Divider between sections (except last) */}
            {sectionIndex < sections.length - 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700 mb-3" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
