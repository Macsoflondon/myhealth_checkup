import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import { AnimatedLogo } from "../header/AnimatedLogo";
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
      <header className={cn("sticky top-0 z-50 bg-white shadow-md", className)}>
          {/* Top gradient divider */}
          <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
          <div className="container mx-auto px-3 sm:px-4">
            {/* Single row: Logo + Tagline left, Nav controls right */}
            <div className="py-1 flex items-center justify-between gap-2">
              {/* Left: Logo + Tagline inline */}
              <div className="flex items-center gap-1 flex-shrink min-w-0 -ml-3 sm:-ml-6">
                <Link to="/" className="flex items-center flex-shrink-0" style={{ overflow: 'visible' }}>
                  <AnimatedLogo className="h-[48px] xs:h-[56px] sm:h-20" />
                </Link>
                <p className="text-[6.5px] xs:text-[7.5px] sm:text-xs font-bold tracking-wide whitespace-nowrap leading-tight">
                  <span className="text-[#22c0d4]">Your </span>
                  <span className="text-[#e70d69]">health! </span>
                  <span className="text-[#22c0d4]">Your </span>
                  <span className="text-[#e70d69]">choice! </span>
                  <span className="text-brand-navy">One </span>
                  <span className="text-[#22c0d4]">trusted </span>
                  <span className="text-brand-navy">platform!</span>
                </p>
              </div>

              {/* Right: Navigation controls */}
              <nav className="flex items-center gap-1 -mr-3 sm:-mr-6 flex-shrink-0" aria-label="User controls">
                <LanguageSwitcher />
                <UserMenu isMobile />
                <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
              </nav>
            </div>
          </div>
          {/* Bottom gradient divider */}
          <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
          
          {/* Mobile Navigation Drawer */}
          <MobileNavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
      </ErrorBoundary>;
  }
  // Toolbar always sticky
  const toolbarClasses = cn("bg-white my-0 mx-0 px-0 py-2 shadow-sm", styles.toolbar);
  return <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)} style={{ overflow: 'visible' }}>
        {/* Main header bar - Logo, Search, User Controls, and Hero Image */}
        <div className="bg-[#081129]">
          <div className="container mx-auto px-4 lg:px-8 xl:px-12">
            <div className="relative flex items-center justify-between py-0 lg:py-1">
              {/* Left: Logo - positioned at far left edge */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0 transition-all duration-200 hover:scale-105 -ml-12 lg:-ml-16 xl:-ml-20" style={{ overflow: 'visible' }}>
                <AnimatedLogo className="h-36 lg:h-48 xl:h-[216px]" />
              </Link>

              {/* Center: Tagline text */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <p className="text-base lg:text-lg xl:text-xl font-bold tracking-normal lg:tracking-wide text-center whitespace-nowrap">
                  <span className="text-[#22c0d4]">Your Health.</span>{" "}
                  <span className="text-[#e70d69]">Your Choice.</span>{" "}
                  <span className="text-white">One Trusted Platform!</span>
                </p>
              </div>

              {/* Right: Controls - positioned at far right edge */}
              <nav className="flex items-center gap-3 -mr-8 lg:-mr-12 xl:-mr-16" aria-label="User controls">
                <LanguageSwitcher />
                <UserMenu />
              </nav>
            </div>
          </div>
        </div>

        {/* Top gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
        <div 
          className={cn(
            toolbarClasses, 
            "sticky top-0 z-50 transition-all duration-300",
            isToolbarSticky && "shadow-lg animate-fade-in"
          )} 
          style={{ overflow: 'visible' }}
        >
          <div className="flex items-center justify-center px-2 sm:px-3 lg:px-8 w-full" style={{ overflow: 'visible' }}>
            <NavigationItems className="flex items-center gap-0 flex-wrap justify-center" />
          </div>
        </div>
        {/* Bottom gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </header>
    </ErrorBoundary>;
};
export default Header;