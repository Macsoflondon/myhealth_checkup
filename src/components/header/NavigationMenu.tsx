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

  const renderNavItem = (item: typeof primaryNavigationItems[0]) => {
    // Check if this is the "Most Popular Tests" item
    const isPopularTests = item.name === "Most Popular Tests";
    
    return (
      <div 
        key={item.path}
        className="relative nav-item-wrapper"
        style={{ overflow: 'visible' }}
      >
        {item.hasDropdown ? (
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={activeDropdown === item.name}
            className={`group relative text-xs md:text-sm lg:text-[0.8rem] xl:text-sm font-semibold transition-all duration-300 px-2 md:px-2.5 lg:px-3 xl:px-3.5 py-1.5 md:py-2 rounded-md whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
              (item as any).highlighted 
                ? "text-brand-pink bg-transparent"
                : "text-brand-navy hover:text-brand-pink hover:bg-brand-navy/5"
            } ${activeDropdown === item.name ? 'text-brand-pink bg-brand-navy/10' : ''}`}
            onClick={(e) => handleDropdownToggle(e, item.name)}
          >
            {item.name}
            <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${
              activeDropdown === item.name ? 'rotate-180' : ''
            }`} />
          </button>
        ) : (
          <Link
            to={item.path}
            className={`group relative text-xs md:text-sm lg:text-[0.8rem] xl:text-sm font-semibold transition-all duration-300 px-2 md:px-2.5 lg:px-3 xl:px-3.5 py-1.5 md:py-2 rounded-md whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
              (item as any).highlighted 
                ? "text-brand-pink bg-transparent"
                : "text-brand-navy hover:text-brand-pink hover:bg-brand-navy/5"
            }`}
            onClick={handleItemClick}
          >
            {item.name}
          </Link>
        )}
        
        {/* Mega Menu Dropdown */}
        {item.hasDropdown && activeDropdown === item.name && (
          <MegaMenuDropdown
            itemName={item.name}
            itemPath={item.path}
            popularTests={isPopularTests ? popularTestsFromDb : undefined}
            goodbodyTests={!isPopularTests && shouldShowGoodbodyTests(item.name) ? getTestsForNavigation(item.name.toUpperCase()) : undefined}
            categories={!isPopularTests && !shouldShowGoodbodyTests(item.name) ? getFilteredCategories(item.name) : undefined}
            onItemClick={handleItemClick}
            onClose={handleCloseDropdown}
            isMobile={isMobile}
          />
        )}
      </div>
    );
  };

  const renderMoreButton = () => (
    <div className="relative nav-item-wrapper" style={{ zIndex: 100 }}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={activeDropdown === "MORE"}
        className={`group relative text-xs md:text-sm lg:text-base font-semibold transition-all duration-300 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-md whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
          activeDropdown === "MORE" ? 'text-brand-pink bg-brand-navy/10' : 'text-brand-navy hover:text-brand-pink hover:bg-brand-navy/5'
        }`}
        onClick={(e) => handleDropdownToggle(e, "MORE")}
      >
        More
        <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${
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
          /* Desktop/Tablet: Single row layout */
          <div className="flex items-center justify-center gap-1 lg:gap-2 flex-wrap" style={{ position: 'relative', overflow: 'visible' }}>
            {allNavItems.map(renderNavItem)}
            {renderMoreButton()}
          </div>
        )}
      </nav>
    </>
  );
};
