/**
 * Shared layout component for consistent page structure
 * Includes: UKASBanner, Header, main content area, Footer, CookieConsent
 */

import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import UKASBanner from "@/components/UKASBanner";
import CookieConsent from "@/components/compliance/CookieConsent";
import BrandTicker from "@/components/sections/BrandTicker";

interface MainLayoutProps {
  children: ReactNode;
  /** Optional: Hide the UKAS banner */
  hideUKASBanner?: boolean;
  /** Optional: Hide the header */
  hideHeader?: boolean;
  /** Optional: Hide the footer */
  hideFooter?: boolean;
  /** Optional: Custom class for main content area */
  mainClassName?: string;
}

export const MainLayout = ({ 
  children, 
  hideUKASBanner = false,
  hideHeader = false,
  hideFooter = false,
  mainClassName = "flex-1"
}: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <BrandTicker />
      {!hideUKASBanner && <UKASBanner />}
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
