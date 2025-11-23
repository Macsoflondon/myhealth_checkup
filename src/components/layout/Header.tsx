import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import { SearchBar } from "../header/SearchBar";
import { NavigationItems } from "../header/NavigationItems";
import { UserMenu } from "../header/UserMenu";
import { MobileMenu } from "../header/MobileMenu";
import { MobileNavigationDrawer } from "../header/MobileNavigationDrawer";
import { LanguageSwitcher } from "../header/LanguageSwitcher";
import { UtilityBar } from "../header/UtilityBar";
import { ErrorBoundary } from "../common/ErrorBoundary";
import styles from "./Header.module.css";
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
        <header className={cn("sticky top-0 z-50 bg-brand-navy shadow-md", className)}>
          <div className="px-3 py-2 flex justify-between items-center gap-2 bg-brand-navy h-14">
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <LanguageSwitcher />
              <UserMenu isMobile />
              <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </div>
          </div>
          
          {/* Mobile Navigation Drawer */}
          <MobileNavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
      </ErrorBoundary>
    );
  }
  // Toolbar always sticky
  const headerBarClasses = cn("bg-brand-navy px-6 lg:px-16 py-3", styles.header, styles.headerVisible);
  const toolbarClasses = cn("bg-brand-navy my-0 mx-0 px-0 py-[10px] border-b border-white/20", styles.toolbar);
  return (
    <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)}>
        {/* Main header bar - Logo, Search, User Controls, and Hero Image */}
        <div className={headerBarClasses}>
          <div className="relative flex items-center justify-between w-full bg-brand-navy py-0">
            <div className="flex items-center gap-2 flex-shrink-0 z-10">
              <Logo />
            </div>

            <div className="absolute left-1/2 -translate-x-1/2 z-0 w-full max-w-[400px] md:max-w-[480px]">
              <SearchBar />
            </div>

            <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0 justify-end z-10">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>

        {/* Bottom row - Navigation Menu (Toolbar) */}
        <div className={toolbarClasses}>
          <div className="flex items-center justify-center px-2 sm:px-4 lg:px-16 w-full overflow-x-auto overflow-y-visible">
            <NavigationItems className="flex items-center gap-0 min-w-max" />
          </div>
        </div>
      </header>
    </ErrorBoundary>
  );
};
export default Header;
