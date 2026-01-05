import { Component, ErrorInfo, ReactNode } from "react";
import { logError } from "@/services/errorLogger";
import ErrorFallback from "./ErrorFallback";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class PageErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logError(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            <ErrorFallback
              variant="page"
              title="Page couldn't load"
              message="We encountered an unexpected error. Our team has been notified and is working on a fix."
              onRetry={this.handleReset}
              showHomeLink
            />
          </main>
          <Footer />
        </div>
      );
    }

    return this.props.children;
  }
}

export default PageErrorBoundary;
