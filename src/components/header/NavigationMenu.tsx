import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useNavigationData } from "@/hooks/useNavigationData";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePopularTestsForNavigation } from "@/hooks/usePopularTestsFromDatabase";
import { MegaMenuDropdown } from "./MegaMenuDropdown";
import { MoreDropdownMenu } from "./MoreDropdownMenu";
import { 
  primaryNavigationItems, 
  moreNavigationSections 
} from "./NavigationItems";

interface NavigationMenuProps {
  onItemClick?: () => void;
  className?: string;
}

export const NavigationMenu: React.FC<NavigationMenuProps> = ({ 
  onItemClick, 
  className = "" 
}) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { getTestsForNavigation, getFilteredCategories, shouldShowGoodbodyTests } = useNavigationData();
  const { data: popularTestsFromDb } = usePopularTestsForNavigation();
  const isMobile = useIsMobile();
  const location = useLocation();

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [location.pathname]);

  // Close dropdown when clicking outside or pressing ESC (for both desktop and mobile)
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't close if clicking on a link inside the dropdown - let navigation happen first
      if (target.closest('a[href]')) {
        return;
      }
      
      if (!target.closest('.nav-item-wrapper') && !target.closest('.dropdown-content')) {
        setActiveDropdown(null);
      }
    };

    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [activeDropdown]);

  // Close dropdown explicitly (for close button)
  const handleCloseDropdown = () => {
    setActiveDropdown(null);
  };

  // Toggle dropdown on click (works for both mobile and desktop)
  const handleDropdownToggle = (e: React.MouseEvent, itemName: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  const handleItemClick = () => {
    setActiveDropdown(null);
    onItemClick?.();
  };

  // All navigation items for single row layout
  const allNavItems = primaryNavigationItems.filter(item => item.name !== "How It Works");

  const highlightedItems: string[] = ["Most Popular Tests"];

  const renderNavItem = (item: typeof primaryNavigationItems[0]) => {
    const isPopularTests = item.name === "Most Popular Tests";
    const hasAccent = highlightedItems.includes(item.name);

    return (
      <div
        key={item.path}
        className="relative nav-item-wrapper"
        style={{ overflow: 'visible' }}
      >
        <Link
          to={item.path}
          className={`group relative font-heading text-[10px] md:text-xs lg:text-base xl:text-lg leading-tight font-semibold transition-all duration-300 ease-out px-2 md:px-2 lg:px-2.5 py-1.5 md:py-1.5 lg:py-1.5 rounded-lg whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
            hasAccent
              ? "text-brand-turquoise hover:text-brand-pink font-bold"
              : "text-white hover:text-brand-pink"
          }`}
          onClick={handleItemClick}
        >
          {item.name}
        </Link>
      </div>
    );
  };

  const renderMoreButton = () => (
    <div className="relative nav-item-wrapper" style={{ zIndex: 100 }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={activeDropdown === "MORE"}
        className={`group relative font-heading text-[10px] md:text-xs lg:text-base xl:text-lg leading-tight font-semibold transition-all duration-300 ease-out px-2 md:px-2 lg:px-2.5 py-1.5 md:py-1.5 lg:py-1.5 rounded-lg whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
          activeDropdown === "MORE" ? 'text-brand-pink' : 'text-white hover:text-brand-pink'
        }`}
        onClick={(e) => handleDropdownToggle(e, "MORE")}
      >
        Resources
        <ChevronDown className={`w-4 h-4 lg:w-5 lg:h-5 transition-transform ${
          activeDropdown === "MORE" ? 'rotate-180' : ''
        }`} />
      </button>
      
      {activeDropdown === "MORE" && (
        <MoreDropdownMenu
          sections={moreNavigationSections}
          onItemClick={handleItemClick}
          onClose={handleCloseDropdown}
          isMobile={isMobile}
        />
      )}
    </div>
  );

  return (
    <>
      {/* Backdrop for mobile */}
      {isMobile && activeDropdown && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[98]"
          onClick={() => setActiveDropdown(null)}
        />
      )}

      <nav className={`relative ${className}`} aria-label="Main Navigation" style={{ position: 'relative', zIndex: 100, overflow: 'visible' }}>
        {/* Mobile: Single wrapped row */}
        {isMobile ? (
          <div className="flex items-center justify-center gap-1 flex-wrap" style={{ position: 'relative', overflow: 'visible' }}>
            {allNavItems.map(renderNavItem)}
            {renderMoreButton()}
          </div>
        ) : (
          /* Tablet wraps to two rows; desktop stays single row */
          <div className="flex items-center justify-center gap-x-2 gap-y-1.5 lg:gap-x-2 lg:gap-y-0 flex-wrap lg:flex-nowrap" style={{ position: 'relative', overflow: 'visible' }}>
            {allNavItems.map(renderNavItem)}
            {renderMoreButton()}
          </div>
        )}
      </nav>
    </>
  );
};
