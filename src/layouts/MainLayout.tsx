/**
 * Shared layout component for consistent page structure.
 * Includes: BrowseByCategoryBar on non-home pages, main content area, Footer, CookieConsent.
 */


import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

import { lazy, Suspense } from "react";
import Footer from "@/components/layout/Footer";
import CookieConsent from "@/components/compliance/CookieConsent";
import SiteBreadcrumb from "@/components/common/SiteBreadcrumb";
import BrowseByCategoryBar from "@/components/layout/BrowseByCategoryBar";
import { ComparisonBar } from "@/components/compare/ComparisonBar";
import { compareStore, useCompareItems } from "@/stores/compareStore";
import { useNavigate } from "react-router-dom";

const AccreditedProvidersBar = lazy(() => import("@/components/sections/AccreditedProvidersBar"));

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
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const navigate = useNavigate();
  const compareItems = useCompareItems();

  return (
    <div className="min-h-dvh flex flex-col bg-[hsl(224,67%,10%)]">
      {/* Accessibility: skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      {!hideHeader && !isHome && (
        <>
          <BrowseByCategoryBar variant="flush" />
          <Suspense fallback={<div className="min-h-[60px]" aria-hidden="true" />}>
            <AccreditedProvidersBar />
          </Suspense>
        </>
      )}


      <main id="main-content" className={mainClassName} tabIndex={-1}>
        <SiteBreadcrumb />
        {children}
      </main>
      {!hideFooter && <Footer />}
      <CookieConsent />
      <ComparisonBar
        selectedTests={compareItems}
        onRemoveTest={(id) => compareStore.remove(id)}
        onCompare={() => navigate("/compare")}
        onClearAll={() => compareStore.clear()}
      />
    </div>
  );
};

export default MainLayout;