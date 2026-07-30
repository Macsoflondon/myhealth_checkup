// ported from main.tsx — brand typography, self-hosted via @fontsource
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/600.css";
import "@fontsource/montserrat/700.css";
import "@fontsource/montserrat/800.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/700.css";
// ported from main.tsx — i18next initialisation (module-scope, side-effect import)
import "../i18n/config";

import { useEffect, Suspense } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";

import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { SessionSecurityProvider } from "@/components/security/SessionSecurityProvider";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import FloatingNavDock from "@/components/common/FloatingNavDock";
import { GlobalHreflang } from "@/components/seo/GlobalHreflang";
import TestPageViewTracker from "@/components/analytics/TestPageViewTracker";
import GlobalPageBackground from "@/components/layout/GlobalPageBackground";
import { AutoTranslatePage } from "@/components/i18n/AutoTranslatePage";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { lazyWithRetry } from "@/lib/lazyWithRetry";

const ORG_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://myhealthcheckup.co.uk/#organization",
      name: "myhealth checkup",
      url: "https://myhealthcheckup.co.uk/",
      logo: {
        "@type": "ImageObject",
        url: "https://myhealthcheckup.co.uk/og-image.png",
      },
      description:
        "UK private health testing comparison marketplace. Compare blood tests, cancer screening, hormone panels, and fertility tests from regulated UK providers.",
      address: { "@type": "PostalAddress", addressCountry: "GB" },
      sameAs: ["https://twitter.com/myhealthcheckup"],
    },
    {
      "@type": "WebSite",
      "@id": "https://myhealthcheckup.co.uk/#website",
      url: "https://myhealthcheckup.co.uk/",
      name: "myhealth checkup",
      publisher: { "@id": "https://myhealthcheckup.co.uk/#organization" },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: "https://myhealthcheckup.co.uk/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "Compare UK Private Blood Tests | myhealth checkup" },
      {
        name: "description",
        content:
          "myhealth checkup connects you with trusted UK providers for clinical-grade health tests, making proactive healthcare simple, accessible and reliable.",
      },
      { name: "author", content: "MYHEALTHCHECKUP LTD" },
      { name: "robots", content: "index, follow" },
      { name: "google-site-verification", content: "d-S0SbPF-GVT1OxyYdzTj45dGI9dV0W5jRY76zau1GY" },
      { name: "geo.region", content: "GB" },
      { name: "geo.placename", content: "United Kingdom" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://myhealthcheckup.co.uk/og-image.png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:url", content: "https://myhealthcheckup.co.uk/" },
      { property: "og:site_name", content: "myhealth checkup" },
      { property: "og:title", content: "Compare UK Private Blood Tests | myhealth checkup" },
      {
        property: "og:description",
        content:
          "myhealth checkup connects you with trusted UK providers for clinical-grade health tests, making proactive healthcare simple, accessible and reliable.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@myhealthcheckup" },
      { name: "twitter:image", content: "https://myhealthcheckup.co.uk/og-image.png" },
      { name: "twitter:title", content: "Compare UK Private Blood Tests | myhealth checkup" },
      {
        name: "twitter:description",
        content:
          "myhealth checkup connects you with trusted UK providers for clinical-grade health tests, making proactive healthcare simple, accessible and reliable.",
      },
      { name: "theme-color", content: "#081129" },
      { name: "mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "apple-touch-icon", href: "/favicon.svg" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "alternate", hrefLang: "en-gb", href: "https://myhealthcheckup.co.uk/" },
      { rel: "alternate", hrefLang: "x-default", href: "https://myhealthcheckup.co.uk/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "dns-prefetch", href: "https://storage.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap",
      },
    ],
    scripts: [{ type: "application/ld+json", children: ORG_JSONLD }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        {/* Static, crawlable medical disclaimer + reviewer attribution (E-E-A-T). */}
        <p hidden id="static-medical-disclaimer" data-purpose="seo-eeat">
          <strong>Medical disclaimer:</strong> This site provides comparison information only and
          does not constitute medical advice. Consult your GP for medical guidance. Clinical
          content reviewed by Nathanial Smith, Physician Associate (HCPC PA43353).
        </p>
        <Scripts />
      </body>
    </html>
  );
}

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen text-muted-foreground">Loading…</div>
);

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  // ported from main.tsx — Web Vitals RUM reporter (no-op in dev)
  useEffect(() => {
    void import("@/lib/webVitals").then((m) => m.installWebVitals());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SessionSecurityProvider>
          <HelmetProvider>
            {/* Toasters intentionally kept outside TooltipProvider so toast
                state changes don't trigger tooltip context re-renders. */}
            <Toaster />
            <Sonner />
            <TooltipProvider>
              <ScrollToTop />
              <GlobalPageBackground />
              <GlobalHreflang />
              <TestPageViewTracker />
              <FloatingNavDock />
              <AutoTranslatePage />
              <ErrorBoundary>
                <Suspense fallback={<PageFallback />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </TooltipProvider>
          </HelmetProvider>
        </SessionSecurityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const NotFoundPage = lazyWithRetry(() => import("@/pages/NotFound"));

function NotFoundComponent() {
  return (
    <Suspense fallback={<PageFallback />}>
      <NotFoundPage />
    </Suspense>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground mb-3">This page didn't load</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Something went wrong on our end. You can try again or head back to the home page.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            void router.invalidate();
            reset();
          }}
          className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex items-center justify-center rounded-full border border-border bg-card px-8 py-3 font-semibold text-foreground transition-colors hover:bg-muted"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
