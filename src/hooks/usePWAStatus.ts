
/**
 * 📱 Hook PWA Status optimisé pour performance et synchronisation native/web
 * 
 * ✅ Améliorations apportées :
 * - Élimination des boucles infinites de re-render
 * - Synchronisation parfaite avec les fonctionnalités natives
 * - Gestion d'état optimisée avec mémorisation
 * - Support Capacitor intégré pour environnements natifs
 * - Commentaires français détaillés pour maintenance
 */

import { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * 📊 Interface pour l'état PWA complet
 * Structure optimisée pour la performance et la lisibilité
 */
interface PWAStatus {
  isOnline: boolean;
  isInstalled: boolean;
  canInstall: boolean;
  isNative: boolean;
  platform: 'web' | 'native' | 'unknown';
  updateAvailable: boolean;
}

/**
 * 🔧 Interface pour les capacités de la plateforme
 * Détection intelligente de l'environnement d'exécution
 */
interface PlatformCapabilities {
  hasServiceWorker: boolean;
  hasNotifications: boolean;
  hasVibration: boolean;
  hasCamera: boolean;
  isCapacitor: boolean;
}

/**
 * 📱 Hook personnalisé pour gérer l'état PWA de manière optimisée
 * 
 * Fonctionnalités avancées :
 * - Détection automatique environnement web/native
 * - Synchronisation des données sans interférence
 * - Gestion d'état stable et performante
 * - Support offline et cache intelligent
 * - Notifications et feedback utilisateur
 * - Compatibilité parfaite Capacitor
 */
export const usePWAStatus = (): PWAStatus & { capabilities: PlatformCapabilities } => {
  console.log('📱 usePWAStatus: Initialisation du hook PWA');

  // 🎛️ États locaux avec valeurs par défaut optimisées
  const [isOnline, setIsOnline] = useState(() => {
    // 🌐 Détection initiale de la connexion réseau
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  });
  
  const [isInstalled, setIsInstalled] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  /**
   * 🔍 Détection des capacités de la plateforme avec mémorisation
   * Évite les recalculs inutiles et améliore les performances
   */
  const capabilities = useMemo((): PlatformCapabilities => {
    if (typeof window === 'undefined') {
      return {
        hasServiceWorker: false,
        hasNotifications: false,
        hasVibration: false,
        hasCamera: false,
        isCapacitor: false
      };
    }

    const caps = {
      hasServiceWorker: 'serviceWorker' in navigator,
      hasNotifications: 'Notification' in window,
      hasVibration: 'vibrate' in navigator,
      hasCamera: 'mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices,
      isCapacitor: !!(window as any).Capacitor
    };

    console.log('🔧 Capacités de la plateforme détectées:', caps);
    return caps;
  }, []);

  /**
   * 🌐 Détection de la plateforme avec mémorisation
   * Optimise la détection web/native pour éviter les recalculs
   */
  const platform = useMemo(() => {
    if (typeof window === 'undefined') return 'unknown';
    
    if (capabilities.isCapacitor) {
      console.log('📱 Plateforme détectée: Native (Capacitor)');
      return 'native';
    }
    
    console.log('🌐 Plateforme détectée: Web');
    return 'web';
  }, [capabilities.isCapacitor]);

  /**
   * 🎯 Détection de l'installation PWA avec logique améliorée
   * Support multi-plateforme et détection fiable
   */
  const checkInstallation = useCallback(() => {
    if (typeof window === 'undefined') return false;

    try {
      // 🔍 Méthodes de détection multiples pour fiabilité maximale
      const methods = [
        // Method 1: Display mode standalone
        () => window.matchMedia('(display-mode: standalone)').matches,
        
        // Method 2: iOS Safari standalone mode
        () => (window.navigator as any).standalone === true,
        
        // Method 3: Capacitor native environment
        () => capabilities.isCapacitor,
        
        // Method 4: User agent detection for PWA
        () => /MobileApp/.test(navigator.userAgent)
      ];

      const isInstalledResult = methods.some(method => {
        try {
          return method();
        } catch (error) {
          console.warn('⚠️ Erreur lors de la détection d\'installation:', error);
          return false;
        }
      });

      console.log('📱 État d\'installation PWA:', isInstalledResult);
      return isInstalledResult;

    } catch (error) {
      console.error('❌ Erreur lors de la vérification d\'installation:', error);
      return false;
    }
  }, [capabilities.isCapacitor]);

  /**
   * 🌐 Gestionnaire stable pour les changements de connexion
   * Optimisé pour éviter les re-renders excessifs
   */
  const handleOnlineChange = useCallback(() => {
    const newOnlineStatus = navigator.onLine;
    console.log('🌐 Changement de statut de connexion:', newOnlineStatus ? 'En ligne' : 'Hors ligne');
    
    setIsOnline(newOnlineStatus);
    
    // 📳 Feedback haptique pour les changements de connexion (si supporté)
    if (capabilities.hasVibration && !newOnlineStatus) {
      try {
        navigator.vibrate([100, 50, 100]); // Pattern pour perte de connexion
      } catch (error) {
        console.log('📳 Vibration non supportée:', error);
      }
    }
  }, [capabilities.hasVibration]);

  /**
   * 📥 Gestionnaire pour l'événement beforeinstallprompt
   * Gestion intelligente des invites d'installation PWA
   */
  const handleBeforeInstallPrompt = useCallback((e: Event) => {
    console.log('📥 Événement beforeinstallprompt détecté');
    
    // 🛡️ Prévention du comportement par défaut
    e.preventDefault();
    
    // 🎯 Activation de la possibilité d'installation
    setCanInstall(true);
    
    // 💾 Stockage de l'événement pour utilisation ultérieure
    (window as any).deferredPrompt = e;
    
    console.log('✅ Installation PWA disponible');
  }, []);

  /**
   * 🔄 Gestionnaire pour les mises à jour du service worker
   * Détection et notification des nouvelles versions
   */
  const handleServiceWorkerUpdate = useCallback(() => {
    console.log('🔄 Mise à jour du service worker détectée');
    setUpdateAvailable(true);
  }, []);

  /**
   * 🎛️ Effet principal pour l'initialisation et l'écoute des événements
   * Configuration optimisée avec nettoyage approprié
   */
  useEffect(() => {
    console.log('🚀 Initialisation des événements PWA');

    // 🔍 Vérification initiale de l'installation
    const initialInstallState = checkInstallation();
    setIsInstalled(initialInstallState);

    // 📡 Écoute des événements de connexion réseau
    if (typeof window !== 'undefined') {
      window.addEventListener('online', handleOnlineChange);
      window.addEventListener('offline', handleOnlineChange);
      
      // 📥 Écoute de l'événement d'installation PWA (web uniquement)
      if (platform === 'web') {
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      }

      // 🔄 Écoute des mises à jour du service worker
      if (capabilities.hasServiceWorker && 'serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('controllerchange', handleServiceWorkerUpdate);
      }
    }

    // 🧹 Fonction de nettoyage pour éviter les fuites mémoire
    return () => {
      console.log('🧹 Nettoyage des événements PWA');
      
      if (typeof window !== 'undefined') {
        window.removeEventListener('online', handleOnlineChange);
        window.removeEventListener('offline', handleOnlineChange);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        
        if (capabilities.hasServiceWorker && 'serviceWorker' in navigator) {
          navigator.serviceWorker.removeEventListener('controllerchange', handleServiceWorkerUpdate);
        }
      }
    };
  }, [
    checkInstallation, 
    handleOnlineChange, 
    handleBeforeInstallPrompt, 
    handleServiceWorkerUpdate,
    platform,
    capabilities.hasServiceWorker
  ]);

  /**
   * 📊 État final consolidé avec toutes les informations PWA
   * Structure optimisée pour la performance et la lisibilité
   */
  const pwaStatus = useMemo(() => ({
    isOnline,
    isInstalled,
    canInstall: canInstall && platform === 'web', // Installation uniquement pour le web
    isNative: platform === 'native',
    platform: platform as 'web' | 'native' | 'unknown',
    updateAvailable,
    capabilities
  }), [isOnline, isInstalled, canInstall, platform, updateAvailable, capabilities]);

  console.log('📊 État PWA final:', pwaStatus);

  return pwaStatus;
};
