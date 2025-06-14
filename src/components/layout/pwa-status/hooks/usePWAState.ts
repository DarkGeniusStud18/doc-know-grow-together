
/**
 * Hook personnalisé pour la gestion de l'état PWA
 * 
 * Centralise toute la logique de détection et de gestion de l'état PWA
 * avec optimisations de performance et gestion d'erreurs robuste
 */

import { useState, useEffect, useCallback } from 'react';

/**
 * Interface pour l'état de la PWA avec typage strict
 */
interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  updateAvailable: boolean;
  showInstallPrompt: boolean;
  installPromptEvent: any; // BeforeInstallPromptEvent
  lastConnectionChange: number;
}

/**
 * Interface pour les événements PWA
 */
interface PWAEvents {
  onInstallPrompt?: () => void;
  onInstallSuccess?: () => void;
  onUpdateAvailable?: () => void;
}

/**
 * Hook principal pour la gestion de l'état PWA
 * Gère la détection, les événements et les changements d'état
 */
export const usePWAState = (events: PWAEvents = {}) => {
  // État centralisé de la PWA avec valeurs par défaut optimisées
  const [pwaState, setPwaState] = useState<PWAState>(() => ({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isInstalled: false,
    updateAvailable: false,
    showInstallPrompt: false,
    installPromptEvent: null,
    lastConnectionChange: Date.now()
  }));

  /**
   * Détection intelligente de l'installation PWA avec méthodes multiples
   */
  const detectInstallation = useCallback((): boolean => {
    // Méthode 1: Vérification de l'affichage en mode standalone (la plus fiable)
    if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
      console.log('PWAStatus: Application détectée en mode standalone');
      return true;
    }

    // Méthode 2: Vérification de la propriété navigator pour iOS Safari
    if ('standalone' in navigator && (navigator as any).standalone) {
      console.log('PWAStatus: Application détectée via navigator.standalone (iOS)');
      return true;
    }

    // Méthode 3: Vérification du user agent pour les PWA installées sur Android
    if (document.referrer.includes('android-app://')) {
      console.log('PWAStatus: Application détectée via Android app référer');
      return true;
    }

    // Méthode 4: Vérification des paramètres d'URL spécifiques PWA
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('pwa') === 'true' || urlParams.get('standalone') === 'true') {
      console.log('PWAStatus: Application détectée via paramètres URL');
      return true;
    }

    return false;
  }, []);

  /**
   * Gestionnaire optimisé des changements de connexion avec debouncing intelligent
   */
  const handleConnectionChange = useCallback((isOnline: boolean) => {
    const now = Date.now();
    
    // Éviter les notifications trop fréquentes (debouncing de 2 secondes)
    setPwaState(prev => {
      if (now - prev.lastConnectionChange < 2000) {
        return { ...prev, isOnline };
      }

      console.log('PWAStatus: Changement de connexion détecté:', isOnline ? 'En ligne' : 'Hors ligne');
      
      return { 
        ...prev, 
        isOnline, 
        lastConnectionChange: now 
      };
    });
  }, []);

  /**
   * Gestionnaire optimisé du prompt d'installation PWA
   */
  const handleInstallPrompt = useCallback((event: Event) => {
    console.log('PWAStatus: Prompt d\'installation PWA détecté');
    
    // Empêcher l'affichage automatique du prompt
    event.preventDefault();
    
    // Vérifier si l'utilisateur a récemment refusé l'installation
    const lastDecline = localStorage.getItem('pwa-install-decline-time');
    const declineThreshold = 7 * 24 * 60 * 60 * 1000; // 7 jours
    
    if (lastDecline && Date.now() - parseInt(lastDecline) < declineThreshold) {
      console.log('PWAStatus: Prompt d\'installation ignoré (récemment refusé)');
      return;
    }
    
    setPwaState(prev => ({
      ...prev,
      showInstallPrompt: true,
      installPromptEvent: event
    }));
    
    // Callback optionnel pour les parents
    events.onInstallPrompt?.();
  }, [events.onInstallPrompt]);

  /**
   * Configuration des écouteurs d'événements avec nettoyage automatique
   */
  useEffect(() => {
    console.log('PWAStatus: Initialisation du hook PWA v1.3.0');
    
    // Détection initiale de l'installation avec mise à jour de l'état
    const isInstalled = detectInstallation();
    setPwaState(prev => ({ ...prev, isInstalled }));
    
    // Écouteurs pour les changements de connexion avec gestion optimisée
    const handleOnline = () => handleConnectionChange(true);
    const handleOffline = () => handleConnectionChange(false);
    
    // Écouteur pour le prompt d'installation avec gestion d'état
    const handleBeforeInstallPrompt = (event: Event) => handleInstallPrompt(event);
    
    // Écouteur pour la détection d'installation réussie
    const handleAppInstalled = () => {
      console.log('PWAStatus: Application installée détectée via événement');
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: true, 
        showInstallPrompt: false,
        installPromptEvent: null
      }));
      
      events.onInstallSuccess?.();
    };
    
    // Écouteur pour les mises à jour du service worker
    const handleServiceWorkerUpdate = () => {
      console.log('PWAStatus: Mise à jour du service worker détectée');
      setPwaState(prev => ({ ...prev, updateAvailable: true }));
      events.onUpdateAvailable?.();
    };
    
    // Enregistrement des écouteurs avec options optimisées
    window.addEventListener('online', handleOnline, { passive: true });
    window.addEventListener('offline', handleOffline, { passive: true });
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled, { passive: true });
    
    // Vérification périodique des mises à jour PWA
    const updateInterval = setInterval(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistration().then(registration => {
          if (registration) {
            registration.update().catch(err => {
              console.warn('PWAStatus: Erreur lors de la vérification automatique:', err);
            });
          }
        });
      }
    }, 10 * 60 * 1000); // Vérification toutes les 10 minutes
    
    // Nettoyage des écouteurs et intervalles
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      clearInterval(updateInterval);
    };
  }, [detectInstallation, handleConnectionChange, handleInstallPrompt, events]);

  return {
    pwaState,
    setPwaState
  };
};
