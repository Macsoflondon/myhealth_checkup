import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Logo } from "../header/Logo";
import logoWithTagline from "@/assets/logo-with-tagline.png";
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

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  if (isMobile) {
    return (
      <ErrorBoundary>
        <header className={cn("sticky top-0 z-50 bg-[#081129] shadow-md", className)}>
          {/* Top gradient divider */}
          <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
          <div className="container mx-auto px-3 sm:px-4">
            {/* Single row: Logo left, Nav controls right */}
            <div className="py-0.5 flex items-center justify-between gap-1.5">
              {/* Left: Combined logo with tagline */}
              <Link to="/" className="flex items-center flex-shrink min-w-0">
                <img
                  src={logoWithTagline}
                  alt="myhealth checkup - Your health! Your choice! One trusted platform!"
                  className="h-[56px] xs:h-[62px] sm:h-[72px] w-auto object-contain"
                />
              </Link>

              {/* Right: Navigation controls */}
              <nav className="flex items-center gap-1 flex-shrink-0" aria-label="User controls">
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
      </ErrorBoundary>
    );
  }
  // Toolbar always sticky
  const toolbarClasses = cn("bg-white my-0 mx-0 px-0 py-2 shadow-sm", styles.toolbar);
  return (
    <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)} style={{ overflow: "visible" }}>
        {/* Main header bar - Logo and User Controls */}
        <div className="bg-[#081129]">
          <div className="px-4 lg:px-8 xl:px-12">
            <div className="flex items-center py-1 lg:py-1.5">
              {/* Left spacer for balance */}
              <div className="flex-1" />

              {/* Center: Combined logo with tagline - doubled size */}
              <Link to="/" className="flex items-center justify-center flex-shrink-0 transition-all duration-200 hover:scale-105">
                <img
                  src={logoWithTagline}
                  alt="myhealth checkup - Your Health. Your Choice. One Trusted Platform!"
                  className="h-32 lg:h-40 xl:h-48 w-auto object-contain"
                />
              </Link>

              {/* Right: Controls centered in remaining space */}
              <div className="flex-1 flex items-center justify-center">
                <nav className="flex items-center gap-3" aria-label="User controls">
                  <LanguageSwitcher />
                  <UserMenu />
                </nav>
              </div>
            </div>
          </div>
        </div>

        {/* Top gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
        <div
          className={cn(
            toolbarClasses,
            "sticky top-0 z-50 transition-all duration-300",
            isToolbarSticky && "shadow-lg animate-fade-in",
          )}
          style={{ overflow: "visible" }}
        >
          <div className="flex items-center justify-center px-2 sm:px-3 lg:px-8 w-full" style={{ overflow: "visible" }}>
            <NavigationItems className="flex items-center gap-0 flex-wrap justify-center" />
          </div>
        </div>
        {/* Bottom gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </header>
    </ErrorBoundary>
  );
};
export default Header;
