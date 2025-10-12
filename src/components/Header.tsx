import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "./header/Logo";
import { SearchBar } from "./header/SearchBar";
import { NavigationItems } from "./header/NavigationItems";
import { UserMenu } from "./header/UserMenu";
import { MobileMenu } from "./header/MobileMenu";
import { LanguageSwitcher } from "./header/LanguageSwitcher";
import { UtilityBar } from "./header/UtilityBar";
import { ErrorBoundary } from "./ErrorBoundary";
import styles from "./Header.module.css";
interface HeaderProps {
  className?: string;
}
const Header = ({
  className
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  if (isMobile) {
    return <ErrorBoundary>
        <header className={cn("sticky top-0 z-50 bg-white", className)}>
          <div className="px-3 py-2 flex justify-between items-center gap-3 bg-white border-b border-gray-200">
            <div className="flex-shrink-0">
              <Logo />
            </div>
            
            {/* Right side controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <LanguageSwitcher />
              <UserMenu isMobile />
              <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </header>
      </ErrorBoundary>;
  }
  return <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)}>
        {/* Utility Bar - light gray with phone and links */}
        <UtilityBar />
        
        {/* Main header bar - Logo, Search, User Controls */}
        <div className="bg-white border-b border-gray-200 px-6 lg:px-16 py-3">
          <div className="relative flex items-center justify-between w-full">
            <div className="flex items-center gap-2 flex-shrink-0 z-10">
              <Logo />
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 z-0 w-full max-w-[576px]">
              <SearchBar />
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 justify-end z-10">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
        
        {/* Navigation Toolbar */}
        <div className="bg-white shadow-sm my-0 mx-0 px-0 py-[10px]">
          <div className="flex items-center justify-center px-6 lg:px-16 w-full">
            <NavigationItems className="flex items-center gap-1" />
          </div>
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;