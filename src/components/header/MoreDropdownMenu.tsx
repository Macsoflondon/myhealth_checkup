import React from "react";
import { useNavigate } from "@/lib/router-compat";
import { X, LayoutDashboard, LogOut, User } from "lucide-react";
import { useDropdownAccessibility } from "@/hooks/useDropdownAccessibility";

interface MoreDropdownSection {
  title: string;
  items: Array<{ name: string; path: string }>;
}

interface AccountItem {
  name: string;
  path: string;
  onClick?: () => void;
}

interface MoreDropdownMenuProps {
  sections: MoreDropdownSection[];
  onItemClick?: () => void;
  onClose?: () => void;
  isMobile?: boolean;
  accountItems?: AccountItem[];
  languageList?: React.ReactNode;
}

export const MoreDropdownMenu: React.FC<MoreDropdownMenuProps> = ({
  sections,
  onItemClick,
  onClose,
  isMobile = false,
  accountItems,
  languageList,
}) => {
  const navigate = useNavigate();
  
  // Accessibility hook for focus trapping and arrow key navigation
  const { containerRef } = useDropdownAccessibility({
    isOpen: true,
    onClose: onClose || (() => {}),
  });

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Close dropdown first
    onClose?.();
    onItemClick?.();
    
    // Navigate after a short delay to ensure the dropdown has closed
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 10);
  };

  return (
    <div 
      ref={containerRef}
      role="menu"
      aria-label="More options dropdown menu"
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      className={`dropdown-content absolute top-full right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-2xl min-w-[320px] overflow-y-auto ${
        isMobile ? 'max-h-[60vh]' : 'max-h-[75vh]'
      }`}
      style={{ 
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
        position: 'absolute',
        WebkitOverflowScrolling: 'touch'
      }}
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

        {accountItems && accountItems.length > 0 && (
          <>
            <div className="mb-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Account
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-1.5 mb-4">
              {accountItems.map((item) => (
                <a
                  key={item.name}
                  href={item.path}
                  className="state-layer flex items-center gap-2 p-2.5 rounded-lg transition-shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      e.stopPropagation();
                      item.onClick();
                    } else {
                      handleLinkClick(e, item.path);
                    }
                  }}
                >
                  {item.name === "Sign in" && <User className="w-4 h-4 text-[#081129]/60" />}
                  {item.name === "Dashboard" && <LayoutDashboard className="w-4 h-4 text-[#081129]/60" />}
                  {item.name === "Sign Out" && <LogOut className="w-4 h-4 text-[#081129]/60" />}
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-brand-pink dark:hover:text-brand-pink transition-colors">
                    {item.name}
                  </span>
                </a>
              ))}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />
          </>
        )}

        {languageList && (
          <>
            <div className="mb-3">
              <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Language
              </h3>
            </div>
            <div className="mb-4">
              {languageList}
            </div>
            {sections.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 mb-4" />
            )}
          </>
        )}

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
                <a
                  key={item.path}
                  href={item.path}
                  className="state-layer block p-2.5 rounded-lg transition-shadow border border-transparent hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer"
                  onClick={(e) => handleLinkClick(e, item.path)}
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-brand-pink dark:hover:text-brand-pink transition-colors">
                    {item.name}
                  </span>
                </a>
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
