import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/**
 * Test harness providing React Query context. Router context is not mounted:
 * unit tests render components in isolation and stub router-compat hooks where
 * a component actually reads location or search params.
 */
export function TestProviders({ children }: { children?: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
