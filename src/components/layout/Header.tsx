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
import mobileLogo from "@/assets/mobile-banner-logo.png";
interface HeaderProps {
  className?: string;
}
const Header = ({
  className
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolbarSticky, setIsToolbarSticky] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      // Toolbar becomes sticky after scrolling past ~120px (header height)
      setIsToolbarSticky(window.scrollY > 120);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  if (isMobile) {
    return <ErrorBoundary>
        <header className={cn("sticky top-0 z-50 bg-brand-navy shadow-md transition-all duration-300", className)}>
          <div className="px-2 xs:px-3 py-2 flex items-center justify-between bg-brand-navy">
            {/* Logo - responsive sizing for mobile */}
            <Link to="/" className="flex items-center flex-shrink-0">
              <img 
                alt="myhealth checkup" 
                className="h-10 xs:h-12 sm:h-14 w-auto object-contain" 
                src="/lovable-uploads/myhealth-logo-bg-turquoise.png" 
              />
            </Link>

            {/* Tagline banner - mobile with responsive sizing */}
            <div className="flex-1 flex justify-center px-1 xs:px-2">
              <img 
                alt="Your health. Your choice. One trusted platform." 
                className="h-8 xs:h-10 sm:h-12 max-w-[140px] xs:max-w-[180px] sm:max-w-none w-auto object-contain" 
                src="/lovable-uploads/52c165ee-be3b-4eff-a851-b5f76f9c7872.png" 
              />
            </div>

            {/* Navigation controls */}
            <nav className="flex items-center gap-0.5 xs:gap-1" aria-label="User controls">
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
  const toolbarClasses = cn("bg-white my-0 mx-0 px-0 py-1 border-y-2 border-[#e70d69] shadow-sm", styles.toolbar);
  return <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)} style={{ overflow: 'visible' }}>
        {/* Main header bar - Logo, Search, User Controls, and Hero Image */}
        <div className="bg-brand-navy px-4 lg:px-8 xl:px-12">
          <div className="relative flex items-center justify-between py-2 lg:py-3">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img alt="myhealth checkup" className="h-36 lg:h-40 xl:h-44 w-auto object-contain" src="/lovable-uploads/myhealth-logo-bg-turquoise.png" />
            </Link>

            {/* Center: Tagline banner image */}
            <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <img alt="Your health. Your choice. One trusted platform." className="h-64 lg:h-72 xl:h-80 w-auto object-contain" src="/lovable-uploads/52c165ee-be3b-4eff-a851-b5f76f9c7872.png" />
            </div>

            {/* Right: Controls */}
            <nav className="flex items-center gap-3" aria-label="User controls">
              <LanguageSwitcher />
              <UserMenu />
            </nav>
          </div>
        </div>

        {/* Bottom row - Navigation Menu (Toolbar) - Sticky */}
        <div 
          className={cn(
            toolbarClasses, 
            "sticky top-0 z-50 transition-all duration-300",
            isToolbarSticky && "shadow-lg border-b-2 border-[#e70d69] animate-fade-in"
          )} 
          style={{ overflow: 'visible' }}
        >
          <div className="flex items-center justify-center px-2 sm:px-3 lg:px-8 w-full" style={{ overflow: 'visible' }}>
            <NavigationItems className="flex items-center gap-0 flex-wrap justify-center" />
          </div>
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;