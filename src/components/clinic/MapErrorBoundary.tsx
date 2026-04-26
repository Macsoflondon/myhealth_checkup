import React from "react";
import { Loader2 } from "lucide-react";

type MapBoundaryChildren = React.ReactNode | ((remountKey: number) => React.ReactNode);

/**
 * Error boundary for Leaflet maps.
 *
 * Handles the React 19 / Strict Mode "Map container is already initialized."
 * race by remounting the entire subtree with a fresh key, instead of just
 * flipping a state flag (which would re-attach to the same DOM node and
 * immediately re-throw).
 */
class MapErrorBoundary extends React.Component<
  { children: MapBoundaryChildren; fallback?: React.ReactNode },
  { hasError: boolean; remountKey: number }
> {
  private retryCount = 0;
  private readonly maxRetries = 2;

  constructor(props: { children: MapBoundaryChildren; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, remountKey: 0 };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    if (
      error?.message === "Map container is already initialized." &&
      this.retryCount < this.maxRetries
    ) {
      this.retryCount += 1;
      // Remount with a brand new key so Leaflet binds to a fresh DOM node.
      window.setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          remountKey: prev.remountKey + 1,
        }));
      }, 50);
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

    const content =
      typeof this.props.children === "function"
        ? this.props.children(this.state.remountKey)
        : this.props.children;

    return (
      <div key={`map-remount-${this.state.remountKey}`} className="contents">
        {content}
      </div>
    );
  }
}

export default MapErrorBoundary;
