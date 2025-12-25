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
          <div className="px-4 py-3 flex items-center justify-center bg-brand-navy">
            {/* Brand name */}
            <Link to="/" className="font-heading text-xl font-bold tracking-tight mr-auto">
              <span className="text-white">myhealth</span>{" "}
              <span className="text-brand-pink">checkup</span>
            </Link>

            {/* Centered navigation controls */}
            <nav className="flex items-center gap-1" aria-label="User controls">
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
        <div className="bg-brand-navy px-4 lg:px-8">
          <div className="relative flex items-center justify-between py-2">
            {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img alt="myhealth checkup" className="h-56 lg:h-64 xl:h-72 w-auto object-contain" src="/lovable-uploads/19e3ce59-f8d7-4363-b8ab-7baae3218e00.png" />
            </Link>

            {/* Center: Tagline banner image */}
            <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2">
              <img alt="Your health. Your choice. One trusted platform." className="h-72 lg:h-80 xl:h-96 w-auto object-contain" src="/lovable-uploads/52c165ee-be3b-4eff-a851-b5f76f9c7872.png" />
            </div>

            {/* Right: Controls */}
            <nav className="flex items-center gap-2" aria-label="User controls">
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