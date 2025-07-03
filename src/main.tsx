
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
 * Enregistrement du Service Worker PWA UNIQUEMENT pour la production
 * Évite les conflits avec le WebSocket de Vite en développement
 */
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', async () => {
    try {
      console.log('PWA: Enregistrement du Service Worker pour la production...');
      
      // Enregistrement du service worker généré par Vite PWA
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none' // Toujours vérifier les mises à jour
      });
      
      console.log('PWA: Service Worker enregistré avec succès:', registration.scope);
      
      // Gestion des mises à jour du service worker
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (newWorker) {
          console.log('PWA: Nouvelle version du Service Worker détectée');
          
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('PWA: Nouvelle version prête - rechargement recommandé');
              
              // Notification de mise à jour disponible
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
  });

  window.addEventListener('offline', () => {
    console.log('PWA: Connexion réseau perdue - mode hors ligne activé');
  });
} else if (import.meta.env.DEV) {
  console.log('PWA: Mode développement - Service Worker désactivé pour éviter les conflits');
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

// Ajout de métadonnées PWA dans le DOM UNIQUEMENT pour la production
if (import.meta.env.PROD) {
  // Ajout de la balise meta pour le theme-color dynamique
  const themeColorMeta = document.createElement('meta');
  themeColorMeta.name = 'theme-color';
  themeColorMeta.content = '#1f2937';
  document.head.appendChild(themeColorMeta);

  // Ajout de la balise meta pour apple-mobile-web-app-capable
  const appleMobileMeta = document.createElement('meta');
  appleMobileMeta.name = 'apple-mobile-web-app-capable';
  appleMobileMeta.content = 'yes';
  document.head.appendChild(appleMobileMeta);

  // Ajout de la balise meta pour apple-mobile-web-app-status-bar-style
  const appleStatusBarMeta = document.createElement('meta');
  appleStatusBarMeta.name = 'apple-mobile-web-app-status-bar-style';
  appleStatusBarMeta.content = 'black-translucent';
  document.head.appendChild(appleStatusBarMeta);

  console.log('PWA: Métadonnées mobiles ajoutées pour la production');
}
