
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: true,
      clientPort: 8080
    },
    // Amélioration de la stabilité du serveur de développement
    fs: {
      strict: false
    }
  },
  // Optimisation de la résolution des dépendances
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query',
      '@supabase/supabase-js',
      'lucide-react',
      'date-fns',
      'clsx',
      'tailwind-merge'
    ],
    exclude: [
      '@capacitor/preferences',
      '@capacitor/network',
      '@capacitor/push-notifications',
      '@capacitor/share',
      '@capacitor/haptics',
      '@capacitor/app',
      '@capacitor/keyboard',
      '@capacitor/status-bar'
    ]
  },
  plugins: [
    react(),
    mode === 'production' && VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/_/, /\/[^/?]+\.[^/]+$/],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'document',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'medcollab-documents',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7
              }
            }
          },
          {
            urlPattern: /^https:\/\/yblwafdsidkuzgzfazpf\.supabase\.co\/.*$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'medcollab-supabase',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'medcollab-images',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30
              }
            }
          }
        ]
      },
      manifest: {
        name: 'MedCollab - Plateforme Médicale Collaborative',
        short_name: 'MedCollab',
        description: 'Plateforme collaborative pour étudiants et professionnels de santé avec outils d\'étude avancés',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1f2937',
        orientation: 'portrait-primary',
        scope: '/',
        lang: 'fr',
        categories: ['education', 'medical', 'productivity'],
        shortcuts: [
          {
            name: 'Tableau de bord',
            short_name: 'Dashboard',
            description: 'Accéder au tableau de bord principal',
            url: '/dashboard',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Outils d\'étude',
            short_name: 'Outils',
            description: 'Accéder aux outils d\'apprentissage',
            url: '/tools',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Communauté',
            short_name: 'Communauté',
            description: 'Rejoindre les discussions communautaires',
            url: '/community',
            icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }]
          }
        ],
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    }),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    global: 'globalThis',
    __WS_TOKEN__: mode === 'development' ? '"dev-token"' : 'undefined'
  },
  // Configuration du CSS pour éviter les erreurs de traitement
  css: {
    postcss: {
      plugins: []
    },
    devSourcemap: mode === 'development'
  },
  build: {
    // Optimisation pour éviter les erreurs de build
    target: 'es2020',
    rollupOptions: {
      external: [
        '@capacitor/preferences',
        '@capacitor/network',
        '@capacitor/push-notifications',
        '@capacitor/share',
        '@capacitor/haptics',
        '@capacitor/app',
        '@capacitor/keyboard',
        '@capacitor/status-bar'
      ],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          charts: ['recharts'],
          utils: ['date-fns', 'clsx', 'tailwind-merge']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // Amélioration de la gestion des modules
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  // Configuration pour éviter les erreurs de dépendances - Fixed TypeScript error
  ssr: {
    noExternal: mode === 'development' ? true : undefined
  }
}));
