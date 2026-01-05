import { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "@/services/errorLogger";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  componentName?: string;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

class ComponentErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, {
      componentStack: errorInfo.componentStack ?? undefined,
      componentName: this.props.componentName,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center gap-2 p-3 rounded-md bg-muted text-muted-foreground text-sm">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>Unable to load</span>
          <button
            onClick={this.handleReset}
            className="ml-auto flex items-center gap-1 text-primary hover:underline"
          >
            <RefreshCw className="h-3 w-3" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ComponentErrorBoundary;
