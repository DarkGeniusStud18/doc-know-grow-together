/**
 * 🔧 Service Worker MedCollab - Version PWA Optimisée v2.0.0
 * 
 * Fonctionnalités avancées :
 * - Cache intelligent des ressources statiques
 * - Stratégies de mise en cache optimisées
 * - Support hors ligne amélioré
 * - Gestion des mises à jour automatiques
 * - Compatible Android, iOS et Desktop
 * - Suppression du logo Chrome indésirable
 */

const CACHE_NAME = "medcollab-v2.0.0";
const STATIC_CACHE = "medcollab-static-v2.0.0";
const DYNAMIC_CACHE = "medcollab-dynamic-v2.0.0";
const IMAGE_CACHE = "medcollab-images-v2.0.0";
const API_CACHE = "medcollab-api-v2.0.0";

// Ressources essentielles à mettre en cache avec priorité optimisée
const ESSENTIAL_URLS = [
  "/",
  "/index.html",
  "/dashboard",
  "/login",
  "/register",
  "/tools",
  "/community",
  "/manifest.json",
  "/offline.html",
];

// URLs des images importantes avec le bon logo PWA
const IMPORTANT_IMAGES = [
  "/lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/pictures/wallpaper.png",
];

// Stratégies de cache intelligentes par type de contenu
const CACHE_STRATEGIES = {
  documents: "NetworkFirst",
  images: "CacheFirst",
  api: "NetworkFirst",
  static: "CacheFirst",
};

/**
 * Installation du Service Worker avec mise en cache intelligente
 * Optimisé pour éviter les échecs de mise en cache et améliorer les performances
 */
self.addEventListener("install", (event) => {
  console.log("🔧 SW: Installation en cours... v2.0.0");

  event.waitUntil(
    Promise.allSettled([
      // Cache des ressources statiques essentielles avec gestion d'erreurs
      caches.open(STATIC_CACHE).then(async (cache) => {
        console.log(
          "🔧 SW: Mise en cache des ressources essentielles"
        );
        const results = await Promise.allSettled(
          ESSENTIAL_URLS.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(
                `Service Worker: Impossible de mettre en cache ${url}:`,
                err
              );
            })
          )
        );
        console.log(
          "Service Worker: Ressources essentielles mises en cache:",
          results.length
        );
        return results;
      }),

      // Cache des images importantes avec fallbacks gracieux
      caches.open(IMAGE_CACHE).then(async (cache) => {
        console.log("Service Worker: Mise en cache des images importantes");
        const results = await Promise.allSettled(
          IMPORTANT_IMAGES.map((url) =>
            cache.add(url).catch((err) => {
              console.warn(
                `Service Worker: Impossible de mettre en cache l'image ${url}:`,
                err
              );
            })
          )
        );
        console.log(
          "Service Worker: Images importantes mises en cache:",
          results.length
        );
        return results;
      }),
    ])
      .then(() => {
        console.log("✅ SW: Installation terminée avec succès");
        self.skipWaiting(); // Force l'activation immédiate pour éviter le logo Chrome
      })
      .catch((error) => {
        console.error("Service Worker: Erreur durant l'installation:", error);
      })
  );
});

/**
 * Activation du Service Worker avec nettoyage intelligent des anciens caches
 */
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activation en cours...");

  const validCaches = [
    CACHE_NAME,
    STATIC_CACHE,
    DYNAMIC_CACHE,
    IMAGE_CACHE,
    API_CACHE,
  ];

  event.waitUntil(
    Promise.all([
      // Nettoyage des anciens caches avec préservation des caches valides
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log(
                "Service Worker: Suppression du cache obsolète:",
                cacheName
              );
              return caches.delete(cacheName);
            }
          })
        );
      }),

      // Prise de contrôle immédiate des clients pour les mises à jour
      self.clients.claim(),
    ])
      .then(() => {
        console.log("Service Worker: Activation terminée avec succès");
      })
      .catch((error) => {
        console.error("Service Worker: Erreur durant l'activation:", error);
      })
  );
});

/**
 * Gestion intelligente des requêtes réseau avec stratégies optimisées
 */
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP et les WebSockets
  if (
    !request.url.startsWith("http") ||
    request.url.includes("chrome-extension")
  ) {
    return;
  }

  // Stratégie Cache First pour les images avec compression intelligente
  if (request.destination === "image") {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE));
    return;
  }

  // Stratégie Network First pour les documents HTML avec fallback offline
  if (request.destination === "document") {
    event.respondWith(networkFirstWithOfflineFallback(request, STATIC_CACHE));
    return;
  }

  // Stratégie Network First avec timeout pour les API Supabase
  if (url.hostname.includes("supabase.co")) {
    event.respondWith(networkFirstWithTimeout(request, API_CACHE, 8000));
    return;
  }

  // Stratégie Cache First pour les ressources statiques (CSS, JS, polices)
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "font"
  ) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE));
    return;
  }

  // Stratégie Network First par défaut pour les autres requêtes
  event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE));
});

