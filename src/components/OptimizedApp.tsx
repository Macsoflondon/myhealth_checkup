import { lazy, Suspense } from "react";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { Loader2 } from "lucide-react";

// Optimized loading component with skeleton
const OptimizedLoadingSpinner = ({ message = "Loading..." }: { message?: string }) => (
  <div className="flex items-center justify-center min-h-screen bg-slate-50">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-health-primary" />
      <p className="text-muted-foreground text-base font-medium">{message}</p>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded animate-pulse w-32 mx-auto"></div>
        <div className="h-3 bg-gray-200 rounded animate-pulse w-24 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Lazy load the main App component for code splitting
const LazyApp = lazy(() => import("@/App"));

// OptimizedApp v2.0 - No performance hooks here
export default function OptimizedApp() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<OptimizedLoadingSpinner message="Loading My Health Checkup..." />}>
        <LazyApp />
      </Suspense>
    </ErrorBoundary>
  );
}