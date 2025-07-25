
/**
 * Hook optimisé pour l'état PWA - Version corrigée
 * 
 * Fournit un état PWA stable et fonctionnel
 */

import { useState, useEffect, useCallback } from 'react';

interface PWAState {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  updateAvailable: boolean;
}

/**
 * Hook principal pour gérer l'état PWA de manière optimisée
 * Version corrigée qui évite les re-renders excessifs
 */
export const usePWAState = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isOnline: navigator.onLine,
    isInstalled: false,
    canInstall: false,
    updateAvailable: false
  });

  // Gestionnaire stable pour les changements de connexion
  const handleOnlineChange = useCallback(() => {
    setPwaState(prev => ({ ...prev, isOnline: navigator.onLine }));
  }, []);

  // Gestionnaire pour l'événement beforeinstallprompt
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    e.preventDefault();
    setPwaState(prev => ({ ...prev, canInstall: true }));
  }, []);

  useEffect(() => {
    // Détection de l'installation PWA
    const checkInstallation = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      setPwaState(prev => ({ 
        ...prev, 
        isInstalled: isStandalone || isInWebAppiOS 
      }));
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

  return { pwaState };
};
