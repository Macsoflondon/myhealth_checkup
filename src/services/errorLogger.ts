import * as Sentry from "@sentry/react";
import type { ErrorInfo } from "react";

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({ dsn, environment: import.meta.env.MODE });
}

export type ErrorCategory = "NETWORK" | "AUTH" | "DATA" | "RENDER" | "USER_ACTION";

export interface ErrorContext {
  componentStack?: string;
  sectionName?: string;
  componentName?: string;
  category?: ErrorCategory;
  route?: string;
  userId?: string;
  timestamp?: string;
  [key: string]: unknown;
}

export function logError(error: Error, errorInfo?: ErrorInfo | ErrorContext): void {
  const context: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    route: typeof window !== "undefined" ? window.location.pathname : undefined,
    ...(errorInfo && "componentStack" in errorInfo ? { componentStack: errorInfo.componentStack } : {}),
    ...errorInfo,
  };

  if (dsn) {
    Sentry.captureException(error, { extra: context });
  } else {
    console.error("ErrorBoundary caught an error", error, context);
  }
}

export function logApiError(error: Error, endpoint: string, context?: Record<string, unknown>): void {
  const errorContext: ErrorContext = {
    category: "NETWORK",
    endpoint,
    ...context,
  };
  logError(error, errorContext);
}

export function logComponentError(error: Error, componentName: string, props?: Record<string, unknown>): void {
  const errorContext: ErrorContext = {
    category: "RENDER",
    componentName,
    props: props ? JSON.stringify(props) : undefined,
  };
  logError(error, errorContext);
}

export function logUserAction(action: string, metadata?: Record<string, unknown>): void {
  if (dsn) {
    Sentry.addBreadcrumb({
      category: "user-action",
      message: action,
      data: metadata,
      level: "info",
    });
  } else {
    console.log("User action:", action, metadata);
  }
}

export function setUserContext(userId: string, email?: string): void {
  if (dsn) {
    Sentry.setUser({ id: userId, email });
  }
}

export function clearUserContext(): void {
  if (dsn) {
    Sentry.setUser(null);
  }
}
