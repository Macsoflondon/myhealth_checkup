import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type ErrorFallbackVariant = "inline" | "card" | "page";

interface ErrorFallbackProps {
  variant?: ErrorFallbackVariant;
  title?: string;
  message?: string;
  onRetry?: () => void;
  showHomeLink?: boolean;
}

const ErrorFallback = ({
  variant = "card",
  title = "Something went wrong",
  message = "We're having trouble loading this content. Please try again.",
  onRetry,
  showHomeLink = false,
}: ErrorFallbackProps) => {
  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2 text-destructive py-2">
        <AlertTriangle className="h-4 w-4 flex-shrink-0" />
        <span className="text-sm">{message}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium underline hover:no-underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === "page") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-semibold text-foreground mb-2">{title}</h1>
          <p className="text-muted-foreground mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && (
              <Button onClick={onRetry} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" />
                Try again
              </Button>
            )}
            <Button asChild variant="outline">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                Go home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Default: card variant
  return (
    <div className="rounded-lg border border-border bg-card p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
        <AlertTriangle className="h-6 w-6 text-destructive" />
      </div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      <div className="flex gap-2 justify-center">
        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="default">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Try again
          </Button>
        )}
        {showHomeLink && (
          <Button asChild size="sm" variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
