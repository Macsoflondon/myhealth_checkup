import React from "react";
import { logger } from "@/lib/logger";

/**
 * Lightweight, silent error boundary for non-critical homepage sections.
 *
 * Unlike the global ErrorBoundary, this never shows a "Something went wrong"
 * card — it just renders the provided `fallback` (or nothing) so the rest of
 * the page keeps working. Use it around third-party / DOM-heavy widgets like
 * PromoTracker and Leaflet maps where a single mount failure must not blank
 * the page.
 */
interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** For logs only — helps identify which section failed in production. */
  name?: string;
}

interface State {
  hasError: boolean;
}

export class SectionErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logger.error(`SectionErrorBoundary [${this.props.name ?? "unnamed"}] caught:`, {
      error: error?.message,
      stack: info?.componentStack,
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export default SectionErrorBoundary;
