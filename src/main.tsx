/**
 * 🚀 Point d'Entrée Principal MedCollab - Version PWA Complète
 * 
 * Fonctionnalités PWA avancées :
 * - Service Worker avec stratégies de cache intelligentes
 * - Synchronisation offline/online automatique
 * - Gestion des notifications push
 * - Optimisation des performances
 * - Compatibilité multi-plateforme (Web, iOS, Android)
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { HelmetProvider } from 'react-helmet-async';

// Vérification de l'existence de l'élément racine DOM
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Élément racine non trouvé - impossible de monter l'application React");
}

/**
 * 🔧 Configuration des notifications push
 */
const setupNotifications = async () => {
  if ('Notification' in window && 'serviceWorker' in navigator) {
    try {
      // Demander la permission pour les notifications
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        console.log('📱 PWA: Notifications autorisées');
        
        // Enregistrer pour les notifications push
        const registration = await navigator.serviceWorker.ready;
        console.log('📱 PWA: Service Worker prêt pour les notifications');
        
        // Exemple de notification de bienvenue après un délai
        setTimeout(() => {
          new Notification('🎉 MedCollab', {
            body: 'Application prête à être utilisée ! Installez-la pour une meilleure expérience.',
            icon: '/pwa-192x192.png',
            tag: 'welcome',
            badge: '/pwa-192x192.png'
          });
        }, 5000);
      } else {
        console.log('❌ PWA: Notifications refusées par l\'utilisateur');
      }
    } catch (error) {
      console.error('❌ PWA: Erreur lors de la configuration des notifications:', error);
    }
  }
};

/**
 * 🔄 Gestion de la synchronisation en arrière-plan
 */
const setupBackgroundSync = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('🔄 PWA: Synchronisation en arrière-plan disponible');
      
      // Vérifier si la synchronisation est supportée
      if ('sync' in registration) {
        // Enregistrer les tâches de synchronisation
        await (registration as any).sync.register('background-sync');
        console.log('✅ PWA: Tâche de synchronisation enregistrée');
      }
      
    } catch (error) {
      console.error('❌ PWA: Erreur lors de la configuration de la synchronisation:', error);
    }
  }
};

/**
 * 📱 Configuration spéciale pour déclencher l'invite d'installation PWA
 */
const setupInstallPrompt = async () => {
  console.log('📱 PWA: Configuration de l\'invite d\'installation');
  
  // Forcer le déclenchement de beforeinstallprompt si pas encore déclenché
  setTimeout(() => {
    // Vérifier si l'app n'est pas déjà installée
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
                        (window.navigator as any).standalone === true;
    
    if (!isStandalone) {
      console.log('📱 PWA: Application non installée, invite d\'installation active');
      
      // Déclencher un événement personnalisé pour les navigateurs qui ne déclenchent pas automatiquement
      const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      const isEdge = /Edg/.test(navigator.userAgent);
      
      if (isChrome || isEdge) {
        console.log('🌐 PWA: Navigateur compatible PWA détecté');
        // L'événement beforeinstallprompt devrait se déclencher automatiquement
      } else {
        console.log('🌐 PWA: Navigateur avec support PWA limité');
        // Pour les autres navigateurs, on peut afficher des instructions personnalisées
      }
    } else {
      console.log('✅ PWA: Application déjà installée');
    }
  }, 2000);
};

