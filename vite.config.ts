import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { ogMetaPlugin } from "./plugins/ogMetaPlugin";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' && componentTagger(),
      mode === 'production' && ogMetaPlugin(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom"],
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'import.meta.env.VITE_SUPABASE_KEY': JSON.stringify(env.VITE_SUPABASE_KEY),
    },
    build: {
      rollupOptions: {
        output: {
          // Vite 8 (Rolldown) only supports the function form of manualChunks.
          manualChunks: (id: string) => {
            const vendorChunks: Record<string, string[]> = {
              'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'ui-vendor': [
                '@radix-ui/react-dialog',
                '@radix-ui/react-dropdown-menu',
                '@radix-ui/react-tabs',
                '@radix-ui/react-toast',
                '@radix-ui/react-select',
                '@radix-ui/react-accordion',
              ],
              'supabase-vendor': ['@supabase/supabase-js', '@tanstack/react-query'],
              'map-vendor': ['leaflet', 'react-leaflet', 'react-leaflet-cluster'],
              'chart-vendor': ['recharts'],
              'i18n-vendor': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
              'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
            };
            if (!id.includes('node_modules')) return undefined;
            for (const [chunk, pkgs] of Object.entries(vendorChunks)) {
              if (pkgs.some((p) => id.includes(`node_modules/${p}/`))) return chunk;
            }
            return undefined;
          },
        },
      },
      chunkSizeWarningLimit: 1000,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-query',
        '@supabase/supabase-js',
      ],
    },
  };
});
