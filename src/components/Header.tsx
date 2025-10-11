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
  const {
    scrollDirection,
    isAtTop,
    videoOutOfView
  } = useScrollDirection();
  const toggleMenu = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
  }, [isMenuOpen]);
  useEffect(() => {
    // Close mobile menu when route changes
    setIsMenuOpen(false);
  }, [location.pathname]);
  if (isMobile) {
    return <ErrorBoundary>
        <header className={cn("sticky top-0 z-50 bg-[#081129]", className)}>
          <div className="px-3 py-2 flex justify-between items-center gap-3 bg-[#081129]">
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
  const headerBarClasses = cn("bg-[#081129] px-6 lg:px-16 py-2", styles.header, scrollDirection === 'down' && !isAtTop ? styles.headerHidden : styles.headerVisible);
  const toolbarClasses = cn("bg-white my-0 mx-0 px-0 py-[10px]", styles.toolbar, scrollDirection === 'down' && !isAtTop ? styles.toolbarSticky : styles.toolbarUnsticky);
  return <ErrorBoundary>
      <header className={cn("sticky top-0 z-50", className)}>
        {/* Navigation Menu (Toolbar) */}
        <div className={toolbarClasses}>
          <div className="flex items-center justify-between px-6 lg:px-16 w-full">
            {/* Logo - appears when video scrolls out of view */}
            <div className={cn(
              "transition-all duration-300 flex-shrink-0",
              videoOutOfView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 pointer-events-none"
            )}>
              <Logo />
            </div>
            
            {/* Navigation - stays centered */}
            <div className="flex-1 flex justify-center">
              <NavigationItems className="flex items-center gap-8" />
            </div>
            
            {/* Spacer to balance logo and keep nav centered */}
            <div className="w-[180px] flex-shrink-0" aria-hidden="true"></div>
          </div>
        </div>
      </header>
    </ErrorBoundary>;
};
export default Header;