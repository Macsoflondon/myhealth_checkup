import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { installStaleAssetGuard } from "./lib/stale-asset-guard";

export const getRouter = () => {
  // Recover automatically when this tab holds an asset map that no longer
  // resolves (dev-server restart or redeploy) instead of white-screening.
  installStaleAssetGuard();

  // ported from src/App.tsx — catalogue-heavy app, data rarely changes
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 10 * 60 * 1000, // 10 minutes
        gcTime: 30 * 60 * 1000, // 30 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
