import * as Sentry from "@sentry/react";
import type { ErrorInfo } from "react";

const dsn = import.meta.env.VITE_SENTRY_DSN;

if (dsn) {
  Sentry.init({ dsn, environment: import.meta.env.MODE });
}

export function logError(error: Error, errorInfo: ErrorInfo): void {
  if (dsn) {
    Sentry.captureException(error, { extra: errorInfo });
  } else {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }
}
