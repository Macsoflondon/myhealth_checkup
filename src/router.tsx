import "./lib/zod-jitless";
import { QueryClient, dehydrate, hydrate } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import {
  createIsomorphicFn,
  getGlobalStartContext,
} from "@tanstack/react-start";
import { routeTree } from "./routeTree.gen";
import { installStaleAssetGuard } from "./lib/stale-asset-guard";

/**
 * The CSP nonce for this render. On the server it is the per-request value
 * from the security-headers middleware; in the browser it is read back from a
 * nonced script (the .nonce property, since browsers blank the attribute).
 */
const getCspNonce = createIsomorphicFn()
  .server((): string | undefined => {
    const ctx = getGlobalStartContext() as { cspNonce?: unknown } | undefined;
    return typeof ctx?.cspNonce === "string" ? ctx.cspNonce : undefined;
  })
  .client((): string | undefined => {
    const el = document.querySelector<HTMLScriptElement>("script[nonce]");
    return el?.nonce || undefined;
  });

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
    ssr: { nonce: getCspNonce() },
    dehydrate: () => ({
      queryState: JSON.stringify(
        dehydrate(queryClient, {
          shouldDehydrateMutation: () => false,
          shouldDehydrateQuery: (query) => query.state.status === "success",
        }),
      ),
    }),
    hydrate: (state) => {
      hydrate(queryClient, JSON.parse(state.queryState));
    },
  });

  return router;
};
