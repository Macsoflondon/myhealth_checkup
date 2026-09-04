import { ReactNode } from "react";
import { useLocation } from "@/lib/router-compat";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/compliance/CookieConsent";
import SiteBreadcrumb from "@/components/common/SiteBreadcrumb";
import BrowseByCategoryBar from "@/components/layout/BrowseByCategoryBar";

interface MainLayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
  hideFooter?: boolean;
  mainClassName?: string;
}

export const MainLayout = ({ 
  children, 
  hideHeader = false,
  hideFooter = false,
  mainClassName = "flex-1"
}: MainLayoutProps) => {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isCompare = pathname === "/compare";
  return (
    <div className="min-h-dvh flex flex-col bg-brand-navy page-surface">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg">Skip to main content</a>
      {/* Page surface: inset from the viewport, with the outer margins painted
          in the brand navy. Overlays (cookie banner, comparison bar) stay
          outside so the mask never clips them. */}
      <div className="page-surface-inner flex flex-1 flex-col bg-white">
        {!hideHeader && !isHome && (
          <BrowseByCategoryBar variant="flush" placement="straddle" />
        )}
        <main id="main-content" className={mainClassName} tabIndex={-1}>
          {!isCompare && <SiteBreadcrumb />}
          {children}
        </main>
        {!hideFooter && <Footer />}
      </div>
      <CookieConsent />
    </div>
  );
};
export default MainLayout;
