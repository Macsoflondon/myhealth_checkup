/**
 * Shared layout component for consistent page structure
 * Includes: Header (with BrandTicker), main content area, Footer, CookieConsent
 */

import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/compliance/CookieConsent";
import SiteBreadcrumb from "@/components/common/SiteBreadcrumb";

interface MainLayoutProps {
  children: ReactNode;
  /** Optional: Hide the header */
  hideHeader?: boolean;
  /** Optional: Hide the footer */
  hideFooter?: boolean;
  /** Optional: Custom class for main content area */
  mainClassName?: string;
}

export const MainLayout = ({ 
  children, 
  hideHeader = false,
  hideFooter = false,
  mainClassName = "flex-1"
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[hsl(224,67%,10%)]">
      {/* Accessibility: skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>
      {!hideHeader && <Header />}
      <main id="main-content" className={mainClassName} tabIndex={-1}>
        <SiteBreadcrumb />
        {children}
      </main>
      {!hideFooter && <Footer />}
      <CookieConsent />
    </div>
  );
};

export default MainLayout;
