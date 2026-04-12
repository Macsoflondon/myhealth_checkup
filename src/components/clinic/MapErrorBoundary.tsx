import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Error boundary for Leaflet map — handles React 19 strict mode double-init
 */
class MapErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; retryCount: number }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, retryCount: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (error.message === "Map container is already initialized." && this.state.retryCount < 3) {
      setTimeout(() => {
        this.setState((prev) => ({ hasError: false, retryCount: prev.retryCount + 1 }));
      }, 100);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="h-full w-full flex items-center justify-center bg-muted/50">
            <Loader2 className="w-8 h-8 animate-spin text-brand-pink" />
          </div>
        )
      );
    }
    return this.props.children;
  }
}

export default MapErrorBoundary;
