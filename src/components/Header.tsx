import { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
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
        <header className={cn("sticky top-0 z-50 bg-white border-b border-gray-200", className)}>
          <div className="px-3 py-2 flex justify-between items-center gap-3">
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
      <header className={cn("sticky top-0 z-50 bg-white border-b border-gray-200", className)}>
        {/* Main header row - Logo with tagline, Search, User Controls */}
        <div className="bg-white px-6 lg:px-16 py-4">
          <div className="flex items-center justify-between gap-6 w-full">
            {/* Logo and tagline */}
            <div className="flex flex-col flex-shrink-0">
              <Logo />
              <p className="text-sm mt-1">
                Your <span className="text-[#22c0d4]">health</span> is your greatest <span className="text-[#e70d69]">asset!</span>
              </p>
            </div>
            
            {/* Search bar */}
            <div className="flex-1 max-w-2xl">
              <SearchBar />
            </div>
            
            {/* User controls */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <div className="bg-white border-t border-gray-200">
          <NavigationItems className="flex justify-center items-center gap-8 py-3" />
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;