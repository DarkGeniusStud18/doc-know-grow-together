
/**
 * Hook optimisé pour l'état PWA sans boucles infinies
 * 
 * Version simplifiée pour éviter les problèmes de re-render
 */

import { useState, useEffect, useCallback } from 'react';

interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
}

/**
 * Hook personnalisé pour gérer l'état PWA de manière stable
 * Évite les boucles infinies en limitant les mises à jour
 */
export const usePWAStatus = (): PWAStatus => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  // Gestionnaire stable pour les changements de connexion
  const handleOnlineChange = useCallback(() => {
    setIsOnline(navigator.onLine);
  }, []);

  // Gestionnaire pour l'événement beforeinstallprompt
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setCanInstall(true);
  }, []);

  useEffect(() => {
    // Détection de l'installation PWA
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setIsInstalled(isStandalone || isInWebAppiOS);
    };

    // Vérification initiale
    checkInstallation();

    // Écoute des événements de connexion
    window.addEventListener('online', handleOnlineChange);
    window.addEventListener('offline', handleOnlineChange);
    
    // Écoute de l'événement d'installation PWA
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Nettoyage
    return () => {
      window.removeEventListener('online', handleOnlineChange);
      window.removeEventListener('offline', handleOnlineChange);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [handleOnlineChange, handleBeforeInstallPrompt]);

  return {
    isOnline,
    isInstalled,
    canInstall
  };
};
