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
    
    const item = primaryNavigationItems.find(nav => nav.name === itemName);
    if (item?.hasDropdown) {
      setActiveDropdown(itemName);
    }
  };

  const handleMouseLeave = (event?: React.MouseEvent) => {
    if (isMobile) return; // Disable hover on mobile
    if (!event) return;
    
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    // Keep dropdown open if moving to dropdown content or another nav item
    if (relatedTarget?.closest('.dropdown-content') || 
        relatedTarget?.closest('.nav-item-wrapper')) {
      return;
    }
    
    // Add delay before closing to prevent flickering
    setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
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

      <nav className={`relative ${className}`} aria-label="Main Navigation" style={{ position: 'relative', zIndex: 100 }}>
        <div className="flex items-center justify-center gap-0.5 md:gap-1 flex-wrap" style={{ position: 'relative' }}>
          {/* Primary Navigation Items */}
          {primaryNavigationItems.filter(item => item.name !== "How It Works").map((item) => (
            <div 
              key={item.path}
              className="relative nav-item-wrapper"
              onMouseEnter={() => handleMouseEnter(item.name)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                to={item.hasDropdown && isMobile ? '#' : item.path}
                className={`text-sm md:text-base lg:text-lg font-semibold transition-colors px-2 md:px-3 py-2 whitespace-nowrap hover:text-[#E70D69] inline-flex items-center gap-1 ${
                  (item as any).highlighted 
                    ? "text-[#E70D69]"
                    : "text-white"
                } ${activeDropdown === item.name && isMobile ? 'text-[#E70D69]' : ''}`}
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
                  <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${
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
            onMouseEnter={() => !isMobile && setActiveDropdown("MORE")}
            onMouseLeave={handleMouseLeave}
          >
            <button
              className={`text-sm md:text-base lg:text-lg font-semibold transition-colors px-2 md:px-3 py-2 whitespace-nowrap hover:text-[#E70D69] inline-flex items-center gap-1 text-white ${
                activeDropdown === "MORE" && isMobile ? 'text-[#E70D69]' : ''
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
              <ChevronDown className={`w-4 h-4 md:w-5 md:h-5 transition-transform ${
                activeDropdown === "MORE" && isMobile ? 'rotate-180' : ''
              }`} />
            </button>
            
            {activeDropdown === "MORE" && (
              <MoreDropdownMenu
                sections={moreNavigationSections}
                onItemClick={handleItemClick}
                onMouseEnter={() => !isMobile && setActiveDropdown("MORE")}
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
