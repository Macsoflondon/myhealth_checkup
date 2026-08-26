// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import { imagetools } from "vite-imagetools";

// The Vite dev server owns the Node HTTP socket, so a client navigating away
// mid-request surfaces as an uncaught `Error: aborted` from abortIncoming in
// this process — before any app module loads. Swallow it here, at config load,
// so it never reaches the runtime-error reporter as a phantom crash.
const isClientAbortError = (error: unknown): boolean =>
  error instanceof Error &&
  (/^aborted$/i.test(error.message) ||
    error.name === "AbortError" ||
    (error as { code?: unknown }).code === "ECONNRESET" ||
    /abortIncoming|socketOnClose/.test(error.stack ?? "") ||
    // Stale asset id requested by a page loaded before the dev server restarted:
    // the imagetools cache is in-memory, so the id is simply gone. Dev-only noise.
    /vite-imagetools cannot find image with id/.test(error.message));

const guardFlag = "__mhcViteAbortGuard";
if (!(process as unknown as Record<string, unknown>)[guardFlag]) {
  (process as unknown as Record<string, unknown>)[guardFlag] = true;
  const logAbort = (error: unknown, kind: string) => {
    const err = error as Error & { code?: string };
    console.warn(
      `[abort] ${JSON.stringify({
        at: new Date().toISOString(),
        phase: "vite-dev",
        kind,
        message: err?.message,
        code: err?.code,
        stackHead: err?.stack?.split("\n").slice(0, 4).join(" | "),
      })}`,
    );
  };
  process.on("uncaughtException", (error) => {
    if (isClientAbortError(error)) return logAbort(error, "uncaughtException");
    throw error;
  });
  process.on("unhandledRejection", (reason) => {
    if (isClientAbortError(reason)) return logAbort(reason, "unhandledRejection");
    throw reason;
  });
}

export default defineConfig({
  tanstackStart: {

    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    // imagetools generates responsive AVIF/WebP variants at build time.
    // Query params (?w=480;768;1200&format=avif&as=srcset) drive the output.
    plugins: [imagetools(), mcpPlugin()],
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
    build: {
      // Split rarely-changing vendor code into stable, long-cacheable chunks so a
      // product deploy doesn't invalidate the whole JS payload.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
            if (id.includes("leaflet")) return "vendor-maps";
            if (id.includes("framer-motion")) return "vendor-motion";
            if (id.includes("@supabase")) return "vendor-supabase";
            if (id.includes("@radix-ui")) return "vendor-radix";
            if (
              id.includes("react-dom") ||
              id.includes("/react/") ||
              id.includes("@tanstack")
            ) {
              return "vendor-react";
            }
            return undefined;
          },
        },
      },
    },
  },
});
