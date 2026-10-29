// Brand typography is self-hosted via @fontsource and imported from
// src/styles.css, so the @font-face rules ship inside the one render-blocking
// stylesheet instead of a second CSS request.

// ported from main.tsx — i18next initialisation (module-scope, side-effect import)
import i18nInstance from "../i18n/config";
import { I18nextProvider } from "react-i18next";

import { lazy, useEffect, useState, Suspense } from "react";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
  useRouterState,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { HelmetProvider } from "react-helmet-async";

import appCss from "../styles.css?url";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { SessionSecurityProvider } from "@/components/security/SessionSecurityProvider";
import { ScrollToTop } from "@/components/common/ScrollToTop";
import FloatingNavDock from "@/components/common/FloatingNavDock";
import { GlobalHreflang } from "@/components/seo/GlobalHreflang";
import TestPageViewTracker from "@/components/analytics/TestPageViewTracker";
import GlobalPageBackground from "@/components/layout/GlobalPageBackground";
import { AutoTranslatePage } from "@/components/i18n/AutoTranslatePage";
import { GlobalComparisonBar } from "@/components/compare/GlobalComparisonBar";
import { SiteAssistant } from "@/components/assistant/site-assistant";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import { lazyWithRetry } from "@/lib/lazyWithRetry";
import { loadCookiebot } from "@/lib/consent";

// The Radix toast renderer (and its dismissable-layer and collection code)
// loads once the browser is idle instead of in the entry script. Nothing is
// lost before it mounts: useToast() keeps toasts in a module-level store that
// the renderer reads when it subscribes. Sonner stays eager because its
// Toaster drops toasts fired before it mounts.
const LazyToaster = lazy(() =>
  import("@/components/ui/toaster").then((m) => ({ default: m.Toaster })),
);

function DeferredToaster() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const idle =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 1500));
    const id = idle(() => setReady(true), { timeout: 4000 });
    return () => {
      if (window.cancelIdleCallback && typeof id === "number")
        window.cancelIdleCallback(id);
    };
  }, []);
  if (!ready) return null;
  return (
    <Suspense fallback={null}>
      <LazyToaster />
    </Suspense>
  );
}

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
        "UK private blood-test comparison platform. Compare provider-listed prices, biomarkers, collection options and typical turnaround times. Information only, not medical care.",
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
          urlTemplate:
            "https://myhealthcheckup.co.uk/search?q={search_term_string}",
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    head: () => ({
      meta: [
        { charSet: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        // title / description are intentionally NOT set here. TanStack Router
        // concatenates root meta with route meta rather than merging by key, so
        // a sitewide default would emit a second title and description on every
        // page. Each route supplies its own via buildRouteHead().

        { name: "author", content: "MYHEALTHCHECKUP LTD" },
        { name: "robots", content: "index, follow" },
        {
          name: "google-site-verification",
          content: "d-S0SbPF-GVT1OxyYdzTj45dGI9dV0W5jRY76zau1GY",
        },
        { name: "geo.region", content: "GB" },
        { name: "geo.placename", content: "United Kingdom" },
        { property: "og:type", content: "website" },
        // og:title / og:description / og:url are intentionally NOT set here.
        // Each route supplies its own self-referencing social metadata via
        // buildRouteHead(), so a hardcoded homepage default would leak onto
        // sub-pages for crawlers that read the server-rendered shell.
        { property: "og:site_name", content: "myhealth checkup" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@myhealthcheckup" },
        { name: "theme-color", content: "#081129" },
        { name: "mobile-web-app-capable", content: "yes" },
        {
          name: "apple-mobile-web-app-status-bar-style",
          content: "black-translucent",
        },
      ],
      links: [
        // Warm the Cookiebot connections so the banner script, loaded after
        // hydration, does not pay DNS and TLS set-up on top.
        { rel: "preconnect", href: "https://consent.cookiebot.com" },
        { rel: "preconnect", href: "https://consentcdn.cookiebot.com" },
        { rel: "stylesheet", href: appCss },
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/favicon.png" },
        { rel: "manifest", href: "/manifest.json" },
        {
          rel: "alternate",
          hrefLang: "en-gb",
          href: "https://myhealthcheckup.co.uk/",
        },
        {
          rel: "alternate",
          hrefLang: "x-default",
          href: "https://myhealthcheckup.co.uk/",
        },
        { rel: "dns-prefetch", href: "https://storage.googleapis.com" },
      ],
      scripts: [
        // Cookiebot is not in the server-rendered head. RootShell loads
        // it after hydration: see loadCookiebot() in src/lib/consent.ts.
        { type: "application/ld+json", children: ORG_JSONLD },
      ],
    }),
    shellComponent: RootShell,
    component: RootComponent,
    notFoundComponent: NotFoundComponent,
    errorComponent: RootErrorComponent,
  },
);

