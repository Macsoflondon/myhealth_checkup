import { AlertTriangle, RefreshCw, WifiOff, ServerOff } from "lucide-react";
import { Button } from "@/components/ui/button";

type ErrorStateVariant = "subtle" | "card" | "banner";
type ErrorType = "generic" | "network" | "server" | "empty";

interface ErrorStateProps {
  variant?: ErrorStateVariant;
  type?: ErrorType;
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const icons = {
  generic: AlertTriangle,
  network: WifiOff,
  server: ServerOff,
  empty: AlertTriangle,
};

const defaultMessages = {
  generic: "Something went wrong. Please try again.",
  network: "Please check your internet connection and try again.",
  server: "Our servers are having trouble. Please try again later.",
  empty: "No data available at the moment.",
};

const ErrorState = ({
  variant = "card",
  type = "generic",
  title,
  message,
  onRetry,
  className = "",
}: ErrorStateProps) => {
  const Icon = icons[type];
  const displayMessage = message || defaultMessages[type];

  if (variant === "subtle") {
    return (
      <div className={`flex items-center gap-2 text-muted-foreground ${className}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm">{displayMessage}</span>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm text-primary hover:underline"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`flex items-center justify-between gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 ${className}`}
      >
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-destructive" />
          <div>
            {title && (
              <p className="font-medium text-foreground">{title}</p>
            )}
            <p className="text-sm text-muted-foreground">{displayMessage}</p>
          </div>
        </div>
        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="outline">
            <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
            Retry
          </Button>
        )}
      </div>
    );
  }

  // Default: card variant
  return (
    <div
      className={`flex flex-col items-center justify-center p-6 rounded-lg border border-border bg-card text-center ${className}`}
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      {title && (
        <h4 className="font-medium text-foreground mb-1">{title}</h4>
      )}
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">
        {displayMessage}
      </p>
      {onRetry && (
        <Button onClick={onRetry} size="sm" variant="outline">
          <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
          Try again
        </Button>
      )}
    </div>
  );
};

export { ErrorState };
