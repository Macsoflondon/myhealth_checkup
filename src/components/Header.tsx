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
        {/* Main header bar - Logo, Search, and User Controls */}
        <div className="bg-[#081129] px-6 lg:px-16 py-[45px]">
          <div className="flex items-center justify-between gap-6 w-full">
            <div className="flex items-center flex-shrink-0">
              <Logo />
            </div>
            
            <div className="flex-1 flex justify-center mx-4">
              <div className="max-w-2xl w-full">
                <SearchBar />
              </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
        
        {/* Bottom row - Navigation Menu */}
        <div className="bg-white my-0 mx-0 px-0 py-[10px]">
          <NavigationItems className="flex justify-center items-center gap-8" />
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;