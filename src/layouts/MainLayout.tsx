/**
 * Shared layout component for consistent page structure
 * Includes: Header (with BrandTicker), main content area, Footer, CookieConsent
 */

import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/compliance/CookieConsent";
import PageBreadcrumb from "@/components/common/PageBreadcrumb";

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
      {!hideHeader && <Header />}
      <main className={mainClassName}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      <CookieConsent />
    </div>
  );
};

export default MainLayout;
