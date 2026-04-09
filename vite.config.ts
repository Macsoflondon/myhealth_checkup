import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import vitePrerender from "vite-plugin-prerender";

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
      mode === 'development' &&
      componentTagger(),
      mode === 'production' &&
      vitePrerender({
        staticDir: path.join(__dirname, 'dist'),
        routes: [
          '/',
          '/about',
          '/how-it-works',
          '/compare',
          '/test-categories',
          '/search',
          '/contact',
          '/faqs',
          '/blog',
          '/partners',
          '/legal',
          '/sitemap',
          '/find-clinic',
          '/at-home-tests',
          '/most-popular',
          '/recommendations',
          '/tests/cancer',
          '/tests/diabetes',
          '/tests/heart',
          '/tests/vitamins',
          '/tests/gut',
          '/tests/mens-health',
          '/tests/womens-health',
          '/tests/general-health',
          '/tests/vitamin-d',
          '/tests/iron-profile',
          '/tests/lipid-profile',
          '/tests/female-hormones',
          '/tests/male-hormones',
          '/tests/well-woman',
          '/thyroid',
          '/hormones',
          '/fertility-tests',
          '/mens-health',
          '/womens-health',
          '/sports-performance',
          '/cancer-screening',
          '/conditions',
          '/privacy-policy',
          '/terms',
          '/cookies',
          '/accessibility',
          '/how-we-rank',
          '/affiliate-disclosure',
          '/fair-trading',
          '/modern-slavery',
          '/auth',
          '/dashboard',
        ],
        renderer: {
          renderAfterDocumentEvent: 'x-render-complete',
          maxConcurrentRoutes: 4,
          headless: true,
        },
      }),
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
          manualChunks: {
            // Vendor chunks for better caching
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
