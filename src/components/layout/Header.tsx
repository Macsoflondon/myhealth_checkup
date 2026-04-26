import { useState, useEffect, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import mainLogo from "@/assets/myhealth-logo-cropped.png";
import headerTagline from "@/assets/header-tagline.png";
import mobileLogo from "@/assets/myhealth-mobile-logo.png";
import { NavigationItems } from "../header/NavigationItems";
import { UserMenu } from "../header/UserMenu";
import { MobileMenu } from "../header/MobileMenu";
import { MobileNavigationDrawer } from "../header/MobileNavigationDrawer";
import { LanguageSwitcher } from "../header/LanguageSwitcher";
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
      setIsToolbarSticky(window.scrollY > 120);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isMobile) {
    return (
      <ErrorBoundary>
        <div className={cn("sticky top-0 z-50", className)}>
          <header className="bg-[#081129] shadow-md">
            {/* Top gradient divider */}
            <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
            <div className="container mx-auto px-3 sm:px-4 max-w-full">
              {/* Single row: Logo left, Nav controls right */}
              <div className="py-2 flex items-center justify-between gap-1 min-w-0">
                {/* Left: Combined logo with tagline */}
                <Link to="/" className="flex items-center flex-shrink min-w-0 overflow-hidden">
                  <img
                    src={mobileLogo}
                    alt="myhealth checkup"
                    className="h-[56px] xs:h-[64px] sm:h-[72px] w-auto object-contain"
                  />
                </Link>

                {/* Right: Navigation controls */}
                <nav className="flex items-center gap-0.5 flex-shrink-0" aria-label="User controls">
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
        </div>
      </ErrorBoundary>
    );
  }
  // Toolbar with glassmorphism
  const toolbarClasses = cn(
    "bg-[hsl(220,5%,97%)] border-b border-gray-200/30 my-0 mx-0 px-0 py-1 shadow-[0_4px_30px_rgba(0,0,0,0.06)]",
    styles.toolbar
  );
  return (
    <ErrorBoundary>
      {/* Logo section scrolls normally */}
      <header className={className}>
        <div className="bg-[hsl(var(--brand-navy))]" style={{ backgroundColor: "#081129" }}>
          <div className="px-4 lg:px-8 xl:px-12">
            <div className="flex items-center py-8">
              {/* Left spacer for balance */}
              <div className="flex-1" />

              {/* Center: Logo + Tagline side by side */}
              <Link to="/" className="flex items-center justify-center flex-shrink-0 gap-6 transition-all duration-200 hover:scale-105">
                <img
                  src={mainLogo}
                  alt="myhealth checkup"
                  className="h-[4.5rem] lg:h-[5rem] xl:h-[5.5rem] w-auto object-contain"
                />
                <img
                  src={headerTagline}
                  alt="Your Health. Your Choice. One Trusted Platform!"
                  className="h-[4.5rem] lg:h-[5rem] xl:h-[5.5rem] w-auto object-contain max-w-[50vw]"
                />
              </Link>

              {/* Right: Controls pushed to far right */}
              <div className="flex-1 flex items-center justify-end">
                <nav className="flex items-center gap-3" aria-label="User controls">
                  <LanguageSwitcher />
                  <UserMenu />
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Toolbar sticks to the top of the viewport */}
      <div className="sticky top-0 z-40">
        {/* Top gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
        <div
          className={cn(
            toolbarClasses,
            "transition-all duration-300",
            isToolbarSticky && "shadow-lg animate-fade-in",
          )}
          style={{ overflow: "visible" }}
        >
          <div className="flex items-center justify-center px-2 sm:px-3 lg:px-8 w-full" style={{ overflow: "visible" }}>
            <NavigationItems className="flex items-center gap-0 flex-nowrap justify-center" />
          </div>
        </div>
        {/* Bottom gradient divider for toolbar */}
        <div className="h-[3px] bg-gradient-to-r from-brand-turquoise via-brand-pink to-brand-turquoise" />
      </div>
    </ErrorBoundary>
  );
};
export default Header;
