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
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { getTestsForNavigation, getFilteredCategories, shouldShowGoodbodyTests } = useNavigationData();
  const isMobile = useIsMobile();
  const leaveTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  // Close dropdown when clicking outside on mobile
  useEffect(() => {
    if (!isMobile || !activeDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.nav-item-wrapper') && !target.closest('.dropdown-content')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMobile, activeDropdown]);

  const handleMouseEnter = (itemName: string) => {
    if (isMobile) return; // Disable hover on mobile
    
    // Clear any pending close timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    
    const item = primaryNavigationItems.find(nav => nav.name === itemName);
    if (item?.hasDropdown || itemName === "MORE") {
      setActiveDropdown(itemName);
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return; // Disable hover on mobile
    
    // Clear any existing timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    
    // Set a timeout to close the dropdown
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 200);
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
        <div className="flex items-center justify-center gap-0 flex-wrap" style={{ position: 'relative', overflow: 'visible' }}>
          {/* Primary Navigation Items */}
          {primaryNavigationItems.filter(item => item.name !== "How It Works").map((item) => (
            <div 
              key={item.path}
              className="relative nav-item-wrapper"
              style={{ overflow: 'visible' }}
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.hasDropdown && isMobile ? '#' : item.path}
                className={`group relative text-xs sm:text-sm font-semibold transition-all duration-300 px-2 py-1.5 rounded-md whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
                  (item as any).highlighted 
                    ? "text-brand-pink bg-brand-pink/10"
                    : "text-white hover:text-brand-turquoise hover:bg-white/5"
                } ${activeDropdown === item.name && isMobile ? 'text-brand-turquoise bg-white/10' : ''}`}
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
                  <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                    activeDropdown === item.name && isMobile ? 'rotate-180' : ''
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
                  onMouseEnter={() => handleMouseEnter(item.name)}
                  onMouseLeave={handleMouseLeave}
                  isMobile={isMobile}
                />
              )}
            </div>
          ))}
      
          {/* MORE Dropdown */}
          <div 
            className="relative nav-item-wrapper"
            onMouseEnter={() => handleMouseEnter("MORE")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`group relative text-xs sm:text-sm font-semibold transition-all duration-300 px-2 py-1.5 rounded-md whitespace-nowrap inline-flex items-center gap-1 hover:after:w-full after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-brand-pink after:transition-all after:duration-300 after:delay-150 ${
                activeDropdown === "MORE" && isMobile ? 'text-brand-turquoise bg-white/10' : 'text-white hover:text-brand-turquoise hover:bg-white/5'
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
              <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${
                activeDropdown === "MORE" && isMobile ? 'rotate-180' : ''
              }`} />
            </button>
            
            {activeDropdown === "MORE" && (
              <MoreDropdownMenu
                sections={moreNavigationSections}
                onItemClick={handleItemClick}
                onMouseEnter={() => handleMouseEnter("MORE")}
                onMouseLeave={handleMouseLeave}
                isMobile={isMobile}
              />
            )}
          </div>
        </div>
      </nav>
    </>
  );
};
