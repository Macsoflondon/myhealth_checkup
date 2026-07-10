import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, RotateCw, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import cqcLogo from "@/assets/compliance/cqc-logo.png";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  copied?: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Preserve raw Error (stack) in devtools / Server Logs
     
    console.error("[ErrorBoundary]", error, errorInfo);
    logger.error("ErrorBoundary caught an error:", { error, errorInfo });
    this.setState({ errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, copied: false });
  };

  private handleReload = () => {
    if (typeof window !== "undefined") window.location.reload();
  };

  private buildDetails = (): string => {
    const { error, errorInfo } = this.state;
    if (!error) return "";
    return [
      `${error.name}: ${error.message}`,
      "",
      "Stack:",
      error.stack ?? "(no stack)",
      "",
      "Component stack:",
      errorInfo?.componentStack ?? "(no component stack)",
      "",
      `URL: ${typeof window !== "undefined" ? window.location.href : ""}`,
      `UA: ${typeof navigator !== "undefined" ? navigator.userAgent : ""}`,
    ].join("\n");
  };

  private handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(this.buildDetails());
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch {
      /* clipboard blocked — no-op */
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      const { error, errorInfo, copied } = this.state;

      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <Card className="max-w-xl w-full">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-destructive" />
              </div>
              <CardTitle>Something went wrong</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p className="text-muted-foreground text-sm">
                We encountered an unexpected error. Please try refreshing the page.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <Button onClick={this.handleRetry} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button onClick={this.handleReload} variant="outline">
                  <RotateCw className="w-4 h-4 mr-2" />
                  Reload Page
                </Button>
              </div>

              {error && (
                <details className="text-left rounded-md border border-border bg-muted/40">
                  <summary className="cursor-pointer select-none px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                    Technical details (tap to expand)
                  </summary>
                  <div className="px-3 pb-3 pt-1 space-y-2">
                    <div className="text-xs font-mono break-words text-destructive">
                      {error.name}: {error.message}
                    </div>
                    <pre className="text-[11px] font-mono whitespace-pre-wrap break-words max-h-60 overflow-auto rounded bg-background p-2 border border-border">
{error.stack ?? "(no stack)"}
                    </pre>
                    {errorInfo?.componentStack && (
                      <pre className="text-[11px] font-mono whitespace-pre-wrap break-words max-h-40 overflow-auto rounded bg-background p-2 border border-border">
{errorInfo.componentStack}
                      </pre>
                    )}
                    <Button
                      onClick={this.handleCopy}
                      variant="secondary"
                      size="sm"
                      className="w-full"
                    >
                      {copied ? (
                        <><Check className="w-4 h-4 mr-2" />Copied</>
                      ) : (
                        <><Copy className="w-4 h-4 mr-2" />Copy details</>
                      )}
                    </Button>
                  </div>
                </details>
              )}

              <div className="flex items-center justify-center pt-2 border-t border-border">
                <img src={cqcLogo} alt="CQC Regulated" className="h-6 w-auto opacity-70" />
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
