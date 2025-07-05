import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
      clientPort: 8080,
    },
  },
  plugins: [
    react(),
    // Only enable PWA in production to avoid development conflicts
    mode === "production" &&
      VitePWA({
        registerType: "autoUpdate",
        includeAssets: [
          "favicon.ico",
          "apple-touch-icon.png",
          "lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
          "lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
        ],
        workbox: {
          globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
          navigateFallback: "/index.html",
          navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
          maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
          skipWaiting: true,
          clientsClaim: true,
        },
        manifest: {
          name: "MedCollab - Plateforme Médicale Collaborative",
          short_name: "MedCollab",
          description:
            "Plateforme collaborative pour étudiants et professionnels de santé avec outils d'étude avancés",
          start_url: "/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#1f2937",
          orientation: "portrait-primary",
          scope: "/",
          lang: "fr",
          categories: ["education", "medical", "productivity"],
          icons: [
            {
              src: "/lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any",
            },
          ],
        },
      }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: "globalThis",
  },
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1000,
    sourcemap: false,
    rollupOptions: {
      external: ["lovable-tagger"],
    },
  },
}));
