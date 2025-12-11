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
import headerTaglineBanner from "@/assets/header-tagline-banner.png";
import mobileLogo from "@/assets/mobile-logo.png";
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
        <header className={cn("sticky top-0 z-50 bg-brand-navy shadow-md", className)}>
          <div className="px-4 py-3 flex items-center justify-between bg-brand-navy">
            {/* Mobile logo - left aligned */}
            <div className="flex-shrink-0">
              <img src={mobileLogo} alt="myhealth checkup" className="h-9 max-w-[1500px] object-contain" />
            </div>

            {/* Right side controls */}
            <nav className="flex items-center gap-1 flex-shrink-0" aria-label="User controls">
              <LanguageSwitcher />
              <UserMenu isMobile />
              <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
            </nav>
          </div>
          
          {/* Mobile Navigation Drawer */}
          <MobileNavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
      </ErrorBoundary>;
  }
  // Toolbar always sticky
  const headerBarClasses = cn("bg-brand-navy px-6 lg:px-16 py-6 lg:py-8", styles.header, styles.headerVisible);
  const toolbarClasses = cn("bg-brand-navy my-0 mx-0 px-0 py-[10px] border-b border-white/20", styles.toolbar);
  return <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)}>
        {/* Main header bar - Logo, Search, User Controls, and Hero Image */}
        <div className="">
          <div className="relative w-full bg-brand-navy py-0 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-shrink-0 z-10">
              <Logo />
            </div>

            {/* Center tagline banner */}
            <div className="hidden md:flex flex-1 justify-center px-4 z-10">
              <img src={headerTaglineBanner} alt="Your health. Your choice. One trusted platform." className="h-12 lg:h-14 xl:h-16 max-w-[350px] lg:max-w-[450px] xl:max-w-[500px] object-contain" />
            </div>

            <nav className="flex items-center gap-2 flex-shrink-0 justify-end z-10" aria-label="User controls">
              <LanguageSwitcher />
              <UserMenu />
            </nav>
          </div>
        </div>

        {/* Bottom row - Navigation Menu (Toolbar) */}
        <div className={toolbarClasses}>
          <div className="flex items-center justify-center px-2 sm:px-4 lg:px-16 w-full overflow-x-auto overflow-y-visible">
            <NavigationItems className="flex items-center gap-0 min-w-max" />
          </div>
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;