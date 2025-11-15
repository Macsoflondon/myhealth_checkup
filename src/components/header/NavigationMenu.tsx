import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useNavigationData } from "@/hooks/useNavigationData";
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

  const handleMouseEnter = (itemName: string) => {
    const item = primaryNavigationItems.find(nav => nav.name === itemName);
    if (item?.hasDropdown) {
      setActiveDropdown(itemName);
    }
  };

  const handleMouseLeave = (event?: React.MouseEvent) => {
    if (!event) return;
    
    const relatedTarget = event.relatedTarget as HTMLElement;
    
    if (relatedTarget?.closest('.dropdown-content') || 
        relatedTarget?.closest('.nav-item-wrapper') ||
        relatedTarget?.closest('nav')) {
      return;
    }
    
    setTimeout(() => {
      setActiveDropdown(null);
    }, 100);
  };

  return (
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
              to={item.path}
              className={`text-sm md:text-base lg:text-lg font-semibold transition-colors px-2 md:px-3 py-2 whitespace-nowrap hover:text-[#E70D69] inline-flex items-center gap-1 ${
                (item as any).highlighted 
                  ? "text-[#E70D69]"
                  : "text-white"
              }`}
              onClick={onItemClick}
            >
              {item.name}
              {item.hasDropdown && (
                <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
              )}
            </Link>
            
            {/* Mega Menu Dropdown */}
            {item.hasDropdown && activeDropdown === item.name && (
              <MegaMenuDropdown
                itemName={item.name}
                itemPath={item.path}
                goodbodyTests={shouldShowGoodbodyTests(item.name) ? getTestsForNavigation(item.name.toUpperCase()) : undefined}
                categories={!shouldShowGoodbodyTests(item.name) ? getFilteredCategories(item.name) : undefined}
                onItemClick={onItemClick}
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={handleMouseLeave}
              />
            )}
          </div>
        ))}
      
        {/* MORE Dropdown */}
        <div 
          className="relative nav-item-wrapper"
          onMouseEnter={() => setActiveDropdown("MORE")}
          onMouseLeave={handleMouseLeave}
        >
          <button
            className="text-sm md:text-base lg:text-lg font-semibold transition-colors px-2 md:px-3 py-2 whitespace-nowrap hover:text-[#E70D69] inline-flex items-center gap-1 text-white"
          >
            More
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          
          {activeDropdown === "MORE" && (
            <MoreDropdownMenu
              sections={moreNavigationSections}
              onItemClick={onItemClick}
              onMouseEnter={() => setActiveDropdown("MORE")}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </div>
      </div>
    </nav>
  );
};
