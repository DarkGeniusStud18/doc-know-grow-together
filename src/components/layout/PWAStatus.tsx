
/**
 * Composant de statut PWA refactorisé pour MedCollab
 * 
 * Version optimisée avec respect des préférences utilisateur
 * Gestion intelligente du statut PWA sans spam de notifications
 */

import React, { useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
import { usePWAState } from './pwa-status/hooks/usePWAState';
import { usePWAActions } from './pwa-status/hooks/usePWAActions';
import { InstallPrompt } from './pwa-status/components/InstallPrompt';
import { UpdateNotification } from './pwa-status/components/UpdateNotification';

/**
 * Interface pour les événements PWA
 */
interface PWAEvents {
  onInstallPrompt?: () => void;
  onInstallSuccess?: () => void;
  onUpdateAvailable?: () => void;
}

/**
 * Composant principal de statut PWA refactorisé
 * 
 * Fonctionnalités optimisées avec respect des préférences utilisateur :
 * - Détection intelligente de l'installation PWA
 * - Gestion robuste des changements de connexion
 * - Notifications contextuelles respectant les préférences
 * - Prévention du spam de notifications
 */
export const PWAStatus: React.FC<PWAEvents> = ({
  onInstallPrompt,
  onInstallSuccess,
  onUpdateAvailable
}) => {
  // Vérification des préférences utilisateur
  const notificationsEnabled = localStorage.getItem('pwa-notifications') !== 'false';
  const notificationsDisabled = localStorage.getItem('pwa-notifications-disabled') === 'true';
  
  // États pour le contrôle de l'affichage
  const [lastNotificationTime, setLastNotificationTime] = useState(0);

  // Hook personnalisé pour la gestion de l'état PWA
  const { pwaState, setPwaState } = usePWAState({
    onInstallPrompt,
    onInstallSuccess,
    onUpdateAvailable
  });

  // Hook personnalisé pour les actions PWA
  const { handleInstallApp, handleDismissInstall, handleUpdateApp } = usePWAActions({
    installPromptEvent: pwaState.installPromptEvent,
    setPwaState,
    onInstallSuccess,
    onUpdateAvailable
  });

  /**
   * Vérifie si une notification peut être affichée (anti-spam)
   */
  const canShowNotification = (type: string, cooldownMs: number = 30000) => {
    if (!notificationsEnabled || notificationsDisabled) return false;
    
    const now = Date.now();
    const lastNotification = parseInt(localStorage.getItem(`last-${type}-notification`) || '0');
    
    if (now - lastNotification < cooldownMs) {
      return false;
    }
    
    localStorage.setItem(`last-${type}-notification`, now.toString());
    return true;
  };

  /**
   * Gestion des notifications de changement de connexion avec anti-spam
   */
  useEffect(() => {
    const handleConnectionNotification = () => {
      const now = Date.now();
      
      // Éviter les notifications trop fréquentes
      if (now - lastNotificationTime < 5000) return;
      
      if (pwaState.isOnline) {
        if (canShowNotification('connection-restored', 30000)) {
          toast.success('Connexion restaurée', {
            description: 'Synchronisation automatique en cours...',
            duration: 3000
          });
        }
      } else {
        if (canShowNotification('connection-lost', 30000)) {
          toast.warning('Mode hors ligne', {
            description: 'Certaines fonctionnalités peuvent être limitées',
            duration: 5000
          });
        }
      }
      
      setLastNotificationTime(now);
    };

    // Déclencher les notifications seulement lors des changements significatifs
    const timeSinceLastChange = Date.now() - pwaState.lastConnectionChange;
    if (timeSinceLastChange < 3000) {
      const timer = setTimeout(handleConnectionNotification, 1000);
      return () => clearTimeout(timer);
    }
  }, [pwaState.isOnline, pwaState.lastConnectionChange, lastNotificationTime]);

  /**
   * Notification pour l'installation disponible avec anti-spam
   */
  useEffect(() => {
    if (pwaState.showInstallPrompt && pwaState.installPromptEvent && notificationsEnabled && !notificationsDisabled) {
      if (canShowNotification('install-prompt', 86400000)) { // 24 heures
        toast.info('Installation disponible', {
          description: 'Vous pouvez installer MedCollab sur votre appareil pour un accès rapide',
          duration: 8000,
          action: {
            label: 'Installer',
            onClick: handleInstallApp
          }
        });
      }
    }
  }, [pwaState.showInstallPrompt, pwaState.installPromptEvent, handleInstallApp, notificationsEnabled, notificationsDisabled]);

  // Si les notifications sont complètement désactivées, ne rien afficher
  if (notificationsDisabled) {
    return null;
  }

  return (
    <>
      {/* Connection indicator removed - no longer displayed */}

      {/* Prompt d'installation PWA - seulement si notifications activées */}
      {notificationsEnabled && pwaState.showInstallPrompt && !pwaState.isInstalled && pwaState.installPromptEvent && (
        <InstallPrompt
          installPromptEvent={pwaState.installPromptEvent}
          onInstall={handleInstallApp}
          onDismiss={handleDismissInstall}
        />
      )}

      {/* Notification de mise à jour - seulement si notifications activées */}
      {notificationsEnabled && pwaState.updateAvailable && (
        <UpdateNotification onUpdate={handleUpdateApp} />
      )}
    </>
  );
};

export default PWAStatus;
