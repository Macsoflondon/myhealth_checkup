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
import { useScrollDirection } from "@/hooks/useScrollDirection";
import styles from "./Header.module.css";
interface HeaderProps {
  className?: string;
}
const Header = ({
  className
}: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  const { scrollDirection, isAtTop } = useScrollDirection();
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
  // Determine header and toolbar state based on scroll
  const headerBarClasses = cn(
    "bg-[hsl(var(--section-dark))] px-3 sm:px-6 lg:px-16 py-4 lg:py-[30px]",
    styles.header,
    scrollDirection === 'down' && !isAtTop ? styles.headerHidden : styles.headerVisible
  );

  const toolbarClasses = cn(
    "bg-white my-0 mx-0 px-0 py-[10px]",
    styles.toolbar,
    !isAtTop ? styles.toolbarSticky : styles.toolbarUnsticky
  );

  return <ErrorBoundary>
      <header className={cn("relative bg-white border-b border-gray-200", className)}>
        {/* Main header bar - Logo, Search, User Controls, and Hero Image */}
        <div className={headerBarClasses}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr,auto,1fr] items-center gap-4 lg:gap-6 w-full">
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
            <Link to="/" aria-label="Return to homepage">
              <img 
                src="/lovable-uploads/hero-image-3.png" 
                alt="" 
                aria-hidden="true"
                className={styles.headerImage}
              />
            </Link>
              <Logo />
            </div>
            
            <div className="w-full lg:max-w-2xl px-2 lg:px-4">
              <SearchBar />
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0 justify-end">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </div>
        </div>
        
        {/* Bottom row - Navigation Menu (Toolbar) */}
        <div className={toolbarClasses}>
          <NavigationItems className="flex justify-center items-center gap-8" />
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;