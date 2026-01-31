import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "./components/common/ScrollToTop";
import BackToTop from "./components/common/BackToTop";
import { AppRoutes } from "./routes";
import { SessionSecurityProvider } from "./components/security/SessionSecurityProvider";

// Create QueryClient outside component to prevent recreation on every render
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => {
  
  return (
    <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <SessionSecurityProvider>
        <HelmetProvider>
          <TooltipProvider>
            <Helmet>
              <html lang="en" />
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
            </Helmet>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <BackToTop />
              <AppRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </HelmetProvider>
      </SessionSecurityProvider>
    </AuthProvider>
  </QueryClientProvider>
  );
};

export default App;