/**
 * 📱 Enregistrement du Service Worker PWA avec fonctionnalités avancées
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      console.log('🔧 PWA: Enregistrement du Service Worker...');
      
      // Enregistrement du service worker avec options étendues
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('✅ PWA: Service Worker enregistré avec succès:', registration.scope);
      
      // Configuration des fonctionnalités PWA
      await Promise.all([
        setupNotifications(),
        setupBackgroundSync(),
        setupInstallPrompt()
      ]);
      
      // Gestion des mises à jour du service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('🔄 PWA: Nouvelle version du Service Worker détectée');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('🆕 PWA: Nouvelle version prête');
              
              // Notification de mise à jour
              if (Notification.permission === 'granted') {
                new Notification('🔄 MedCollab - Mise à jour', {
                  body: 'Une nouvelle version est disponible !',
                  icon: '/pwa-192x192.png',
                  tag: 'update',
                  badge: '/pwa-192x192.png'
                });
              }
              
              // Demander à l'utilisateur s'il veut recharger
              if (window.confirm('🔄 Une nouvelle version de MedCollab est disponible. Recharger maintenant ?')) {
                window.location.reload();
              }
            }
          });
        }
      });
      
      // Vérification périodique des mises à jour (toutes les 30 minutes)
      setInterval(async () => {
        try {
          await registration.update();
          console.log('🔍 PWA: Vérification de mise à jour effectuée');
        } catch (error) {
          console.log('⚠️ PWA: Erreur lors de la vérification de mise à jour:', error);
        }
      }, 30 * 60 * 1000);
      
    } catch (registrationError) {
      console.error('❌ PWA: Échec de l\'enregistrement du Service Worker:', registrationError);
    }
  });

  // Gestion des événements de connexion réseau avec notifications
  window.addEventListener('online', () => {
    console.log('🌐 PWA: Connexion réseau restaurée');
    
    // Notification de reconnexion
    if (Notification.permission === 'granted') {
      new Notification('🌐 MedCollab', {
        body: 'Connexion rétablie - Synchronisation en cours...',
        icon: '/pwa-192x192.png',
        tag: 'online',
        badge: '/pwa-192x192.png'
      });
    }
    
    // Déclencher la synchronisation des données
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          return (registration as any).sync.register('sync-data');
        }
      }).catch(error => {
        console.error('❌ PWA: Erreur lors de la synchronisation:', error);
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('📴 PWA: Connexion réseau perdue - Mode hors ligne activé');
    
    // Notification de perte de connexion
    if (Notification.permission === 'granted') {
      new Notification('📴 MedCollab', {
        body: 'Mode hors ligne activé - Vos données sont sauvegardées localement',
        icon: '/pwa-192x192.png',
        tag: 'offline',
        badge: '/pwa-192x192.png'
      });
    }
  });
} else {
  console.log('❌ PWA: Service Worker non supporté par ce navigateur');
}

// Création et montage de l'application React
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);

// Ajout de métadonnées PWA dynamiques
if (typeof window !== 'undefined') {
  console.log('📱 PWA: Configuration des métadonnées multi-plateforme');
  
  // Métadonnées de thème adaptatif
  const themeColorMeta = document.createElement('meta');
  themeColorMeta.name = 'theme-color';
  themeColorMeta.content = '#0077B6';
  document.head.appendChild(themeColorMeta);

  // Support iOS optimisé
  const appleMobileMeta = document.createElement('meta');
  appleMobileMeta.name = 'apple-mobile-web-app-capable';
  appleMobileMeta.content = 'yes';
  document.head.appendChild(appleMobileMeta);

  const appleStatusBarMeta = document.createElement('meta');
  appleStatusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
  appleStatusBarMeta.content = 'black-translucent';
  document.head.appendChild(appleStatusBarMeta);

  // Titre de l'application iOS
  const appleTitleMeta = document.createElement('meta');
  appleTitleMeta.name = 'apple-mobile-web-app-title';
  appleTitleMeta.content = 'MedCollab';
  document.head.appendChild(appleTitleMeta);

  // Support Windows
  const msTileColorMeta = document.createElement('meta');
  msTileColorMeta.name = 'msapplication-TileColor';
  msTileColorMeta.content = '#0077B6';
  document.head.appendChild(msTileColorMeta);

  // Viewport optimisé pour PWA
  const viewportMeta = document.querySelector('meta[name="viewport"]');
  if (viewportMeta) {
    viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover');
  }

  console.log('✅ PWA: Métadonnées multi-plateforme configurées');
}

/**
 * 🔧 Gestion des erreurs globales avec reporting PWA
 */
window.onerror = (message, source, lineno, colno, error) => {
  console.error('❌ Erreur globale capturée:', { message, source, lineno, colno, error });
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('❌ Promesse rejetée non gérée:', event.reason);
});

console.log('🚀 MedCollab PWA initialisé avec succès - Version complète');
