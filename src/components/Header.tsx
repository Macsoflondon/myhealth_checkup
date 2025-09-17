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
        {/* Top row - Logo and User Controls */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 flex-shrink-0">
              <Logo />
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
        
        {/* Middle row - Centered Search Bar */}
        <div className="px-4 py-4">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl">
              <SearchBar />
            </div>
          </div>
        </div>
        
        {/* Bottom row - Navigation Menu */}
        <div className="px-4 py-2 border-t border-gray-100">
          <NavigationItems className="flex justify-center items-center gap-8" />
        </div>
      </header>
    </ErrorBoundary>
  );
};

export default Header;