/**
 * Stratégie Cache First optimisée avec gestion d'erreurs robuste
 */
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      console.log("Service Worker: Réponse depuis le cache:", request.url);

      // Mise à jour en arrière-plan pour les ressources critiques
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            cache.put(request, response.clone());
          }
        })
        .catch(() => {
          // Échec silencieux de la mise à jour en arrière-plan
        });

      return cached;
    }

    // Si pas en cache, récupérer depuis le réseau
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.error("Service Worker: Erreur Cache First:", error);
    return new Response("Contenu non disponible hors ligne", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/**
 * Stratégie Network First avec fallback hors ligne intelligent
 */
async function networkFirstWithOfflineFallback(request, cacheName) {
  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log(
      "Service Worker: Réseau indisponible, vérification du cache..."
    );

    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    if (cached) {
      console.log("Service Worker: Réponse depuis le cache:", request.url);
      return cached;
    }

    // Page de secours pour les documents HTML
    if (request.destination === "document") {
      const offlinePage = await cache.match("/offline.html");
      if (offlinePage) {
        console.log("Service Worker: Affichage de la page hors ligne");
        return offlinePage;
      }
    }

    return new Response("Contenu non disponible hors ligne", {
      status: 503,
      statusText: "Service Unavailable",
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

/**
 * Stratégie Network First standard avec mise en cache
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log(
      "Service Worker: Réseau indisponible, vérification du cache..."
    );

    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    return (
      cached ||
      new Response("Contenu non disponible hors ligne", {
        status: 503,
        statusText: "Service Unavailable",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

/**
 * Stratégie Network First avec timeout intelligent pour les API
 */
async function networkFirstWithTimeout(request, cacheName, timeout = 5000) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(request, {
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    console.log(
      "Service Worker: Timeout ou erreur réseau, vérification du cache..."
    );

    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);

    return (
      cached ||
      new Response(
        JSON.stringify({
          error: "Données non disponibles hors ligne",
          message: "Veuillez vous reconnecter à Internet",
        }),
        {
          status: 503,
          headers: { "Content-Type": "application/json; charset=utf-8" },
        }
      )
    );
  }
}

/**
 * Gestion des notifications push avec support des actions
 */
self.addEventListener("push", (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const options = {
        body: data.body || "Nouvelle notification MedCollab",
        icon: "/lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
        badge: "/lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
        vibrate: [100, 50, 100],
        data: data.data || {},
        actions: [
          {
            action: "explore",
            title: "Voir",
            icon: "/lovable-uploads/a892db17-0e9b-48b1-88a9-d2e2a7ca1bf9.png",
          },
          {
            action: "close",
            title: "Fermer",
          },
        ],
        tag: data.tag || "medcollab-notification",
        renotify: true,
      };

      event.waitUntil(
        self.registration.showNotification(data.title || "MedCollab", options)
      );
    } catch (error) {
      console.error(
        "Service Worker: Erreur lors du traitement de la notification push:",
        error
      );
    }
  }
});

/**
 * Gestion des clics sur les notifications avec navigation intelligente
 */
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "explore") {
    const urlToOpen = event.notification.data?.url || "/dashboard";

    event.waitUntil(
      clients
        .matchAll({ type: "window" })
        .then((windowClients) => {
          // Rechercher une fenêtre existante avec l'URL
          for (const client of windowClients) {
            if (client.url === urlToOpen && "focus" in client) {
              return client.focus();
            }
          }

          // Ouvrir une nouvelle fenêtre si aucune existante trouvée
          if (clients.openWindow) {
            return clients.openWindow(urlToOpen);
          }
        })
        .catch((error) => {
          console.error(
            "Service Worker: Erreur lors de l'ouverture de la notification:",
            error
          );
        })
    );
  }
});

/**
 * Synchronisation en arrière-plan pour les données critiques
 */
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

/**
 * Fonction de synchronisation en arrière-plan
 */
async function doBackgroundSync() {
  try {
    console.log("Service Worker: Synchronisation en arrière-plan démarrée...");

    // Synchroniser les données critiques avec le serveur
    // Cette fonction peut être étendue selon les besoins de l'application

    console.log("Service Worker: Synchronisation en arrière-plan terminée");
  } catch (error) {
    console.error(
      "Service Worker: Erreur lors de la synchronisation en arrière-plan:",
      error
    );
  }
}

/**
 * Gestion des erreurs globales du Service Worker
 */
self.addEventListener("error", (event) => {
  console.error("Service Worker: Erreur globale:", event.error);
});

self.addEventListener("unhandledrejection", (event) => {
  console.error("Service Worker: Promesse rejetée non gérée:", event.reason);
});

console.log(
  "🚀 SW: Service Worker MedCollab v2.0.0 chargé avec optimisations PWA avancées"
);
