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
import { ErrorBoundary } from "./ErrorBoundary";

interface HeaderProps {
  className?: string;
}

const Header = ({ className }: HeaderProps) => {
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
    return (
      <ErrorBoundary>
        <header className={cn("sticky top-0 z-50 bg-white border-b border-gray-200", className)}>
          <div className="px-4 py-3 flex justify-between items-center">
            <Logo />
            
            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <UserMenu isMobile />
              <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
        </header>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <header className={cn("sticky top-0 z-50 bg-white border-b border-gray-200", className)}>
        {/* Main header bar */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between gap-6 max-w-7xl mx-auto">
            {/* Logo and tagline */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <Logo />
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-lg mx-6">
              <SearchBar />
            </div>
            
            {/* User Menu and Language Switcher */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="bg-white border-t border-gray-200 overflow-hidden">
          <div className="px-2 sm:px-4 py-2 max-w-7xl mx-auto">
            <NavigationItems className="flex items-center justify-start sm:justify-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-1" />
          </div>
        </div>
      </header>
    </ErrorBoundary>
  );
};

export default Header;