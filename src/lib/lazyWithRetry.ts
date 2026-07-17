import { lazy, type ComponentType } from "react";

/**
 * Wraps React.lazy so that when a dynamic import fails because the client
 * is holding a stale index.html referencing chunk hashes that no longer
 * exist after a redeploy, we reload the page once to fetch fresh HTML +
 * chunk graph. Prevents the "Importing a module script failed" white-screen.
 */
export function lazyWithRetry<T extends ComponentType<unknown>>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(async () => {
    const RELOAD_KEY = "__lovable_chunk_reloaded__";
    try {
      return await factory();
    } catch (err) {
      const msg = (err as Error)?.message ?? "";
      const isChunkError =
        /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module|ChunkLoadError/i.test(
          msg,
        );
      if (isChunkError && typeof window !== "undefined") {
        const alreadyReloaded = sessionStorage.getItem(RELOAD_KEY);
        if (!alreadyReloaded) {
          sessionStorage.setItem(RELOAD_KEY, "1");
          window.location.reload();
          // Return a never-resolving promise so Suspense keeps its fallback
          // shown until the reload takes effect.
          return new Promise(() => {}) as never;
        }
      }
      throw err;
    }
  });
}
