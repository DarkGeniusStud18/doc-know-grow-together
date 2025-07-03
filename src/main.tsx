
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
        console.log('PWA: Notifications autorisées');
        
        // Enregistrer pour les notifications push
        const registration = await navigator.serviceWorker.ready;
        console.log('PWA: Service Worker prêt pour les notifications');
        
        // Exemple de notification de bienvenue
        setTimeout(() => {
          new Notification('MedCollab', {
            body: 'Application prête à être utilisée !',
            icon: '/medcollab-logo.svg',
            tag: 'welcome'
          });
        }, 2000);
      } else {
        console.log('PWA: Notifications refusées par l\'utilisateur');
      }
    } catch (error) {
      console.error('PWA: Erreur lors de la configuration des notifications:', error);
    }
  }
};

/**
 * 🔄 Gestion de la synchronisation en arrière-plan
 */
const setupBackgroundSync = async () => {
  if ('serviceWorker' in navigator && 'serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.ready;
      console.log('PWA: Synchronisation en arrière-plan disponible');
      
      // Vérifier si la synchronisation est supportée
      if ('sync' in registration) {
        // Enregistrer les tâches de synchronisation
        await (registration as any).sync.register('background-sync');
      }
      
    } catch (error) {
      console.error('PWA: Erreur lors de la configuration de la synchronisation:', error);
    }
  }
};

/**
 * 📱 Enregistrement du Service Worker PWA avec fonctionnalités avancées
 */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      console.log('PWA: Enregistrement du Service Worker...');
      
      // Enregistrement du service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('PWA: Service Worker enregistré avec succès:', registration.scope);
      
      // Configuration des fonctionnalités PWA
      await setupNotifications();
      await setupBackgroundSync();
      
      // Gestion des mises à jour du service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('PWA: Nouvelle version du Service Worker détectée');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('PWA: Nouvelle version prête');
              
              // Notification de mise à jour
              if (Notification.permission === 'granted') {
                new Notification('MedCollab - Mise à jour', {
                  body: 'Une nouvelle version est disponible !',
                  icon: '/medcollab-logo.svg',
                  tag: 'update'
                });
              }
              
              // Demander à l'utilisateur s'il veut recharger
              if (window.confirm('Une nouvelle version de MedCollab est disponible. Recharger maintenant ?')) {
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
          console.log('PWA: Vérification de mise à jour effectuée');
        } catch (error) {
          console.log('PWA: Erreur lors de la vérification de mise à jour:', error);
        }
      }, 30 * 60 * 1000);
      
    } catch (registrationError) {
      console.error('PWA: Échec de l\'enregistrement du Service Worker:', registrationError);
    }
  });

  // Gestion des événements de connexion réseau
  window.addEventListener('online', () => {
    console.log('PWA: Connexion réseau restaurée');
    
    // Notification de reconnexion
    if (Notification.permission === 'granted') {
      new Notification('MedCollab', {
        body: 'Connexion rétablie - Synchronisation en cours...',
        icon: '/medcollab-logo.svg',
        tag: 'online'
      });
    }
    
    // Déclencher la synchronisation des données
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        if ('sync' in registration) {
          return (registration as any).sync.register('sync-data');
        }
      }).catch(error => {
        console.error('PWA: Erreur lors de la synchronisation:', error);
      });
    }
  });

  window.addEventListener('offline', () => {
    console.log('PWA: Connexion réseau perdue - Mode hors ligne activé');
    
    // Notification de perte de connexion
    if (Notification.permission === 'granted') {
      new Notification('MedCollab', {
        body: 'Mode hors ligne activé - Vos données sont sauvegardées localement',
        icon: '/medcollab-logo.svg',
        tag: 'offline'
      });
    }
  });
} else {
  console.log('PWA: Service Worker non supporté par ce navigateur');
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
  // Métadonnées de thème adaptatif
  const themeColorMeta = document.createElement('meta');
  themeColorMeta.name = 'theme-color';
  themeColorMeta.content = '#0077B6';
  document.head.appendChild(themeColorMeta);

  // Support iOS
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

  console.log('PWA: Métadonnées multi-plateforme ajoutées');
}

/**
 * 🔧 Gestion des erreurs globales
 */
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Erreur globale capturée:', { message, source, lineno, colno, error });
  return false;
};

window.addEventListener('unhandledrejection', (event) => {
  console.error('Promesse rejetée non gérée:', event.reason);
});

console.log('🚀 MedCollab PWA initialisé avec succès');
