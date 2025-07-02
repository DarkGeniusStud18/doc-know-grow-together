
/**
 * 🔧 Service Worker MedCollab - Version Professionnelle
 * Gestion avancée du cache et fonctionnalités PWA optimisées
 */

const CACHE_NAME = 'medcollab-cache-v2.0';
const STATIC_CACHE = 'medcollab-static-v2.0';
const DYNAMIC_CACHE = 'medcollab-dynamic-v2.0';

// Ressources essentielles à mettre en cache immédiatement
const CORE_ASSETS = [
  '/',
  '/splash',
  '/login',
  '/dashboard',
  '/tools',
  '/manifest.json',
  '/medcollab-logo.svg',
  '/offline.html'
];

// Ressources statiques à mettre en cache
const STATIC_ASSETS = [
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/favicon.ico'
];

// Stratégies de cache par type de ressource
const CACHE_STRATEGIES = {
  // Pages HTML - Network First avec fallback cache
  pages: 'networkFirst',
  // API Supabase - Network First avec cache courte durée
  api: 'networkFirst',
  // Assets statiques - Cache First
  static: 'cacheFirst',
  // Images - Cache First avec fallback réseau
  images: 'cacheFirst'
};

/**
 * 📦 Installation du Service Worker
 */
self.addEventListener('install', (event) => {
  console.log('🔧 MedCollab SW: Installation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources essentielles
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('📦 Cache des ressources essentielles');
        return cache.addAll(CORE_ASSETS);
      }),
      
      // Cache des assets statiques
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('🖼️ Cache des assets statiques');
        return cache.addAll(STATIC_ASSETS);
      })
    ]).then(() => {
      console.log('✅ MedCollab SW: Installation terminée');
      // Forcer l'activation immédiate
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Erreur installation SW:', error);
    })
  );
});

/**
 * 🔄 Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
  console.log('🔄 MedCollab SW: Activation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Prendre le contrôle immédiatement
      self.clients.claim()
    ]).then(() => {
      console.log('✅ MedCollab SW: Activation terminée');
    }).catch((error) => {
      console.error('❌ Erreur activation SW:', error);
    })
  );
});

/**
 * 🌐 Gestion des requêtes réseau
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Gestion spéciale pour Supabase
  if (url.hostname.includes('supabase.co')) {
    event.respondWith(handleSupabaseRequest(request));
    return;
  }
  
  // Gestion des pages HTML
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(handlePageRequest(request));
    return;
  }
  
  // Gestion des images
  if (request.headers.get('accept')?.includes('image/')) {
    event.respondWith(handleImageRequest(request));
    return;
  }
  
  // Gestion des autres ressources
  event.respondWith(handleGenericRequest(request));
});

/**
 * 📄 Gestion des requêtes de pages HTML
 */
async function handlePageRequest(request) {
  try {
    // Tenter d'abord le réseau
    const networkResponse = await fetch(request);
    
    // Mettre en cache si succès
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🔄 Fallback cache pour:', request.url);
    
    // Fallback vers le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Dernière option: page offline
    if (request.url.includes('/dashboard') || request.url.includes('/tools')) {
      return caches.match('/offline.html');
    }
    
    // Rediriger vers la page principale
    return caches.match('/');
  }
}

/**
 * 🖼️ Gestion des requêtes d'images
 */
async function handleImageRequest(request) {
  try {
    // Vérifier d'abord le cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Récupérer depuis le réseau
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Mettre en cache pour les futures requêtes
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🖼️ Image non disponible hors ligne:', request.url);
    // Retourner une image par défaut ou une réponse vide
    return new Response('', { status: 408, statusText: 'Image non disponible hors ligne' });
  }
}

/**
 * 🔗 Gestion des requêtes Supabase
 */
async function handleSupabaseRequest(request) {
  try {
    // Toujours essayer le réseau en premier pour Supabase
    const networkResponse = await fetch(request);
    
    // Cache sélectif pour certaines requêtes GET
    if (request.method === 'GET' && networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      // Cache avec expiration courte (5 minutes)
      const responseToCache = networkResponse.clone();
      responseToCache.headers.set('sw-cache-timestamp', Date.now().toString());
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    // Pour les requêtes GET uniquement, essayer le cache
    if (request.method === 'GET') {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        const cacheTimestamp = cachedResponse.headers.get('sw-cache-timestamp');
        const now = Date.now();
        
        // Vérifier si le cache n'est pas trop ancien (5 minutes)
        if (cacheTimestamp && (now - parseInt(cacheTimestamp)) < 5 * 60 * 1000) {
          console.log('📡 Données Supabase depuis le cache:', request.url);
          return cachedResponse;
        }
      }
    }
    
    throw error;
  }
}

/**
 * 🔧 Gestion générique des requêtes
 */
async function handleGenericRequest(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok && request.method === 'GET') {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    throw error;
  }
}

/**
 * 🔔 Gestion des messages (pour les mises à jour)
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('🔄 MedCollab SW: Saut de l\'attente demandé');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});

/**
 * 🔄 Gestion de la synchronisation en arrière-plan
 */
self.addEventListener('sync', (event) => {
  console.log('🔄 Synchronisation en arrière-plan:', event.tag);
  
  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync());
  }
});

/**
 * 🔄 Fonction de synchronisation en arrière-plan
 */
async function performBackgroundSync() {
  try {
    console.log('🔄 Exécution de la synchronisation en arrière-plan');
    
    // Ici vous pouvez ajouter la logique de synchronisation
    // Par exemple, envoyer les données mises en file d'attente
    
    // Nettoyer le cache dynamique s'il devient trop volumineux
    const cache = await caches.open(DYNAMIC_CACHE);
    const keys = await cache.keys();
    
    if (keys.length > 100) {
      console.log('🧹 Nettoyage du cache dynamique');
      // Supprimer les 20 entrées les plus anciennes
      const keysToDelete = keys.slice(0, 20);
      await Promise.all(keysToDelete.map(key => cache.delete(key)));
    }
  } catch (error) {
    console.error('❌ Erreur synchronisation arrière-plan:', error);
  }
}

console.log('🚀 MedCollab Service Worker v2.0 chargé');
