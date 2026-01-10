import React from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useDropdownAccessibility } from "@/hooks/useDropdownAccessibility";

interface MoreDropdownSection {
  title: string;
  items: Array<{ name: string; path: string }>;
}

interface MoreDropdownMenuProps {
  sections: MoreDropdownSection[];
  onItemClick?: () => void;
  onClose?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: (event?: React.MouseEvent) => void;
  isMobile?: boolean;
}

export const MoreDropdownMenu: React.FC<MoreDropdownMenuProps> = ({
  sections,
  onItemClick,
  onClose,
  onMouseEnter,
  onMouseLeave,
  isMobile = false
}) => {
  // Accessibility hook for focus trapping and arrow key navigation
  const { containerRef } = useDropdownAccessibility({
    isOpen: true,
    onClose: onClose || (() => {}),
  });

  return (
    <div 
      ref={containerRef}
      role="menu"
      aria-label="More options dropdown menu"
      className={`dropdown-content absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl min-w-[320px] overflow-y-auto ${
        isMobile ? 'max-h-[60vh]' : 'max-h-[75vh]'
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
      <div className="p-5">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">More</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Close dropdown"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {sections.map((section, sectionIndex) => (
          <div key={section.title}>
            {/* Section Heading */}
            <div className="mb-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {section.title}
              </h3>
            </div>
            
            {/* Section Items */}
            <div className="grid grid-cols-1 gap-1.5 mb-4">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="state-layer block p-2.5 rounded-lg transition-shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-pink-600 dark:hover:text-pink-500 transition-colors">
                    {item.name}
                  </span>
                </Link>
              ))}
            </div>
            
            {/* Divider between sections (except last) */}
            {sectionIndex < sections.length - 1 && (
              <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