function RootShell({ children }: { children: React.ReactNode }) {
  // Consent banner. Loaded here, after hydration, so uc.js cannot insert its
  // dialog into <body> ahead of React's markup. The shell renders for every
  // route, including the not-found and error pages.
  useEffect(() => {
    loadCookiebot();
  }, []);

  return (
    <html lang="en-GB" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {/* React's own container. Cookiebot's uc.js appends a hidden
            __uspapiLocator iframe to <body> while the page is still
            streaming; without this wrapper it can land inside a Suspense
            boundary's markers and fail hydration (or be deleted by React).
            Appended to <body> it now sits beside this div, where React
            skips unexpected nodes. display: contents keeps layout as before. */}
        <div id="app-root" style={{ display: "contents" }}>
          {children}
        </div>
        {/* Static, crawlable medical disclaimer + reviewer attribution (E-E-A-T). */}
        <p hidden id="static-medical-disclaimer" data-purpose="seo-eeat">
          <strong>Medical disclaimer:</strong> This site provides comparison
          information only and does not constitute medical advice. Consult your
          GP for medical guidance. Clinical content reviewed by Nathanial Smith,
          Registered Healthcare Professional (HCPC reg. PA43353).
        </p>
        <Scripts />
      </body>
    </html>
  );
}

const PageFallback = () => (
  <div className="flex items-center justify-center min-h-screen text-muted-foreground">
    Loading…
  </div>
);

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  // Crux Control and the admin sign-in pages are a separate app: no public
  // backdrop, floating nav or comparison bar over them.
  const isAdminArea = useRouterState({
    select: (s) => /^\/(control|admin)(\/|$)/.test(s.location.pathname),
  });

  // ported from main.tsx — Web Vitals RUM reporter (no-op in dev)
  useEffect(() => {
    void import("@/lib/webVitals").then((m) => m.installWebVitals());
  }, []);

  // One delegated listener logs every outbound provider link click.
  useEffect(() => {
    let uninstall: (() => void) | undefined;
    void import("@/lib/affiliate/affiliate-tracking").then((m) => {
      uninstall = m.installAffiliateClickTracking();
    });
    return () => uninstall?.();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18nInstance}>
        <AuthProvider>
          <SessionSecurityProvider>
            <HelmetProvider>
              <DeferredToaster />
              <Sonner />
              <ScrollToTop />
              {!isAdminArea && <GlobalPageBackground />}
              <GlobalHreflang />
              <TestPageViewTracker />
              {!isAdminArea && <FloatingNavDock />}
              <SiteAssistant />
              <AutoTranslatePage />
              {!isAdminArea && <GlobalComparisonBar />}
              <ErrorBoundary>
                <Suspense fallback={<PageFallback />}>
                  <Outlet />
                </Suspense>
              </ErrorBoundary>
            </HelmetProvider>
          </SessionSecurityProvider>
        </AuthProvider>
      </I18nextProvider>
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

function RootErrorComponent({ error, reset }: ErrorComponentProps) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <h1 className="text-2xl font-bold text-foreground mb-3">
        This page didn't load
      </h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Something went wrong on our end. You can try again or head back to the
        home page.
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
