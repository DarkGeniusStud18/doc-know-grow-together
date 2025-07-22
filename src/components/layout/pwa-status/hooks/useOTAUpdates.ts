/**
 * 🔄 Hook personnalisé pour la gestion des mises à jour OTA
 * 
 * Fonctionnalités :
 * - Détection automatique des mises à jour
 * - Gestion d'état centralisée
 * - Support Capacitor.js
 * - Notifications et callbacks personnalisables
 */

import { useState, useEffect, useCallback } from 'react';

export interface OTAUpdateState {
  hasUpdate: boolean;
  isChecking: boolean;
  isInstalling: boolean;
  lastChecked: Date | null;
  error: string | null;
  version: string | null;
}

export interface OTAUpdateCallbacks {
  onUpdateAvailable?: () => void;
  onUpdateInstalled?: () => void;
  onUpdateError?: (error: string) => void;
  onUpdateDismissed?: () => void;
}

/**
 * 🔄 Hook pour la gestion des mises à jour Over-The-Air
 * Intégration complète avec PWA et Capacitor.js
 */
export const useOTAUpdates = (callbacks?: OTAUpdateCallbacks) => {
  const [updateState, setUpdateState] = useState<OTAUpdateState>({
    hasUpdate: false,
    isChecking: false,
    isInstalling: false,
    lastChecked: null,
    error: null,
    version: null
  });

  /**
   * 🔍 Vérification des mises à jour disponibles
   */
  const checkForUpdates = useCallback(async () => {
    setUpdateState(prev => ({ 
      ...prev, 
      isChecking: true, 
      error: null 
    }));

    try {
      console.log('🔍 useOTAUpdates: Vérification des mises à jour...');
      
      if (!('serviceWorker' in navigator)) {
        throw new Error('Service Workers non supportés');
      }

      const registrations = await navigator.serviceWorker.getRegistrations();
      let updateFound = false;
      
      for (const registration of registrations) {
        await registration.update();
        
        if (registration.waiting) {
          updateFound = true;
          console.log('✅ Mise à jour détectée!');
          
          setUpdateState(prev => ({ 
            ...prev, 
            hasUpdate: true, 
            lastChecked: new Date(),
            isChecking: false,
            version: 'latest'
          }));
          
          callbacks?.onUpdateAvailable?.();
          break;
        }
      }
      
      if (!updateFound) {
        setUpdateState(prev => ({ 
          ...prev, 
          isChecking: false,
          lastChecked: new Date(),
          hasUpdate: false 
        }));
        console.log('✅ Application à jour');
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('❌ Erreur vérification mises à jour:', errorMessage);
      
      setUpdateState(prev => ({ 
        ...prev, 
        isChecking: false,
        error: errorMessage 
      }));
      
      callbacks?.onUpdateError?.(errorMessage);
    }
  }, [callbacks]);

  /**
   * 📥 Installation de la mise à jour
   */
  const installUpdate = useCallback(async () => {
    setUpdateState(prev => ({ ...prev, isInstalling: true, error: null }));
    
    try {
      console.log('📥 Installation de la mise à jour...');
      
      const registrations = await navigator.serviceWorker.getRegistrations();
      
      for (const registration of registrations) {
        if (registration.waiting) {
          // Active le nouveau service worker
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          
          // Écoute l'activation du nouveau worker
          const newWorker = registration.waiting;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'activated') {
              console.log('✅ Nouveau service worker activé');
              callbacks?.onUpdateInstalled?.();
              
              // Recharge après un délai
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            }
          });
          
          break;
        }
      }
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur d\'installation';
      console.error('❌ Erreur installation:', errorMessage);
      
      setUpdateState(prev => ({ 
        ...prev, 
        isInstalling: false,
        error: errorMessage 
      }));
      
      callbacks?.onUpdateError?.(errorMessage);
    }
  }, [callbacks]);

  /**
   * 🚫 Ignorer la mise à jour
   */
  const dismissUpdate = useCallback(() => {
    setUpdateState(prev => ({ 
      ...prev, 
      hasUpdate: false 
    }));
    callbacks?.onUpdateDismissed?.();
  }, [callbacks]);

  /**
   * ⚡ Configuration des événements et vérifications automatiques
   */
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Vérification initiale
      checkForUpdates();
      
      // Vérification périodique (30 minutes)
      const interval = setInterval(checkForUpdates, 30 * 60 * 1000);
      
      // Écoute des événements du service worker
      const messageHandler = (event: MessageEvent) => {
        if (event.data && event.data.type === 'SW_UPDATE_AVAILABLE') {
          console.log('📢 Mise à jour détectée via message SW');
          checkForUpdates();
        }
      };
      
      // Écoute des changements de contrôleur
      const controllerChangeHandler = () => {
        console.log('🔄 Nouveau service worker prend le contrôle');
        window.location.reload();
      };
      
      navigator.serviceWorker.addEventListener('message', messageHandler);
      navigator.serviceWorker.addEventListener('controllerchange', controllerChangeHandler);
      
      // Nettoyage
      return () => {
        clearInterval(interval);
        navigator.serviceWorker.removeEventListener('message', messageHandler);
        navigator.serviceWorker.removeEventListener('controllerchange', controllerChangeHandler);
      };
    }
  }, [checkForUpdates]);

  return {
    updateState,
    checkForUpdates,
    installUpdate,
    dismissUpdate
  };
};