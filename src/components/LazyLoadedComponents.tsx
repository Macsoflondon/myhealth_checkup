import { lazy, Suspense, ComponentType } from "react";
import { Loader2 } from "lucide-react";
import { ErrorBoundary } from "./ErrorBoundary";

// Loading component
const LoadingSpinner = ({
  message = "Loading..."
}: {
  message?: string;
}) => <div className="flex items-center justify-center py-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-health-primary" />
      <p className="text-muted-foreground text-sm">{message}</p>
    </div>
  </div>;

// Higher-order component for lazy loading with error boundary
export function withLazyLoading<P extends object>(Component: ComponentType<P>, loadingMessage?: string) {
  const LazyComponent = lazy(() => Promise.resolve({
    default: Component
  }));
  return (props: P) => <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message={loadingMessage} />}>
        <LazyComponent {...props as any} />
      </Suspense>
    </ErrorBoundary>;
}

// Lazy-loaded components for better code splitting
export const LazyTestCategories = lazy(() => import("./TestCategories"));
export const LazyFeaturedProviders = lazy(() => import("./FeaturedProviders"));
export const LazyMostPopularTests = lazy(() => import("./MostPopularTests"));
export const LazyHealthBenefitsInfographic = lazy(() => import("./HealthBenefitsInfographic"));
export const LazyFounderStory = lazy(() => import("./FounderStory"));
export const LazyPartnerShowcase = lazy(() => import("./PartnerShowcase"));
export const LazyClinicMap = lazy(() => import("./ClinicMap"));
export const LazyHealthResources = lazy(() => import("./HealthResources"));
export const LazyHowItWorks = lazy(() => import("./HowItWorks"));
export const LazyMediaSpotlight = lazy(() => import("./MediaSpotlight"));

// Wrapped components with loading states
export const TestCategories = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading test categories..." />}>
      <LazyTestCategories className="bg-[#081129]" />
    </Suspense>
  </ErrorBoundary>;
export const FeaturedProviders = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading featured providers..." />}>
      <LazyFeaturedProviders />
    </Suspense>
  </ErrorBoundary>;
export const MostPopularTests = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading popular tests..." />}>
      <LazyMostPopularTests />
    </Suspense>
  </ErrorBoundary>;
export const HealthBenefitsInfographic = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading health benefits..." />}>
      <LazyHealthBenefitsInfographic />
    </Suspense>
  </ErrorBoundary>;
export const FounderStory = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading founder story..." />}>
      <LazyFounderStory />
    </Suspense>
  </ErrorBoundary>;
export const PartnerShowcase = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading partners..." />}>
      <LazyPartnerShowcase />
    </Suspense>
  </ErrorBoundary>;
export const ClinicMap = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading clinic map..." />}>
      <LazyClinicMap className="bg-[#081129]" />
    </Suspense>
  </ErrorBoundary>;
export const HealthResources = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading health resources..." />}>
      <LazyHealthResources />
    </Suspense>
  </ErrorBoundary>;
export const HowItWorks = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading process info..." />}>
      <LazyHowItWorks className="bg-[ansparent] bg-[#081120]" />
    </Suspense>
  </ErrorBoundary>;
export const MediaSpotlight = () => <ErrorBoundary>
    <Suspense fallback={<LoadingSpinner message="Loading media content..." />}>
      <LazyMediaSpotlight />
    </Suspense>
  </ErrorBoundary>;