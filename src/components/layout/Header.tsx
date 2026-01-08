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
import myhealthLogo from "@/assets/myhealth-logo-turquoise.png";
import taglineBanner from "@/assets/tagline-banner-latest.png";
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
      <header className={cn("sticky top-0 z-50 bg-[#22c0d4] shadow-md border-b-2 border-[#e70d69]", className)}>
          <div className="container mx-auto px-4">
            {/* Top row: Logo + Navigation controls */}
            <div className="py-2 flex items-center justify-between">
              {/* Logo - larger for emphasis */}
              <Link to="/" className="flex items-center flex-shrink-0">
                <img 
                  alt="myhealth checkup" 
                  className="h-16 xs:h-20 w-auto object-contain drop-shadow-lg" 
                  src={myhealthLogo} 
                />
              </Link>

              {/* Navigation controls */}
              <nav className="flex items-center gap-1" aria-label="User controls">
                <LanguageSwitcher />
                <UserMenu isMobile />
                <MobileMenu isMenuOpen={isMenuOpen} toggleMenu={toggleMenu} />
              </nav>
            </div>

            {/* Bottom row: Tagline banner - full width, centred */}
            <div className="pb-3 flex justify-center">
              <img 
                alt="Your health. Your choice. One trusted platform!" 
                className="h-12 xs:h-14 w-full max-w-sm object-contain drop-shadow-md" 
                src={taglineBanner} 
              />
            </div>
          </div>
          
          {/* Mobile Navigation Drawer */}
          <MobileNavigationDrawer isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </header>
      </ErrorBoundary>;
  }
  // Toolbar always sticky
  const toolbarClasses = cn("bg-white my-0 mx-0 px-0 py-1 border-y-2 border-[#e70d69] shadow-sm", styles.toolbar);
  return <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)} style={{ overflow: 'visible' }}>
        {/* Main header bar - Logo, Search, User Controls, and Hero Image */}
        <div className="bg-[#22c0d4]">
          <div className="container mx-auto px-4 lg:px-8 xl:px-12">
            <div className="relative flex items-center justify-between py-3 lg:py-4">
              {/* Left: Logo - smaller with hover effect */}
              <Link to="/" className="flex items-center gap-2 flex-shrink-0 transition-all duration-200 hover:scale-105 hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]">
                <img 
                  alt="myhealth checkup" 
                  className="h-16 lg:h-20 xl:h-24 w-auto object-contain" 
                  src={myhealthLogo} 
                />
              </Link>

              {/* Center: Tagline banner image */}
              <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <img 
                  alt="Your health. Your choice. One trusted platform!" 
                  className="h-80 lg:h-96 xl:h-[28rem] w-auto object-contain cursor-default" 
                  src={taglineBanner} 
                />
              </div>

              {/* Right: Controls */}
              <nav className="flex items-center gap-3" aria-label="User controls">
                <LanguageSwitcher />
                <UserMenu />
              </nav>
            </div>
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