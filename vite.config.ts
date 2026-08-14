// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import { imagetools } from "vite-imagetools";

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
