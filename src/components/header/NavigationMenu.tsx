import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useNavigationData } from "@/hooks/useNavigationData";
import { useIsMobile } from "@/hooks/use-mobile";
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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(() => {
    // Restore from sessionStorage on mount
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('activeDropdown');
    }
    return null;
  });
  const { getTestsForNavigation, getFilteredCategories, shouldShowGoodbodyTests } = useNavigationData();
  const isMobile = useIsMobile();

  // Persist dropdown state to sessionStorage
  useEffect(() => {
    if (activeDropdown) {
      sessionStorage.setItem('activeDropdown', activeDropdown);
    } else {
      sessionStorage.removeItem('activeDropdown');
    }
  }, [activeDropdown]);

  // Close dropdown when clicking outside (for both desktop and mobile)
  useEffect(() => {
    if (!activeDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-item-wrapper') && !target.closest('.dropdown-content')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown]);

  // Close dropdown explicitly (for close button)
  const handleCloseDropdown = () => {
    setActiveDropdown(null);
  };

  const handleMouseEnter = (itemName: string) => {
    if (isMobile) return; // Disable hover on mobile
    
    const item = primaryNavigationItems.find(nav => nav.name === itemName);
    if (item?.hasDropdown || itemName === "MORE") {
      setActiveDropdown(itemName);
    }
  };

  // Dropdown stays open until user clicks a link or clicks outside
  const handleMouseLeave = () => {
    // Do nothing - dropdown stays open until clicked
  };

  const handleClick = (e: React.MouseEvent, itemName: string) => {
    if (!isMobile) return; // Only handle clicks on mobile

    const item = primaryNavigationItems.find(nav => nav.name === itemName);
    if (item?.hasDropdown) {
      e.preventDefault();
      e.stopPropagation();
      setActiveDropdown(activeDropdown === itemName ? null : itemName);
    }
  };

  const handleItemClick = () => {
    setActiveDropdown(null);
    onItemClick?.();
  };

  // Split navigation items into two rows for desktop/tablet (matching reference image)
  const topRowItems = primaryNavigationItems.filter(item => 
    ["Most Popular Tests", "General Wellness", "Women's Health", "Men's Health"].includes(item.name)
  );
  const bottomRowItems = primaryNavigationItems.filter(item => 
    ["Sports/Fitness Health", "Fertility", "Cancer Screening", "At Home Tests"].includes(item.name)
  );

  const renderNavItem = (item: typeof primaryNavigationItems[0]) => (
    <div 
      key={item.path}
      className="relative nav-item-wrapper"
      style={{ overflow: 'visible' }}
      onMouseEnter={() => handleMouseEnter(item.name)}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={item.hasDropdown && isMobile ? '#' : item.path}
        className={`group relative text-xs md:text-sm lg:text-base font-semibold transition-all duration-300 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-md whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
          (item as any).highlighted 
            ? "text-brand-pink bg-brand-pink/10"
            : "text-brand-navy hover:text-brand-pink hover:bg-brand-navy/5"
        } ${activeDropdown === item.name ? 'text-brand-pink bg-brand-navy/10' : ''}`}
        onClick={(e) => {
          if (item.hasDropdown && isMobile) {
            handleClick(e, item.name);
          } else {
            handleItemClick();
          }
        }}
      >
        {item.name}
        {item.hasDropdown && (
          <ChevronDown className={`w-3 h-3 md:w-4 md:h-4 transition-transform ${
            activeDropdown === item.name ? 'rotate-180' : ''
          }`} />
        )}
      </Link>
      
      {/* Mega Menu Dropdown */}
      {item.hasDropdown && activeDropdown === item.name && (
        <MegaMenuDropdown
          itemName={item.name}
          itemPath={item.path}
          goodbodyTests={shouldShowGoodbodyTests(item.name) ? getTestsForNavigation(item.name.toUpperCase()) : undefined}
          categories={!shouldShowGoodbodyTests(item.name) ? getFilteredCategories(item.name) : undefined}
          onItemClick={handleItemClick}
          onClose={handleCloseDropdown}
          onMouseEnter={() => handleMouseEnter(item.name)}
          onMouseLeave={handleMouseLeave}
          isMobile={isMobile}
        />
      )}
    </div>
  );

  const renderMoreButton = () => (
    <div 
      className="relative nav-item-wrapper"
      onMouseEnter={() => handleMouseEnter("MORE")}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`group relative text-xs md:text-sm lg:text-base font-semibold transition-all duration-300 px-2 md:px-3 lg:px-4 py-1.5 md:py-2 rounded-md whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
          activeDropdown === "MORE" ? 'text-brand-pink bg-brand-navy/10' : 'text-brand-navy hover:text-brand-pink hover:bg-brand-navy/5'
        }`}
        onClick={(e) => {
          if (isMobile) {
            e.preventDefault();
            e.stopPropagation();
            setActiveDropdown(activeDropdown === "MORE" ? null : "MORE");
          }
        }}
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
          onMouseEnter={() => handleMouseEnter("MORE")}
          onMouseLeave={handleMouseLeave}
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
            {primaryNavigationItems.filter(item => item.name !== "How It Works").map(renderNavItem)}
            {renderMoreButton()}
          </div>
        ) : (
          /* Desktop/Tablet: Two-row layout matching reference image */
          <div className="flex flex-col items-center gap-1" style={{ position: 'relative', overflow: 'visible' }}>
            {/* Top row: Most Popular, General Wellness, Women's Health, Men's Health */}
            <div className="flex items-center justify-center gap-2 lg:gap-4" style={{ overflow: 'visible' }}>
              {topRowItems.map(renderNavItem)}
            </div>
            {/* Bottom row: Sports/Fitness, Fertility, Cancer Screening, At Home Tests, More */}
            <div className="flex items-center justify-center gap-2 lg:gap-4" style={{ overflow: 'visible' }}>
              {bottomRowItems.map(renderNavItem)}
              {renderMoreButton()}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
