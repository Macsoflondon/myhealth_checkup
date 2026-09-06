// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";

const isClientAbortError = (error: unknown): boolean =>
  error instanceof Error &&
  (/^aborted$/i.test(error.message) ||
    error.name === "AbortError" ||
    (error as { code?: unknown }).code === "ECONNRESET" ||
    /abortIncoming|socketOnClose/.test(error.stack ?? ""));

function clientAbortBoundary(): Plugin {
  const attachErrorBoundary = (request: IncomingMessage) => {
    request.on("error", (error) => {
      if (isClientAbortError(error)) return;
      console.error(error);
    });
  };

  return {
    name: "myhealth-client-abort-boundary",
    configureServer(server) {
      // Node emits abortIncoming on the IncomingMessage itself. Register before
      // Vite's request handler so a closed browser tab cannot become an
      // uncaught process error or a false blank-screen report.
      server.httpServer?.prependListener("request", attachErrorBoundary);
    },
    configurePreviewServer(server) {
      server.httpServer?.prependListener("request", attachErrorBoundary);
    },
  };
}
export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [clientAbortBoundary(), mcpPlugin()],
    // react-helmet-async ships CommonJS; bundle it so named exports interop under SSR.
    ssr: { noExternal: ["react-helmet-async"] },
    // react-helmet-async pulls these in lazily; without pre-bundling them up front
    // Vite re-optimises mid-session and force-reloads the page while React is
    // rendering, which surfaces as "resolveDispatcher().use of null" + blank screen.
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react-dom/client",
        "react-helmet-async",
        "invariant",
        "react-fast-compare",
        "shallowequal",
      ],
    },
    // NOTE: no manual vendor chunking. The previous hand-rolled manualChunks
    // grouping mis-assigned React itself into the "vendor-charts" chunk under
    // Rolldown, so every route — including "/" — modulepreloaded a 106 KB
    // chart bundle it never rendered. Rolldown's automatic splitting keeps
    // shared code in the entry graph and route-only code in route chunks.
  },
});
